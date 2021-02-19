export interface IKeyValueMap {
    [key: string]: any;
}
export interface IMessage {
    api: string;
    data: IKeyValueMap;
    msgId: string;
}
export interface IEvents {
    [key: string]: Function[];
}
export interface IToBeNotify {
    eventName: string;
    data: any[];
    scope: any;
}
export interface IOptions {
    sender: (message: IMessage) => void;
    receiver: (callback: IReceiverCallback) => void;
}
export interface IChannel {
    constructor(option: IOptions): any;
    options: IOptions;
    init: (options: IOptions) => void;
    call: (api: string, data?: IKeyValueMap) => Promise<any>;
    on: (api: string, callback: (message: IMessage) => Promise<any>) => void;
    off: (api: string) => void;
}
declare type IReceiverCallback = (message: IMessage) => void;
export {};
