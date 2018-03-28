import axios from 'axios'

class GetAPI {

  static init(opt) {
    this.rootAPI = opt.rootAPI
    this.eventId = opt.eventId
    this.DDIMECID = opt.DDIMECID
  }

  static getEventSettings() {
    let {rootAPI, eventId} = this
    return axios.get(`${rootAPI}/EventAction/getEventSettings?eventId=${eventId}`).then(res => {
      return res.data
    })
  }

  static getEventIsActive() {
    let {rootAPI, eventId} = this
    return axios.get(`${rootAPI}/EventAction/isActive?eventId=${eventId}`).then(res => {
      return res.data
    })
  }

  static getRecordList() {
    let {rootAPI, eventId, DDIMECID} = this
    return axios.get(`${rootAPI}/EventAction/getRecordList?eventId=${eventId}`, {
      headers: {
        'Cookie': `DDIM-EC-ID:${DDIMECID}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res=>{
      return res
    })
  }

  static getRecordListPrize(prizeId) {
    let {rootAPI, eventId, DDIMECID} = this
    return axios.get(`${rootAPI}/EventAction/getRecordList?eventId=${eventId}&prizeId=${prizeId}`, {
      headers: {
        'Cookie': `DDIM-EC-ID:${DDIMECID}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res=>{
      return res
    })
  }

  static getRecordToday(){
    let {rootAPI, eventId, DDIMECID} = this
    return axios.get(`${rootAPI}/EventAction/getRecordToday?eventId=${eventId}`, {
      headers: {
        'Cookie': `DDIM-EC-ID:${DDIMECID}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res=>{
      return res
    })
  }

  static drawEventPrize(poolNum) {
    let {rootAPI, eventId, DDIMECID} = this
    return axios.post(`${rootAPI}/EventAction/drawEventPrize`, {
      body: {
        eventId: eventId,
        poolNum: poolNum
      },
      headers: {
        'Cookie': `DDIM-EC-ID:${DDIMECID}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res => {
      return res
    })
  }
}

class Tool{

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

class Verification{

  static getState(arr) {

    for(let index in arr){
      if(!arr[index].hasOwnProperty('state') || !arr[index].hasOwnProperty('message')){
        console.error('error: not find "state" or "message" props for Promise.all(array) in verification function')
        return
      }
    }

    for(let index in arr){
      if(arr[index].state === false){
        return arr[index]
      }
    }
    return {state: true, message: '驗證成功'}
  }

  static isLogin() {
    const userCookie = 'DDIM-EC-ID'
    if(Tool.getCookie(userCookie)){
      return {state: true, message: '使用者已登入'}
    }
    return {state: false, message: '使用者未登入'
    }
  }

  static isEventActive(EventActiveRes) {
    let debug = true
    console.log(EventActiveRes, 'isEventActive')
    if(debug){
      return { state: true, message: '還有剩餘次數可供抽獎'}
    }
    return {state: false, message: '抽獎次數已達上限'}
  }

  static isSurplusDraws(poolListItem) {
    let debug = true
    console.log(poolListItem, 'poolListItem')
    if(debug){
      return { state: true, message: '還有剩餘次數可供抽獎'}
    }
    return {state: false, message: '抽獎次數已達上限'}
  }
}

class EventAPI extends GetAPI {

  static getEventSettings(){
    return Promise.all([super.getEventSettings(), super.getEventIsActive()])
      .then(res => {
        let resEventSettings = res[0]
        let resEventIsActive = res[1]

        let {poolList} = resEventSettings.data

        poolList.map(el => {
          el.verification = Verification.getState([
            Verification.isEventActive(resEventIsActive.data),
            Verification.isLogin(),
            Verification.isSurplusDraws(el)
          ])
          el.drawEventPrize = super.drawEventPrize(el.poolNum)
          console.log(el.verification)
        })

        return res
      })
  }
}

export default EventAPI
