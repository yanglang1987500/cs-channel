"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../channel");
const util_1 = require("./util");
describe('test channel', () => {
    let clientChannel = null;
    let serverChannel = null;
    beforeEach(() => {
        clientChannel = new channel_1.default({
            sender: message => {
                util_1.proto.client.postMessage(message);
            },
            receiver: (callback) => {
                util_1.proto.client.onMessage((message) => {
                    callback(message);
                });
            }
        });
        serverChannel = new channel_1.default({
            sender: message => {
                util_1.proto.server.postMessage(message);
            },
            receiver: (callback) => {
                util_1.proto.server.onMessage((message) => {
                    callback(message);
                });
            }
        });
    });
    it('test client call server', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = { url: 'http://www.baidu.com' };
        const result = 'i am search result';
        serverChannel.on('http_get', (param) => __awaiter(void 0, void 0, void 0, function* () {
            expect(param).toBe(data);
            return result;
        }));
        try {
            const response = yield clientChannel.call('http_get', data);
            expect(response).toBe(result);
            expect(serverChannel._.has('http_get')).toBe(true);
            expect(clientChannel._.Events).toMatchObject({});
        }
        catch (e) {
            console.log(e);
        }
        done();
    }));
    it('test server call client and events has been cleaned', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = { action: 'refresh' };
        clientChannel.on('server_command', (param) => __awaiter(void 0, void 0, void 0, function* () {
            expect(param).toBe(data);
        }));
        yield serverChannel.call('server_command', data);
        expect(clientChannel._.has('server_command')).toBe(true);
        expect(serverChannel._.Events).toMatchObject({});
        done();
    }));
    it('test api can not find', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = { url: 'http://www.baidu.com' };
        const result = 'i am search result';
        serverChannel.on('http_get', (param) => __awaiter(void 0, void 0, void 0, function* () {
            expect(param).toBe(data);
            return result;
        }));
        try {
            yield clientChannel.call('http_post', data);
        }
        catch (e) {
            expect(e.message).toBe('can not find api http_post');
        }
        done();
    }));
    it('test api throw error', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const data = { url: 'http://www.baidu.com' };
        const error = 'something wrong...';
        serverChannel.on('http_get', (param) => __awaiter(void 0, void 0, void 0, function* () {
            throw new Error(error);
        }));
        try {
            yield clientChannel.call('http_get', data);
        }
        catch (e) {
            expect(e.message).toBe(error);
            expect(e instanceof Error).toBe(true);
        }
        done();
    }));
    it('test serializeError', (done) => __awaiter(void 0, void 0, void 0, function* () {
        clientChannel = new channel_1.default({
            serializeError: true,
            sender: message => {
                util_1.proto.client.postMessage(message);
            },
            receiver: (callback) => {
                util_1.proto.client.onMessage((message) => {
                    callback(message);
                });
            }
        });
        serverChannel = new channel_1.default({
            serializeError: true,
            sender: message => {
                util_1.proto.server.postMessage(message);
            },
            receiver: (callback) => {
                util_1.proto.server.onMessage((message) => {
                    callback(message);
                });
            }
        });
        const data = { url: 'http://www.baidu.com' };
        const error = 'something wrong...';
        serverChannel.on('http_get', (param) => __awaiter(void 0, void 0, void 0, function* () {
            throw new Error(error);
        }));
        try {
            yield clientChannel.call('http_get', data);
        }
        catch (e) {
            expect(e instanceof Error).toBe(false);
        }
        done();
    }));
});
//# sourceMappingURL=channel.test.js.map