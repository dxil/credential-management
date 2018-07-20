/**
 * @author cuzz
 * @date 2018-07-17
 * @fileoverview 账号统一登录的工具函数
 */

const utils = {
  returnError (msg, type = 'promise') {
    if (type === 'normal') return new Error(msg)
    if (type === 'promise') return Promise.reject(msg)
  }
}
/* eslint-disable */

class CM {
  constructor () {
    this.isPasswordCredentialSupport = !!window.PasswordCredential
    this.isFederatedCredentialSupport = !!window.FederatedCredential
  }
  autoSignIn (opts = {}) {
    if (!this.isPasswordCredentialSupport && !this.isFederatedCredentialSupport) return utils.returnError({code: -1000, msg: 'not support Credential Management'})

    this._opts = {
      usePassword: opts.usePassword || true, // 是否使用密码自动登录
      providers: opts.providers || [], // 联合登录的账号地址
      mediation: opts.mediation || 'optional' // 是否静默登录
    }

    // Actual Credential Management API call to get credential object
    return navigator.credentials.get({
      password: true,
      federated: {
        providers: this._opts.providers
      },
      mediation: this._opts.mediation
    }).then(cred => {
      // If credential object is available
      if (!cred) return utils.returnError({code: -1, msg: 'did not have Credentials'})

      console.log('auto sign-in performed')

      switch (cred.type) {
        case 'password':
          // If `password` prop doesn't exist, this is Chrome < 60
          if (cred.password === undefined) {
            return utils.returnError({code: -1002, msg: 'not support at Chrome version < 60'})

          // Otherwise, this is Chrome => 60
          } else {
            // return cred data
            return Promise.resolve({type: cred.type, cred: cred})
          }
        case 'federated':
          return Promise.resolve({type: cred.type, cred: cred})
        default:
          return utils.returnError({code: -1001, msg: 'not support this way sign'})
      }
    })
  }
  register (data, type = 'password') {
    switch (type) {
      case 'federated':
        return this._registerWithFederated(data)
      case 'password':
        return this._registerWithPassword(data)
      default:
        return utils.returnError({code: -1001, msg: 'not support this way sign'})
    }
  }
  removeAutoSign () {
    if (!navigator.credentials.preventSilentAccess) return utils.returnError({code: -1000, msg: 'not supportsign'})
    navigator.credentials.preventSilentAccess()
  }
  _registerWithFederated (data) {
    if (!this.isFederatedCredentialSupport) return utils.returnError({code: -1003, msg: 'not support Federated sign'})
    if (!data.id || !data.name || !data.provider) return utils.returnError({code: -3, msg: 'register Federated faild'})

    let cred = new FederatedCredential({
        id:       data.id,
        name:     data.name,
        iconURL:  data.iconURL || '',
        provider: data.provider
      });

    return this._store(cred)
  }
  // 通过账号密码注册当前账户
  _registerWithPassword (data) {
    if (!this.isPasswordCredentialSupport) return utils.returnError({code: -1004, msg: 'not support Password sign'})
    if (!data.id || !data.password) return utils.returnError({code: -2, msg: 'register Password faild'})

    let cred = new PasswordCredential({id: data.id, password: '123'})
    // cred.name = data.name || data.id

    return this._store(cred)
  }
  // Store credential information after successful authentication
  _store (cred) {
    navigator.credentials.store(cred)
    return Promise.resolve({cred: cred})
  }
}

