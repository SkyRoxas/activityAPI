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
      let {poolList} = res.data.data
      poolList.map((item) => {
        this.addPoolListItemProps(item)
      })
      return res.data
    })
  }

  static addPoolListItemProps(poolListItem) {

    const activity = this

    poolListItem.verification = function() {
      return activity.verification(poolListItem)
        .then(res=>{
          return res
        })
    }

    poolListItem.getPrize = function() {
      return '得到抽獎結果'
    }
  }

  // verification
  static verification(poolListItem) {
    return Promise.all([
       this.isActive(),
       this.isLogin(),
       this.isSurplusDraws(poolListItem)
     ])
    .then(res => {
      for(let item in res){
        if (res[item].state === undefined || res[item].errorMsg === undefined) {
          console.error('error: not find "state" or "errorMsg" props for Promise.all(array) in verification function')
          return
        }
      }
      for(let item in res){
        if (!res[item].state) {
          return {state: false, errorMsg: res[item].errorMsg}
        }
      }
      return {state: true, errorMsg: '驗證成功'}
    })
  }
  static isLogin() {
    const {getCookie} = this
    const userCookie = 'DDIM-EC-ID'
    let isLogin = {}

    if(this.DDIM_EC_ID) {
      isLogin = {
        state: true,
        errorMsg: '使用者未登入'
      }
    } else {
      isLogin = {
        state: Boolean(getCookie(userCookie)),
        errorMsg: '使用者未登入'
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
          errorMsg: '活動已結束'
        }
        return isEventActive
      })
  }
  static isSurplusDraws(poolListItem) {
    let number = 0
    let isSurplusDraws = true
    console.log(poolListItem)
    if(!number > 0) { isSurplusDraws = false
    }
    return {
      state: isSurplusDraws,
      errorMsg: '抽獎次數以達到上限'
    }
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
