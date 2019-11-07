import { Common } from './oboe-plugin.common';
import * as application from 'tns-core-modules/application';
declare const de: any;

export class OboePlugin extends Common {
  private oboeSynthWrapper: any;

  constructor() {
    super();
    const context = application.android.context;
    this.oboeSynthWrapper = new de.tastenheld.synth.library.OboeSynth();
  }

  public startEngine():void {
    this.oboeSynthWrapper.startEngine();
  }

  public setAmplitude(amplitude: number): void {
    this.oboeSynthWrapper.setAmplitude(amplitude);
  }

  public setOscMode(mode: string): void {
    this.oboeSynthWrapper.setOscMode(mode);
  }

  public pressKey(key: number): void {
    this.oboeSynthWrapper.pressKey(key);
  }

  public pause(): void {
    this.oboeSynthWrapper.pause();
  }

  public pan(x: number, y: number): void {
    this.oboeSynthWrapper.pan(x, y);
  }

  public tilt(x: number, y: number): void {
    this.oboeSynthWrapper.tilt(x, y);
  }

  public setTotalKeys(keys: number): void {
    this.oboeSynthWrapper.setTotalKeys(keys);
  }

  public setKeyboardSize(width: number, height: number): void {
    this.oboeSynthWrapper.setKeyboardSize(width, height);
  }
}
