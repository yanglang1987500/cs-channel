var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Event, { EVENT_PREFIX } from '../event';
describe('test event', () => {
    let _ = new Event();
    beforeEach(() => {
        _.clear();
    });
    it('test subscribe and has', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventName = 'onClick';
        const callback = jest.fn();
        _.subscribe(eventName, callback);
        expect(_.has(eventName)).toBe(true);
    }));
    it('test subscribe and notify', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventName = 'onClick';
        const callback = jest.fn();
        const data1 = { userName: 'Tom' };
        const data2 = { age: 25 };
        _.subscribe(eventName, callback);
        _.notify(eventName, data1, data2);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith(data1, data2);
    }));
    it('test unsubscribe and has', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventName = 'onClick';
        const callback = jest.fn();
        _.subscribe(eventName, callback);
        expect(_.has(eventName)).toBe(true);
        _.unsubscribe(eventName, callback);
        expect(_.has(eventName)).toBe(false);
    }));
    it('test subscribe callback array and notify', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventName = 'onClick';
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        _.subscribe(eventName, [callback1, callback2]);
        _.notify(eventName);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
    }));
    it('test subscribe callback array and unsubscribe', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventName = 'onClick';
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        _.subscribe(eventName, [callback1, callback2]);
        expect(_.has(eventName)).toBe(true);
        _.unsubscribe(eventName);
        expect(_.has(eventName)).toBe(false);
    }));
    it('test temporary event(just like once)', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventName = `${EVENT_PREFIX}_onClick`;
        const callback = jest.fn();
        _.subscribe(eventName, callback);
        expect(_.has(eventName)).toBe(true);
        _.notify(eventName);
        expect(_.has(eventName)).toBe(false);
    }));
    it('test toBeNotify work', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventName = `onClick`;
        _.notify(eventName, 2);
        const callback = jest.fn();
        _.subscribe(eventName, callback);
        expect(callback).toBeCalledWith(2);
    }));
    it('test guid', () => {
        const guid = _.guid();
        expect(guid.length).toBe(36);
    });
    it('test notifyWith', () => {
        const eventName = 'onClick';
        const callback = jest.fn();
        const scope = 'i am context';
        const data = { age: 25 };
        _.subscribe(eventName, callback);
        _.notifyWith(eventName, scope, data);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toBeCalledWith(data);
        expect(callback.mock.instances[0]).toBe(scope);
    });
});
//# sourceMappingURL=event.test.js.map