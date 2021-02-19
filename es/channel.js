var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _ from './event';
class Channel {
    constructor(option) {
        this.options = {
            sender: (message) => message,
            receiver: (callback) => callback(null)
        };
        this.init(option);
    }
    init(option) {
        if (!option.sender || !option.receiver)
            throw new Error('Please provider sender and receiver');
        this.options.sender = option.sender;
        option.receiver(message => {
            if (_.has(message.msgId)) {
                _.notify(message.msgId, message.data);
            }
            else if (_.has(message.api)) {
                _.notify(message.api, message);
            }
        });
    }
    call(api, data) {
        console.log('start call', api);
        return new Promise((resolve) => {
            _.call(api, data, (data) => {
                console.log('end call, data: ', data);
                resolve(data);
            }, this);
        });
    }
    on(api, callback) {
        _.subscribe(api, (message) => __awaiter(this, void 0, void 0, function* () {
            const data = yield callback(message);
            if (!data)
                return;
            this.options.sender({
                data,
                api: api,
                msgId: message.msgId
            });
        }));
    }
    off(api) {
        _.unsubscribe(api);
    }
}
export default Channel;
//# sourceMappingURL=channel.js.map