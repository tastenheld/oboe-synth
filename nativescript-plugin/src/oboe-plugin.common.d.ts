import { Observable } from 'tns-core-modules/data/observable';
export declare class Common extends Observable {
    message: string;
    constructor();
    greet(): string;
}
