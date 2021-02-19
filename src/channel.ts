import Event, { EVENT_PREFIX } from './event';
import { IOptions, IKeyValueMap, IMessage } from './type';

class Channel {
  _: Event;
  id: string;
  serializeError: boolean = false;
  options = {
    sender: (message: any) => message,
    receiver: (callback: any) => callback(null)
  }

  constructor(option: IOptions, id?: string) {
    this.id = id;
    this._ = new Event();
    this.init(option);
  }

  init(option: IOptions) {
    if (!option.sender || !option.receiver)
      throw new Error('Please provider sender and receiver');
    this.options.sender = option.sender;
    if (option.hasOwnProperty('serializeError')) {
      this.serializeError = option.serializeError;
    }
    option.receiver(message => {
      if (this._.has(message.msgId)) {
        this._.notify(message.msgId, message);
      } else if (this._.has(message.api)) {
        this._.notify(message.api, message);
      } else {
        const error = new Error(`can not find api ${message.api}`);
        this.options.sender({
          ...message,
          error: this.serializeError ? serializeObject(error) : error
        });
      }
    });
  }

  call<T = any>(api: string, data?: IKeyValueMap): Promise<T> {
    return new Promise((resolve, reject) => { 
      this.doCall(api, data, (message: IMessage<T>) => {
        if (message.error) {
          reject(message.error);
        } else {
          resolve(message.data);
        }
      });
    });
  }

	doCall(api: string, data: IKeyValueMap, callback: Function) {
		const eventName = `${EVENT_PREFIX}_${this._.guid()}`;
		this._.subscribe(eventName, callback);
		this.options.sender({
			api,
			data,
			msgId: eventName,
		});
	}

  on<T = any>(api: string, callback: (data: T) => Promise<any>) {
    this._.subscribe(api, async (message: IMessage<T>) => {
      try {
        const data = await callback(message.data);
        this.options.sender({
          ...message,
          data
        });
      } catch (e) {
        this.options.sender({
          ...message,
          error: this.serializeError ? serializeObject(e) : e
        });
      }
    });
  }

  off(api: string) {
    this._.unsubscribe(api);
  }

}

const serializeObject = (obj: any) => JSON.parse(JSON.stringify(obj, Object.getOwnPropertyNames(obj)));


export default Channel;