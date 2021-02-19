export const proto = {
  client: {
    message: null,
    callback: null,
    postMessage(message) {
      proto.server.message = message;
      proto.server.callback(message);
    },
    onMessage(callback) {
      this.callback = callback;
    }
  },
  server: {
    message: null,
    callback: null,
    postMessage(message) {
      proto.client.message = message;
      proto.client.callback(message);
    },
    onMessage(callback) {
      this.callback = callback;
    }
  }
};