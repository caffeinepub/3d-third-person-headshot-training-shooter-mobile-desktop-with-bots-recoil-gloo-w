import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ScoreRecord = {
    score : Nat;
    headshots : Nat;
  };

  module ScoreRecord {
    public func compare(a : ScoreRecord, b : ScoreRecord) : Order.Order {
      Nat.compare(a.score, b.score);
    };
  };

  type PlayerSettings = {
    aimAssistEnabled : Bool;
    sensitivity : Float;
    audioVolume : Float;
    qualitySettings : Text;
  };

  module PlayerSettings {
    public func compare(a : PlayerSettings, b : PlayerSettings) : Order.Order {
      if (a.sensitivity != b.sensitivity) {
        Float.compare(a.sensitivity, b.sensitivity);
      } else if (a.audioVolume != b.audioVolume) {
        Float.compare(a.audioVolume, b.audioVolume);
      } else {
        Text.compare(a.qualitySettings, b.qualitySettings);
      };
    };
  };

  type PlayerProfile = {
    settings : PlayerSettings;
    bestScore : ScoreRecord;
  };

  let playerProfiles = Map.empty<Principal, PlayerProfile>();

  let defaultPlayerSettings : PlayerSettings = {
    aimAssistEnabled = true;
    sensitivity = 1.0;
    audioVolume = 0.5;
    qualitySettings = "medium";
  };

  let defaultScoreRecord : ScoreRecord = { score = 0; headshots = 0 };

  // Any caller (including guests) can read their own profile
  // Guests get defaults, authenticated users get persisted data
  public query ({ caller }) func getPlayerProfile() : async PlayerProfile {
    switch (playerProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        {
          settings = defaultPlayerSettings;
          bestScore = defaultScoreRecord;
        };
      };
    };
  };

  // Any caller (including guests) can save settings
  // For guests, this allows the backend to respond but frontend handles local storage
  // For authenticated users, data persists on backend
  public shared ({ caller }) func savePlayerSettings(settings : PlayerSettings) : async () {
    let currentProfile = switch (playerProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        {
          settings = defaultPlayerSettings;
          bestScore = defaultScoreRecord;
        };
      };
    };

    playerProfiles.add(
      caller,
      {
        settings;
        bestScore = currentProfile.bestScore;
      },
    );
  };

  // Any caller (including guests) can update their best score
  // For guests, this allows the backend to respond but frontend handles local storage
  // For authenticated users, data persists on backend
  public shared ({ caller }) func updateBestScore(newScore : ScoreRecord) : async () {
    let currentProfile = switch (playerProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        {
          settings = defaultPlayerSettings;
          bestScore = defaultScoreRecord;
        };
      };
    };

    let shouldUpdateScore = newScore.score > currentProfile.bestScore.score or
      (newScore.score == currentProfile.bestScore.score and newScore.headshots > currentProfile.bestScore.headshots);

    if (shouldUpdateScore) {
      playerProfiles.add(
        caller,
        {
          settings = currentProfile.settings;
          bestScore = newScore;
        },
      );
    };
  };

  // Admin-only function to view all player profiles
  public query ({ caller }) func getAllPlayerProfiles() : async [PlayerProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };

    playerProfiles.entries().toArray().map(func((_, profile)) { profile });
  };
};
