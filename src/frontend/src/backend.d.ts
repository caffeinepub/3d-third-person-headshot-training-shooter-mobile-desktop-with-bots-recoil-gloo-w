import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScoreRecord {
    score: bigint;
    headshots: bigint;
}
export interface PlayerSettings {
    audioVolume: number;
    sensitivity: number;
    aimAssistEnabled: boolean;
    qualitySettings: string;
}
export interface PlayerProfile {
    bestScore: ScoreRecord;
    settings: PlayerSettings;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllPlayerProfiles(): Promise<Array<PlayerProfile>>;
    getCallerUserRole(): Promise<UserRole>;
    getPlayerProfile(): Promise<PlayerProfile>;
    isCallerAdmin(): Promise<boolean>;
    savePlayerSettings(settings: PlayerSettings): Promise<void>;
    updateBestScore(newScore: ScoreRecord): Promise<void>;
}
