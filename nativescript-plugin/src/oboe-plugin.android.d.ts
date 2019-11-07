import { Common } from './oboe-plugin.common';
export declare class OboePlugin extends Common {
  private oboeSynthWrapper: any;

  constructor();

  startEngine(): void;
  setAmplitude(amplitude: number): void;
  setOscMode(mode: string): void;
  pressKey(key: number): void;
  pause(): void;
  pan(x: number, y: number): void;
  tilt(x: number, y: number): void;
  setTotalKeys(keys: number): void;
  setKeyboardSize(width: number, height: number): void;
}
