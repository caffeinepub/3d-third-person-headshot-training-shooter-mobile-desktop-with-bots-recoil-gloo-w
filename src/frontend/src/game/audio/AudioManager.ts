import { useSettingsStore } from '../state/settingsStore';

class AudioManagerClass {
  private gunshotAudio: HTMLAudioElement | null = null;
  private headshotAudio: HTMLAudioElement | null = null;
  
  constructor() {
    this.gunshotAudio = new Audio('/assets/audio/gunshot.ogg');
    this.headshotAudio = new Audio('/assets/audio/headshot.ogg');
    
    if (this.gunshotAudio) {
      this.gunshotAudio.volume = 0.5;
      this.gunshotAudio.preload = 'auto';
    }
    if (this.headshotAudio) {
      this.headshotAudio.volume = 0.7;
      this.headshotAudio.preload = 'auto';
    }
  }
  
  playGunshot() {
    const volume = useSettingsStore.getState().audioVolume;
    if (this.gunshotAudio && volume > 0) {
      const audio = this.gunshotAudio.cloneNode() as HTMLAudioElement;
      audio.volume = volume * 0.5;
      audio.play().catch(() => {});
    }
  }
  
  playHeadshot() {
    const volume = useSettingsStore.getState().audioVolume;
    if (this.headshotAudio && volume > 0) {
      const audio = this.headshotAudio.cloneNode() as HTMLAudioElement;
      audio.volume = volume * 0.7;
      audio.play().catch(() => {});
    }
  }
}

export const AudioManager = new AudioManagerClass();
