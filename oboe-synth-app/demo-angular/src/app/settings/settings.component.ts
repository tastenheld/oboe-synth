import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { fromObject, fromObjectRecursive, Observable, PropertyChangeData } from "tns-core-modules/data/observable";

import { LayoutService } from "../layout/layout.service";
import { SynthService } from "../synth/synth.service";
import { SynthUtils } from "../synth/synth-utils";

@Component({
	selector: "Settings",
	moduleId: module.id,
	templateUrl: "./settings.component.html",
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	private barHeight: number;
	private space: number;

	private keyboard: any = { firstKey: 0, lastKey: 88 };
	private oscillator: any = { sineAmp: 0, squareAmp: 0, sawAmp: 0, triangleAmp: 0 };
	private sensor: any = { keyPan: false, ampPan: false, keyAcc: false, ampAcc: false };

	constructor(
		private routerExtensions: RouterExtensions,
		private layoutService: LayoutService,
		private synthService: SynthService
	) { }

	ngOnInit(): void {
		this.barHeight = this.layoutService.getActionBarHeight();
		this.space = this.layoutService.space;
		this.keyboard.firstKey = this.synthService.firstKey;
		this.keyboard.lastKey = this.synthService.lastKey;
		this.oscillator.sineAmp = this.synthService.sineAmp;
		this.oscillator.squareAmp = this.synthService.squareAmp;
		this.oscillator.sawAmp = this.synthService.sawAmp;
		this.oscillator.triangleAmp = this.synthService.triangleAmp;
		this.sensor.keyPan = this.synthService.keyPanning;
		this.sensor.ampPan = this.synthService.ampPanning;
		this.sensor.keyAcc = this.synthService.keyAccelerometer;
		this.sensor.ampAcc = this.synthService.ampAccelerometer;
	}

	get firstKey(): number {
		return this.keyboard.firstKey;
	}

	set firstKey(firstKey: number) {
		if (!SynthUtils.keyIsWhite(firstKey)) {
			firstKey++;
		}
		if (firstKey > this.keyboard.lastKey) {
			this.lastKey = firstKey;
		}
		this.keyboard.firstKey = firstKey;
	}

	get lastKey(): number {
		return this.keyboard.lastKey;
	}

	set lastKey(lastKey: number) {
		if (!SynthUtils.keyIsWhite(lastKey)) {
			lastKey++;
		}

		if (lastKey < this.keyboard.firstKey) {
			this.firstKey = lastKey;
		}
		this.keyboard.lastKey = lastKey;
	}

	public get keyPan(): boolean {
		return this.sensor.keyPan;
	}

	public set keyPan(pan: boolean) {
		if (pan) {
			this.keyAcc = false;
			this.sensor.keyPan = true;
		} else {
			this.sensor.keyPan = false;
		}
	}

	public get ampPan(): boolean {
		return this.sensor.ampPan;
	}

	public set ampPan(pan: boolean) {
		if (pan) {
			this.ampAcc = false;
			this.sensor.ampPan = true;
		} else {
			this.sensor.ampPan = false;
		}
	}

	public get keyAcc(): boolean {
		return this.sensor.keyAcc;
	}

	public set keyAcc(pan: boolean) {
		if (pan) {
			this.keyPan = false;
			this.sensor.keyAcc = true;
		} else {
			this.sensor.keyAcc = false;
		}
	}

	public get ampAcc(): boolean {
		return this.sensor.ampAcc;
	}

	public set ampAcc(pan: boolean) {
		if (pan) {
			this.ampPan = false;
			this.sensor.ampAcc = true;
		} else {
			this.sensor.ampAcc = false;
		}
	}

	save(): void {
		this.synthService.firstKey = this.keyboard.firstKey;
		this.synthService.lastKey = this.keyboard.lastKey;
		this.synthService.sineAmp = this.oscillator.sineAmp;
		this.synthService.squareAmp = this.oscillator.squareAmp;
		this.synthService.sawAmp = this.oscillator.sawAmp;
		this.synthService.triangleAmp = this.oscillator.triangleAmp;

		this.synthService.init(this.layoutService.getKeySpaceWidth(), this.layoutService.getKeySpaceHeight());
		this.synthService.keyPanning = this.sensor.keyPan;
		this.synthService.ampPanning = this.sensor.ampPan;
		this.synthService.keyAccelerometer = this.sensor.keyAcc;
		this.synthService.ampAccelerometer = this.sensor.ampAcc;

    let amp = this.synthService.amplitude;
    this.synthService.amplitude = amp;

		this.goBack();
	}

	goBack(): void {
		this.routerExtensions.back();
	}
}
