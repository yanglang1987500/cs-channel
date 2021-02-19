import _ from './event';
import { IOptions, IKeyValueMap, IChannel, IMessage } from './type';

class Channel {
  options = {
    sender: (message: any) => message,
    receiver: (callback: any) => callback(null)
  }

  constructor(option: IOptions) {
    this.init(option);
  }

  init(option: IOptions) {
    if (!option.sender || !option.receiver)
      throw new Error('Please provider sender and receiver');
    this.options.sender = option.sender;
    option.receiver(message => {
      if (_.has(message.msgId)) {
        _.notify(message.msgId, message.data);
      } else if (_.has(message.api)) {
        _.notify(message.api, message);
      } else {
        this.options.sender({
          ...message,
          data: null
        });
      }
    });
  }

  call<T = any>(api: string, data?: IKeyValueMap): Promise<T> {
    console.log('start call', api);
    return new Promise((resolve) => {
      _.call(api, data, (data: T) => {
        console.log('end call, data: ', data);
        resolve(data);
      }, this as any as IChannel);
    });
  }

  on(api: string, callback: (message: IMessage) => Promise<any>) {
    _.subscribe(api, async (message: IMessage) => {
      const data = await callback(message);
      this.options.sender({
        data,
        api: api,
        msgId: message.msgId
      });
    });
  }

  off(api: string) {
    _.unsubscribe(api);
  }

}



export default Channel;