"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events = {};
const toBeNotify = [];
const EVENT_PREFIX = 'TPE';
const _ = {
    notify(eventName, ...rest) {
        const eventList = Events[eventName];
        let i = 0;
        if (eventList) {
            const len = eventList.length;
            for (; i < len; i += 1) {
                eventList[i].apply(this, rest);
            }
        }
        else {
            toBeNotify.push({
                eventName,
                data: rest,
                scope: this,
            });
        }
        if (eventName.startsWith(`${EVENT_PREFIX}_`)) {
            this.unsubscribe(eventName);
        }
        return this;
    },
    has(eventName) {
        return Events[eventName] && Events[eventName].length > 0;
    },
    notifyWith(eventName, scope, ...rest) {
        if (arguments.length < 2) {
            throw new TypeError('arguments error');
        }
        this.notify.apply(scope, [eventName, ...rest]);
    },
    subscribe(eventName, callback) {
        let i = 0;
        const len = toBeNotify.length;
        if (arguments.length < 2) {
            throw new TypeError('arguments error ');
        }
        let eventList = Events[eventName] ? Events[eventName] : (Events[eventName] = []);
        if (Object.prototype.toString.call(callback) === '[object Array]') {
            eventList = eventList.concat(callback);
        }
        else {
            eventList.push(callback);
        }
        for (; i < len; i += 1) {
            if (toBeNotify[i].eventName === eventName) {
                this.notify.apply(toBeNotify[i].scope, [eventName, ...toBeNotify[i].data]);
                toBeNotify.splice(i, 1);
                break;
            }
        }
        return this;
    },
    unsubscribe(eventName, callback) {
        if (callback) {
            const callbacks = Events[eventName];
            for (let i = 0; i < callbacks.length; i += 1) {
                if (callbacks[i] === callback) {
                    callbacks.splice(i -= 1, 1);
                }
            }
        }
        else {
            delete Events[eventName];
        }
        return this;
    },
    guid() {
        return 'xxxxxxxx_xxxx_4xxx_yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            /* eslint-disable */
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            /* eslint-enable */
            return v.toString(16);
        });
    },
    /*
     * @method call
     * @param api
     * @param data Object
     * @param alive
     */
    call(api, data, callback, channel) {
        let eventName = '';
        if (callback) {
            eventName = `${EVENT_PREFIX}_${this.guid()}`;
            this.subscribe(eventName, callback);
        }
        const message = {
            api,
            data,
            msgId: eventName,
        };
        channel.options.sender(message);
        return this;
    },
};
exports.default = _;
//# sourceMappingURL=event.js.map