import axios from 'axios'

class ActivitySDK {

  static init(opt) {
    this.rootAPI = opt.rootAPI
    this.eventId = opt.eventId
    this.DDIM_EC_ID = opt.DDIM_EC_ID
  }

  static getInfo() {
    let {rootAPI, eventId} = this
    return axios.get(`${rootAPI}/EventAction/getEventSettings?eventId=${eventId}`).then(res => {
      return res.data
    })
  }

  // verification
  static verification() {
    return Promise.all([
       this.isActive(),
       this.isLogin()
     ])
    .then(res => {
      for(let item in res){
        if (res[item].state === undefined || res[item].message === undefined) {
          console.error('error: not find "state" or "message" props for Promise.all(array) in verification function')
          return
        }
      }
      for(let item in res){
        if (!res[item].state) {
          return {state: false, message: res[item].message}
        }
      }
      return {state: true, message: '驗證成功'}
    })
  }
  static isLogin() {
    const {getCookie} = this
    const userCookie = 'DDIM-EC-ID'
    let isLogin = {}

    if(this.DDIM_EC_ID) {
      isLogin = {
        state: true,
        message: '使用者未登入'
      }
    } else {
      isLogin = {
        state: Boolean(getCookie(userCookie)),
        message: '使用者未登入'
      }
    }
    return Promise.resolve(isLogin)
  }
  static isActive() {
    let {rootAPI, eventId} = this
    return axios.get(`${rootAPI}/EventAction/isActive?eventId=${eventId}`).then(res => {
      return res.data
    })
      .then(res => {
        let isEventActive = {
          state: res.data,
          message: '活動已結束'
        }
        return isEventActive
      })
  }

  // cookie
  static getCookie(sName) {
    let aCookie = document.cookie.split('; ')
    let len = aCookie.length
    for (let i = 0; i < len; i++) {
      let aCrumb = aCookie[i].split('=')
      if (sName === aCrumb[0]) {
        return unescape(aCrumb[1])
      }
    }
    return null
  }
}

export default ActivitySDK
