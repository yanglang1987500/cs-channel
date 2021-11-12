# cs-channel
一个跨端调用通信库，让socket、web worker、iframe通信、vscode(`webview`)、electron(`ipcMain`、`ipcRenderer`)等全双工通信调用像调用ajax(`async/await`)一样马上得到处理结果：
```javascript
  (async () => {
    const params = { ... };
    const data = await channel.call('server-api', params);
  })();
```
连异常都能处理得非常优雅哦！
```typescript
try {
  await clientChannel.call<string>('http_post', data);
} catch(e) {
  expect(e.message).toBe('can not find api http_post');
}
```
```typescript
const data = { url: 'http://www.baidu.com' };
const error = 'something wrong...';
serverChannel.on('http_get', async param => {
  throw new Error(error);
});
try {
  await clientChannel.call<string>('http_get', data);
} catch(e) {
  expect(e.message).toBe(error);
}
```

两端（客户端、服务端）同时使用，若服务端环境非nodejs（比如socket下的.NET或java），也可以使用预定的消息协议处理，不影响客户端使用（消息协议后文会说明）。

# 使用方法
初始化`channel`实例，定义`sender`发送与`receiver`接收两个回调（用vscode的webview开发举例）：
## 客户端
```javascript
  import Channel from 'cs-channel'
  
  const vscode = acquireVsCodeApi();
  const clientChannel = new Channel({
    sender: message => void vscode.postMessage(message),
    receiver: callback => {
      window.addEventListener('message', (event: { data: any }) => {
        event && event.data && callback(event.data);
      });
    }
  });
```
## 服务端
```javascript
  import Channel from 'cs-channel'
  
  const serverChannel = new Channel({
    sender: message => void panel.webview.postMessage(message),
    receiver: callback => {
      panel.webview.onDidReceiveMessage((message: IMessage) => {
        message.api && callback(message);
      }), undefined, context.subscriptions);
    }
  });
```
> 此举目的是适配不同场景的消息通信方案。

然后，分为两个场景：
- 客户端调服务端api
- 服务端调客户端api

```javascript
  // 客户端调服务端api

  // 服务端订阅api
  serverChannel.on('server-api', async param => {
    // 处理完成后返回结果
    return await http.get(param.url, param.data);
  });
  // 客户端调用api得到服务端返回的结果
  const result = await clientChannel.call('server-api', {
    url: 'http://...',
    data: { id: 1 }
  });
```

```javascript
  // 服务端调客户端api

  // 客户订阅api
  clientChannel.on('client-api', async param => {
    // 客户端收到消息后显示出来，不返回任何数据
    document.querySelector('#msg').innerHTML = param.message;
    document.querySelector('#sendor').innerHTML = param.sendor;
  });
  // 服务端调用api得到客户端返回的结果
  const result = await serverChannel.call('client-api', {
    message: 'hello, client!',
    sender: 'server'
  });
```

# 消息协议
```typescript
  interface IMessage<T=IKeyValueMap> {
    api: string;
    data: T;
    error?: Error;
    msgId: string;
  }
```

- 13个单元测试已通过
- `TypeScript`静态类型约束 + `d.ts`声明
