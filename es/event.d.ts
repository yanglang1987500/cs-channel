import { IKeyValueMap, IChannel } from "./type";
declare const _: {
    notify(eventName: string, ...rest: any[]): any;
    has(eventName: string): boolean;
    notifyWith(eventName: string, scope: any, ...rest: any[]): void;
    subscribe(eventName: string, callback: Function): any;
    unsubscribe(eventName: string, callback?: Function): any;
    guid(): string;
    call(api: string, data: IKeyValueMap, callback: Function, channel: IChannel): any;
};
export default _;
