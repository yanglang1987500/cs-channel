"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proto = {
    client: {
        message: null,
        callback: null,
        postMessage(message) {
            exports.proto.server.message = message;
            exports.proto.server.callback(message);
        },
        onMessage(callback) {
            this.callback = callback;
        }
    },
    server: {
        message: null,
        callback: null,
        postMessage(message) {
            exports.proto.client.message = message;
            exports.proto.client.callback(message);
        },
        onMessage(callback) {
            this.callback = callback;
        }
    }
};
//# sourceMappingURL=util.js.map