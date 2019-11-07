import { Injectable } from '@angular/core';
import { fromObject, Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import * as AppSettings from "tns-core-modules/application-settings";

import { SynthUtils } from "./synth-utils";
import { OboePlugin } from 'nativescript-oboe-plugin';
import { Oscillator } from './oscillator';

@Injectable()
export class SynthService {

    public synthSettings: Observable;
    private synthEngine: any;
    private _engineStarted: boolean = false;
    private _powerOn: boolean = false;
    private _oscNumber: number;
    private _totalKeys: number;
    private _amplitude: number;

    constructor() {
        this.synthSettings = fromObject({
            "firstKey": AppSettings.getNumber("firstKey", 40), //musice note c'
            "lastKey": AppSettings.getNumber("lastKey", 52), //music note c''
            "sineAmp": AppSettings.getNumber("sineAmp", 0),
            "squareAmp": AppSettings.getNumber("squareAmp", -75),
            "sawAmp": AppSettings.getNumber("sawAmp", -70),
            "triangleAmp": AppSettings.getNumber("triangleAmp", 60),
            "ampPanning": AppSettings.getBoolean("ampPanning", false),
            "ampAccelerometer": AppSettings.getBoolean("ampAccelerometer", false),
            "keyPanning": AppSettings.getBoolean("keyPanning", false),
            "keyAccelerometer": AppSettings.getBoolean("keyAccelerometer", false)
        });
        this.synthEngine = new OboePlugin();
    }

    public init(keySpaceWidth: number, keySpaceHeight: number) {
        this.synthEngine.setKeyboardSize(keySpaceWidth, keySpaceHeight);
        this.synthEngine.setTotalKeys(this.totalKeys);
        this.synthEngine.setAmplitude(this.amplitude);
    }

    public set powerOn(powerOn: boolean) {

      if (this._engineStarted && !powerOn) {
          this.synthEngine.pause();
          this.synthEngine.setAmplitude(0);
          this._powerOn = false;
      } else if (this._engineStarted && powerOn) {
          let amp = this.amplitude;
          this._powerOn = true;
          this.amplitude = amp;
      } else if (!this._engineStarted && powerOn) {
          this.synthEngine.startEngine();
          this._engineStarted = true;
          this._powerOn = true;
          let amp = this.amplitude;
          this.amplitude = amp;
      }
    }

    public get oscNumber(): number {
        if (!this._oscNumber) {
            this._oscNumber = AppSettings.getNumber("oscNumber", Oscillator.SINE);
        }
        return this._oscNumber;
    }

    public set oscNumber(oscNumber: number) {
        this._oscNumber = oscNumber;
        let osc: string = Oscillator[this._oscNumber];
        this.synthEngine.setOscMode( osc );
        this.amplitude = this.amplitude;
        AppSettings.setNumber("oscNumber", this._oscNumber);
    }

    public get amplitude(): number {
        if (!this._amplitude) {
            this._amplitude = AppSettings.getNumber("amplitude", 50);
        }
        return this._amplitude;
    }

    public set amplitude(amplitude: number) {
      this._amplitude = amplitude;
      AppSettings.setNumber("amplitude", this._amplitude);
      if (!this._powerOn) { return; }
      switch (this._oscNumber) {
          case Oscillator.SINE:
              this.synthEngine.setAmplitude(this._amplitude + this._amplitude * this.sineAmp / 100);
              break;
          case Oscillator.SQUARE:
              this.synthEngine.setAmplitude(this._amplitude + this._amplitude * this.squareAmp / 100);
              break;
          case Oscillator.SAW:
              this.synthEngine.setAmplitude(this._amplitude + this._amplitude * this.sawAmp / 100);
              break;
          case Oscillator.TRIANGLE:
              this.synthEngine.setAmplitude(this._amplitude + this._amplitude * this.triangleAmp / 100);
              break;
      }
    }

    public get firstKey(): number {
        return this.synthSettings.get("firstKey");
    }

    public set firstKey(keyNumber: number) {
        this.synthSettings.set("firstKey", keyNumber);
        AppSettings.setNumber("firstKey", keyNumber);
    }

    public get lastKey(): number {
        return this.synthSettings.get("lastKey");
    }

    public set lastKey(keyNumber: number) {
        this.synthSettings.set("lastKey", keyNumber);
        AppSettings.setNumber("lastKey", keyNumber);
    }

    public get sineAmp(): number {
        return this.synthSettings.get("sineAmp");
    }

    public set sineAmp(sineAmp: number) {
        this.synthSettings.set("sineAmp", sineAmp);
        AppSettings.setNumber("sineAmp", sineAmp);
    }

    public get squareAmp(): number {
        return this.synthSettings.get("squareAmp");
    }

    public set squareAmp(squareAmp: number) {
        this.synthSettings.set("squareAmp", squareAmp);
        AppSettings.setNumber("squareAmp", squareAmp);
    }

    public get sawAmp(): number {
        return this.synthSettings.get("sawAmp");
    }

    public set sawAmp(sawAmp: number) {
        this.synthSettings.set("sawAmp", sawAmp);
        AppSettings.setNumber("sawAmp", sawAmp);
    }

    public get triangleAmp(): number {
        return this.synthSettings.get("triangleAmp");
    }

    public set triangleAmp(triangleAmp: number) {
        this.synthSettings.set("triangleAmp", triangleAmp);
        AppSettings.setNumber("triangleAmp", triangleAmp);
    }

    public get keyPanning(): boolean {
        return this.synthSettings.get("keyPanning");
    }

    public set keyPanning(panning: boolean) {
        this.synthSettings.set("keyPanning", panning);
        AppSettings.setBoolean("keyPanning", panning);
    }

    public get ampPanning(): boolean {
        return this.synthSettings.get("ampPanning");
    }

    public set ampPanning(panning: boolean) {
        this.synthSettings.set("ampPanning", panning);
        AppSettings.setBoolean("ampPanning", panning);
    }

    public get keyAccelerometer(): boolean {
        return this.synthSettings.get("keyAccelerometer");
    }

    public set keyAccelerometer(accelerometer: boolean) {
        this.synthSettings.set("keyAccelerometer", accelerometer);
        AppSettings.setBoolean("keyAccelerometer", accelerometer);
    }

    public get ampAccelerometer(): boolean {
        return this.synthSettings.get("ampAccelerometer");
    }

    public set ampAccelerometer(accelerometer: boolean) {
        this.synthSettings.set("ampAccelerometer", accelerometer);
        AppSettings.setBoolean("ampAccelerometer", accelerometer);
    }

    public get totalKeys(): number {
        if (!this._totalKeys) {
            this._totalKeys = this.lastKey - this.firstKey + 1;
        }
        return this._totalKeys;
    }

    public addSynthSettingsListener(listener: any): void {
        this.synthSettings.addEventListener(Observable.propertyChangeEvent, listener)
    }

    public pressKey(key: number): void {
        this.synthEngine.pressKey(key);
    }

    public pause(): void {
        this.synthEngine.pause();
    }

    public pan(x: number, y: number) {
        this.synthEngine.pan(x, y);
    }

    public tilt(x: number, y: number) {
        this.synthEngine.tilt(x, y);
    }
}
