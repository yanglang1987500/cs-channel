var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Event, { EVENT_PREFIX } from './event';
class Channel {
    constructor(option, id) {
        this.serializeError = false;
        this.options = {
            sender: (message) => message,
            receiver: (callback) => callback(null)
        };
        this.id = id;
        this._ = new Event();
        this.init(option);
    }
    init(option) {
        if (!option.sender || !option.receiver)
            throw new Error('Please provider sender and receiver');
        this.options.sender = option.sender;
        if (option.hasOwnProperty('serializeError')) {
            this.serializeError = option.serializeError;
        }
        option.receiver(message => {
            if (this._.has(message.msgId)) {
                this._.notify(message.msgId, message);
            }
            else if (this._.has(message.api)) {
                this._.notify(message.api, message);
            }
            else {
                const error = new Error(`can not find api ${message.api}`);
                this.options.sender(Object.assign(Object.assign({}, message), { error: this.serializeError ? serializeObject(error) : error }));
            }
        });
    }
    call(api, data) {
        return new Promise((resolve, reject) => {
            this.doCall(api, data, (message) => {
                if (message.error) {
                    reject(message.error);
                }
                else {
                    resolve(message.data);
                }
            });
        });
    }
    doCall(api, data, callback) {
        const eventName = `${EVENT_PREFIX}_${this._.guid()}`;
        this._.subscribe(eventName, callback);
        this.options.sender({
            api,
            data,
            msgId: eventName,
        });
    }
    on(api, callback) {
        this._.subscribe(api, (message) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield callback(message.data);
                this.options.sender(Object.assign(Object.assign({}, message), { data }));
            }
            catch (e) {
                this.options.sender(Object.assign(Object.assign({}, message), { error: this.serializeError ? serializeObject(e) : e }));
            }
        }));
    }
    off(api) {
        this._.unsubscribe(api);
    }
}
const serializeObject = (obj) => JSON.parse(JSON.stringify(obj, Object.getOwnPropertyNames(obj)));
export default Channel;
//# sourceMappingURL=channel.js.map