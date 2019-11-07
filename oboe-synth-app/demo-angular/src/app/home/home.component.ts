import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

import { EventData } from "tns-core-modules/data/observable";
import { fromObject, fromObjectRecursive, Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import * as Enums from "tns-core-modules/ui/enums";
import * as Application from "tns-core-modules/application";
import * as Dialogs from "tns-core-modules/ui/dialogs";

import { LayoutService } from "../layout/layout.service";
import { SynthService } from "../synth/synth.service";
import { SynthUtils } from "../synth/synth-utils";
import { Oscillator } from '../synth/oscillator';
import { Key } from "./keyboard/key";

declare var android: any;

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

    private barHeight: number;
    private space: number;
    private controllerHeight: number;
    private controllerWidth: number;
    private isPowerOn: boolean = false;
    private oscNumber: number;
    private _amplitude: number;
    private keyboard: Observable;

    constructor(
        private layoutService: LayoutService,
        private synthService: SynthService,
        private routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.barHeight = this.layoutService.getActionBarHeight();
        this.space = this.layoutService.space;
        this.controllerWidth = this.layoutService.getKeyboardWidth();
        this.controllerHeight = this.layoutService.controllerHeight;
        this.oscNumber = this.synthService.oscNumber;
        this._amplitude = this.synthService.amplitude;
        //this.synthService.addSynthSettingsListener((data: PropertyChangeData) => {});
        Application.android.on(Application.AndroidApplication.activityPausedEvent, eventData => {
            this.synthService.pause();
        });
    }

    public get amplitude(): number {
        return this._amplitude;
    }

    public set amplitude(amplitude: number) {
        this._amplitude = amplitude;
        this.synthService.amplitude = amplitude;
    }

    public switchPower(): void {
        this.isPowerOn = !this.isPowerOn;
        this.synthService.powerOn = this.isPowerOn;
    }

    public switchOsc(): void {

        let options: Dialogs.ActionOptions = {
            title: "OSC selection",
            message: "Choose your osc",
            cancelButtonText: "Cancel",
            actions: [
                Oscillator[Oscillator.SINE],
                Oscillator[Oscillator.SQUARE],
                Oscillator[Oscillator.SAW],
                Oscillator[Oscillator.TRIANGLE]
            ]
        };

        Dialogs.action(options).then((result: string) => {

          let osc: number = Oscillator.SINE;
          switch (result) {
              case this.getOscName(Oscillator.SQUARE):
                  osc = Oscillator.SQUARE;
                  break;
              case this.getOscName(Oscillator.SAW):
                  osc = Oscillator.SAW;
                  break;
              case this.getOscName(Oscillator.TRIANGLE):
                  osc = Oscillator.TRIANGLE;
              default:
                  break;
          }
          this.oscNumber = osc;
          this.synthService.oscNumber = osc;
        });
    }

    public getOscName(oscNumber): string {
        return Oscillator[oscNumber];
    }

    public goToSettings(): void {
        this.routerExtensions.navigate(
            ["/settings"],
            {
                animated: true,
                transition: {
                    name: "flip",
                    duration: 1000,
                    curve: Enums.AnimationCurve.easeInOut
                }
            });
    }
}
