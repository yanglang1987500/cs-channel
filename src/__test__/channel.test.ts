import Channel from '../channel';
import { proto } from './util';

describe('test channel', () => {

  let clientChannel: Channel = null;
  let serverChannel: Channel = null;

  beforeEach(() => {
    clientChannel = new Channel({
      sender: message => {
        proto.client.postMessage(message);
      },
      receiver: (callback) => {
        proto.client.onMessage((message) => {
          callback(message);
        });
      }
    });
    serverChannel = new Channel({
      sender: message => {
        proto.server.postMessage(message);
      },
      receiver: (callback) => {
        proto.server.onMessage((message) => {
          callback(message);
        });
      }
    });
  });

  it('test client call server', async done => {
    const data = { url: 'http://www.baidu.com' };
    const result = 'i am search result';
    serverChannel.on('http_get', async param => {
      expect(param).toBe(data);
      return result;
    });
    try {
      const response = await clientChannel.call<string>('http_get', data);
      expect(response).toBe(result);
      expect(serverChannel._.has('http_get')).toBe(true);
      expect(clientChannel._.Events).toMatchObject({});
    } catch(e) {
      console.log(e);
    }
    done();
  });

  it('test server call client and events has been cleaned', async done => {
    const data = { action: 'refresh' };
    clientChannel.on('server_command', async param => {
      expect(param).toBe(data);
    });
    await serverChannel.call('server_command', data);
    expect(clientChannel._.has('server_command')).toBe(true);
    expect(serverChannel._.Events).toMatchObject({});
    done();
  });

  it('test api can not find', async done => {
    const data = { url: 'http://www.baidu.com' };
    const result = 'i am search result';
    serverChannel.on('http_get', async param => {
      expect(param).toBe(data);
      return result;
    });
    try {
      await clientChannel.call<string>('http_post', data);
    } catch(e) {
      expect(e.message).toBe('can not find api http_post');
    }
    done();
  });

  
  it('test api throw error', async done => {
    const data = { url: 'http://www.baidu.com' };
    const error = 'something wrong...';
    serverChannel.on('http_get', async param => {
      throw new Error(error);
    });
    try {
      await clientChannel.call<string>('http_get', data);
    } catch(e) {
      expect(e.message).toBe(error);
      expect(e instanceof Error).toBe(true);
    } 
    done();
  });

  it('test serializeError', async done => {
    clientChannel = new Channel({
      serializeError: true,
      sender: message => {
        proto.client.postMessage(message);
      },
      receiver: (callback) => {
        proto.client.onMessage((message) => {
          callback(message);
        });
      }
    });
    serverChannel = new Channel({
      serializeError: true,
      sender: message => {
        proto.server.postMessage(message);
      },
      receiver: (callback) => {
        proto.server.onMessage((message) => {
          callback(message);
        });
      }
    });
    const data = { url: 'http://www.baidu.com' };
    const error = 'something wrong...';
    serverChannel.on('http_get', async param => {
      throw new Error(error);
    });
    try {
      await clientChannel.call<string>('http_get', data);
    } catch(e) {
      expect(e instanceof Error).toBe(false);
    } 
    done();
  });
});


