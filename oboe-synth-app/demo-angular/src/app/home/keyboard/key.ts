import { SynthUtils } from "../../synth/synth-utils";

export class Key {
    public index: number;
    private _width: number;
    private _isFirstKey: boolean = false;
    private _isLastKey: boolean = false;

    constructor(index: number) {
        this.index = index;
    }

    public get isWhiteKey(): boolean {
        return SynthUtils.keyIsWhite(this.index);
    }

    public set isFirstKey(isFirstKey: boolean) {
        this._isFirstKey = isFirstKey;
    }

    public set isLastKey(isLastKey: boolean) {
        this._isLastKey = isLastKey;
    }

    public get width(): number {
        return this._width;
    }

    public set width(width: number) {
        this._width = width;
    }

    public get variableWidth(): number {

        let width = this.halfWidth + this.quarterWidth;

        if (this._isFirstKey) {
            if (this.hasBlackNeighborAtLeft && !this.isBetweenBlacks) {
                width += this.quarterWidth;
            }
        } else {
            if (this.isBetweenBlacks) {
                width -= this.quarterWidth;
            }
        }

        if (this._isLastKey && this.hasBlackNeighborAtRight) {
            width += this.halfWidth;
        }

        return width;
    }

    private get halfWidth(): number {
        return this._width / 2;
    }

    private get quarterWidth(): number {
        return this._width / 4;
    }

    public get isBetweenBlacks(): boolean {
        let betweenBlacks = false;
        let firstOctave = this.index % 12;

        switch (firstOctave) {
            case 1:
            case 6:
            case 5:
            case 11:
                betweenBlacks = true;
                break;
            default:
                betweenBlacks = false;
        }
        return betweenBlacks;
    }

    public get hasBlackNeighborAtRight(): boolean {
        let hasBlackNeighbor = false;
        let firstOctave = this.index % 12;

        switch (firstOctave) {
            case 1:
            case 4:
            case 6:
            case 9:
            case 11:
                hasBlackNeighbor = true;
                break;
            default:
                hasBlackNeighbor = false;
        }
        return hasBlackNeighbor;
    }

    public get hasBlackNeighborAtLeft(): boolean {
        let hasBlackNeighbor = false;
        let firstOctave = this.index % 12;

        switch (firstOctave) {
            case 1:
            case 3:
            case 6:
            case 8:
            case 11:
                hasBlackNeighbor = true;
                break;
            default:
                hasBlackNeighbor = false;
        }
        return hasBlackNeighbor;
    }
}