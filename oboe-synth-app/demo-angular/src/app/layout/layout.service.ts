import { Injectable } from '@angular/core';
import { fromObject, fromObjectRecursive, Observable, PropertyChangeData } from "tns-core-modules/data/observable";

import { SynthService } from "../synth/synth.service";
import { SynthUtils } from "../synth/synth-utils";
import { LayoutUtils } from "./layout-utils";

@Injectable()
export class LayoutService {

    private static ACTION_BAR_HEIGHT: number = 11;
    private static KEYBOARD_WIDTH: number = 92;
    private static KEYBOARD_HEIGHT: number = 55;
    private static KEY_SPACE_WIDTH: number = 87;
    private static KEY_SPACE_HEIGHT: number = 45;
    private static CONTROLLER_HEIGHT: number = 15;
    private static SPACE: number = 5;

    constructor(private synthService: SynthService) {
        this.synthService.init(this.getKeySpaceWidth() - this.whiteKeyWidth/2, this.getKeySpaceHeight());
    }

    public getActionBarHeight(): number {
        let height = LayoutUtils.getPercentHeightFromScreen(LayoutService.ACTION_BAR_HEIGHT);
        return height;
    }

    public getKeyboardWidth(): number {
        let width = LayoutUtils.getPercentWidthFromScreen(LayoutService.KEYBOARD_WIDTH);
        return width;
    }

    public getKeyboardHeight(): number {
        return LayoutUtils.getPercentHeightFromScreen(LayoutService.KEYBOARD_HEIGHT);
    }

    public getKeySpaceWidth(): number {
        let width = LayoutUtils.getPercentWidthFromScreen(LayoutService.KEY_SPACE_WIDTH);
        return width - (width % (4 * this.numberOfWhiteKeys));
    }

    public getKeySpaceHeight(): number {
        return LayoutUtils.getPercentHeightFromScreen(LayoutService.KEY_SPACE_HEIGHT);
    }

    public get controllerHeight(): number {
        return LayoutUtils.getPercentHeightFromScreen(LayoutService.CONTROLLER_HEIGHT);
    }

    public get space(): number {
        return LayoutUtils.getPercentHeightFromScreen(LayoutService.SPACE);
    }

    public get numberOfWhiteKeys(): number {
        return SynthUtils.countWhiteKeys(this.synthService.firstKey, this.synthService.lastKey);
    }

    public get whiteKeyWidth(): number {
        return this.getKeySpaceWidth() / this.numberOfWhiteKeys;
    }
}