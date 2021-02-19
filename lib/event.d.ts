import { IEvents, IToBeNotify } from "./type";
export declare const EVENT_PREFIX = "TPE";
declare class Event {
    Events: IEvents;
    toBeNotify: IToBeNotify[];
    _scope: any;
    notify(eventName: string, ...rest: any[]): this;
    has(eventName: string): boolean;
    notifyWith(eventName: string, scope: any, ...rest: any[]): void;
    subscribe(eventName: string, callback: Function | Function[]): this;
    unsubscribe(eventName: string, callback?: Function): this;
    guid(): string;
    clear(): void;
}
export default Event;
