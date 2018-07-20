## credential-management

账号统一登录的工具函数，支持浏览器自动登录获取账号密码，以及第三方登陆保存用户信息
### 使用

调用 `CM` 构造函数，实例化组件对象:
```javascript
const cm = new CM()
```
#### 实例属性
`CM`的实例上会挂载两个属性，`isPasswordCredentialSupport`和`isFederatedCredentialSupport`属性，用来判断对接口的支持度。

#### API
`CM` 暴露三个方法，1.注册账号密码 `register` 函数 2. 自动登录的`autoSignIn`函数 3.移除自动登录的函数`removeAutoSign` 三个方法均返回`promise`

##### register
`register`接收两个参数，注册的`data`以及注册的类型`type`
注册类型`type`有两种， 1、`password` 用于注册网站直接的账号密码登录，同时也是`type`的默认值
2、`federated` 用户注册第三方账号信息

参考如下例子：
```javascript
// type 为 password
cm.register({
  password: 'password',
  id: 'userName'
}, 'password')

// type 为 federated
cm.register({
  name: 'name',
  id: 'id',
  provider: 'https://www.github.com' // 第三方认证的网址
}, 'federated')
```

`register`函数将返回一个`promise`，会把储存后的信息返回

##### autoSignIn
`autoSignIn` 接收自动登录的配置：
  `password`的`true`和`false`来区分是否开启用密码登录
  `providers`用于指定我需要开启哪些第三方的验证
  `mediation`的值若为`silent`则表示静默登录`optional`为供用户选择


##### removeAutoSign
移除自动登录，无需任何参数

### API返回的错误情况
`code: -1, msg: 'did not have Credentials' ` 自动登录的时密码管理器中没有检索到密码
`code: -2, msg: 'register Password faild' ` 注册密码失败，没有传入密码或用户id
`code: -3, msg: 'register Federated faild' ` 注册联合账号时传入信息不完整
`code: -1000, msg: 'not supportsign' ` 当前系统版本太低，不支持取消自动登录
`code: -1001, msg: 'not support this way sign' ` 当前系统版本太低，返回的密码类型不正确
`code: -1002, msg: 'not support at Chrome version < 60' ` 当前系统版本太低，不支持获取密码明文
`code: -1003, msg: 'not support Federated sign'` 当前站点不支持联合账号登录
`code: -1004, msg: 'not support Password sign'` 当前站点不支持账号密码方式登录

