import { Component, OnInit, Input } from "@angular/core";

import { TouchGestureEventData } from "tns-core-modules/ui/gestures";
import { PanGestureEventData } from "tns-core-modules/ui/gestures";
import { EventData } from "tns-core-modules/data/observable";

import { Label } from "tns-core-modules/ui/label";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { fromObject, fromObjectRecursive, Observable, PropertyChangeData } from "tns-core-modules/data/observable";

import * as Accelerometer from "nativescript-accelerometer";

import { LayoutService } from "../../layout/layout.service";
import { LayoutUtils } from "../../layout/layout-utils";
import { SynthService } from "../../synth/synth.service";
import { SynthUtils } from "../../synth/synth-utils";
import { Key } from "./key";

@Component({
	selector: "Keyboard",
	moduleId: module.id,
	templateUrl: "./keyboard.component.html",
	styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {

	private keys: Array<Key>;
	private justPressedKey: number;
	private keySpace: StackLayout;
	private accelerometerListening: boolean = false;

	constructor(
		private layoutService: LayoutService,
		private synthService: SynthService
	) { }

	ngOnInit(): void {
		this.initKeyboard();

		this.synthService.addSynthSettingsListener((data: PropertyChangeData) => {
			this.initKeyboard();
			if (this.keySpace) {
				this.keySpace.css = "";
			}
			this.accelerometerListening = false;
		});
	}

	private initKeyboard(): void {

		this.keys = new Array<Key>();

		for (let i = this.synthService.firstKey; i <= this.synthService.lastKey; i++) {
			let key = new Key(i);
			if (i == this.synthService.firstKey) {
				key.isFirstKey = true;
			}
			if (i == this.synthService.lastKey) {
				key.isLastKey = true;
			}

			key.width = this.layoutService.whiteKeyWidth;
			this.keys.push(key);
		}
	}

	public onPan(event: PanGestureEventData) {

		let keyPan = this.synthService.keyPanning;
		let ampPan = this.synthService.ampPanning;

		if (keyPan || ampPan) {
			let x = keyPan ? event.deltaX : 0;
			let y = ampPan ? event.deltaY : 0;

			this.synthService.pan(x, y);
		}
	}

	public listenToAccelerometer() {
		let accKey = this.synthService.keyAccelerometer;
		let accAmp = this.synthService.ampAccelerometer;

		if (this.accelerometerListening) {
			Accelerometer.stopAccelerometerUpdates();
		}

		if (accKey || accAmp) {
			Accelerometer.startAccelerometerUpdates(data => {
				this.accelerometerListening = true;
				if (this.synthService.keyAccelerometer || this.synthService.ampAccelerometer) {
					this.synthService.tilt(accKey ? data.y : 0, accAmp ? data.x : 0);
				}
			}, {sensorDelay: "game"});
		}
	}

	public onPressedKey(event: TouchGestureEventData) {
		let touchedObj = <Label>event.object;
		if (!this.keySpace) {
			this.keySpace = <StackLayout>touchedObj.parent.parent;
		}

		let key = Number(touchedObj.id);
		switch (event.action) {
			case "down":
				if (!this.justPressedKey) {
					this.keySpace.css = this.animatePressedKey(key, true);
					this.synthService.pressKey(key);
					this.justPressedKey = key;
					if (this.synthService.keyAccelerometer || this.synthService.ampAccelerometer) {
						this.listenToAccelerometer();
					}
				}
				break;
			case "up":
			case "cancel":
				if (this.justPressedKey != key) { break; }
				this.keySpace.css = this.animatePressedKey(key, false);
				this.justPressedKey = null;
				if (this.synthService.keyAccelerometer || this.synthService.ampAccelerometer) {
					Accelerometer.stopAccelerometerUpdates();
					this.accelerometerListening = false;
				}
				this.synthService.pause();
			case "move":
			default:
				break;
		}
	}

	private get keyboardWidth(): number {
		return this.layoutService.getKeyboardWidth();
	}

	private get keyboardHeight(): number {
		return this.layoutService.getKeyboardHeight();
	}

	private get keySpaceWidth(): number {
		return this.layoutService.getKeySpaceWidth();
	}

	private get keySpaceHeight(): number {
		return this.layoutService.getKeySpaceHeight();
	}

	private animatePressedKey(keyId: number, pressed: boolean): string {
		return `#${keyId} { animation-name: ${pressed ? "pressedKey" : "leavedKey"}; animation-duration: 400ms; animation-fill-mode: forwards; animation-timing-function: ${pressed ? "ease-out" : "ease-in"}; }`;
	}
}