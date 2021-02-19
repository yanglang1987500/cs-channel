import { IOptions, IKeyValueMap, IMessage } from './type';
declare class Channel {
    options: {
        sender: (message: any) => any;
        receiver: (callback: any) => any;
    };
    constructor(option: IOptions);
    init(option: IOptions): void;
    call<T = any>(api: string, data?: IKeyValueMap): Promise<T>;
    on(api: string, callback: (message: IMessage) => Promise<any>): void;
    off(api: string): void;
}
export default Channel;
