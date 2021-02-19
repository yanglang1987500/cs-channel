"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_PREFIX = 'TPE';
class Event {
    constructor() {
        this.Events = {};
        this.toBeNotify = [];
        this._scope = null;
    }
    notify(eventName, ...rest) {
        const eventList = this.Events[eventName];
        let i = 0;
        if (eventList) {
            const len = eventList.length;
            for (; i < len; i += 1) {
                eventList[i].apply(this._scope || this, rest);
            }
        }
        else {
            this.toBeNotify.push({
                eventName,
                data: rest,
                scope: this,
            });
        }
        if (eventName.startsWith(`${exports.EVENT_PREFIX}_`)) {
            this.unsubscribe(eventName);
        }
        return this;
    }
    has(eventName) {
        return !!(this.Events[eventName] && this.Events[eventName].length > 0);
    }
    notifyWith(eventName, scope, ...rest) {
        if (arguments.length < 2) {
            throw new TypeError('arguments error');
        }
        this._scope = scope;
        this.notify(eventName, ...rest);
        this._scope = null;
    }
    subscribe(eventName, callback) {
        let i = 0;
        const len = this.toBeNotify.length;
        if (arguments.length < 2) {
            throw new TypeError('arguments error ');
        }
        let eventList = this.Events[eventName] ? this.Events[eventName] : (this.Events[eventName] = []);
        if (Object.prototype.toString.call(callback) === '[object Array]') {
            eventList = eventList.concat(callback);
        }
        else {
            eventList.push(callback);
        }
        this.Events[eventName] = eventList;
        for (; i < len; i += 1) {
            if (this.toBeNotify[i].eventName === eventName) {
                this.notify.apply(this.toBeNotify[i].scope, [eventName, ...this.toBeNotify[i].data]);
                this.toBeNotify.splice(i, 1);
                break;
            }
        }
        return this;
    }
    unsubscribe(eventName, callback) {
        if (callback) {
            const callbacks = this.Events[eventName];
            for (let i = 0; i < callbacks.length; i += 1) {
                if (callbacks[i] === callback) {
                    callbacks.splice(i -= 1, 1);
                }
            }
        }
        else {
            delete this.Events[eventName];
        }
        return this;
    }
    guid() {
        return 'xxxxxxxx_xxxx_4xxx_yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            /* eslint-disable */
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            /* eslint-enable */
            return v.toString(16);
        });
    }
    clear() {
        this.Events = {};
        this.toBeNotify = [];
    }
}
;
exports.default = Event;
//# sourceMappingURL=event.js.map