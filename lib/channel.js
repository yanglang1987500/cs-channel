"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("./event");
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
            if (event_1.default.has(message.msgId)) {
                event_1.default.notify(message.msgId, message.data);
            }
            else if (event_1.default.has(message.api)) {
                event_1.default.notify(message.api, message);
            }
        });
    }
    call(api, data) {
        console.log('start call', api);
        return new Promise((resolve) => {
            event_1.default.call(api, data, (data) => {
                console.log('end call, data: ', data);
                resolve(data);
            }, this);
        });
    }
    on(api, callback) {
        event_1.default.subscribe(api, (message) => __awaiter(this, void 0, void 0, function* () {
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
        event_1.default.unsubscribe(api);
    }
}
exports.default = Channel;
//# sourceMappingURL=channel.js.map