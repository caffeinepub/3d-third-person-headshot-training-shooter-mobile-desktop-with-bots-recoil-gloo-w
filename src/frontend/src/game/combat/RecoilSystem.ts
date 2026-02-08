export class RecoilSystem {
  private recoilAmount = 0;
  
  applyRecoil(isADS: boolean, intensity: number = 1.0): { vertical: number; horizontal: number } {
    const baseRecoil = (isADS ? 0.015 : 0.025) * intensity;
    this.recoilAmount += baseRecoil;
    
    return {
      vertical: baseRecoil + Math.random() * 0.01 * intensity,
      horizontal: (Math.random() - 0.5) * 0.015 * intensity
    };
  }
  
  update(delta: number) {
    this.recoilAmount = Math.max(0, this.recoilAmount - delta * 0.5);
  }
}
