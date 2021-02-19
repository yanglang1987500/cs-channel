import Event from './event';
import { IOptions, IKeyValueMap } from './type';
declare class Channel {
    _: Event;
    id: string;
    serializeError: boolean;
    options: {
        sender: (message: any) => any;
        receiver: (callback: any) => any;
    };
    constructor(option: IOptions, id?: string);
    init(option: IOptions): void;
    call<T = any>(api: string, data?: IKeyValueMap): Promise<T>;
    doCall(api: string, data: IKeyValueMap, callback: Function): void;
    on<T = any>(api: string, callback: (data: T) => Promise<any>): void;
    off(api: string): void;
}
export default Channel;
