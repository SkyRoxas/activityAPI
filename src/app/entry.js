import ActivitySDK from './activity-sdk'

let innerHtmlBlocks = []

const dateCompiled = $date => {
  const date = new Date($date)
  const Y = date.getFullYear()
  const M = (
    date.getMonth() + 1 < 10
    ? '0' + (
    date.getMonth() + 1)
    : date.getMonth() + 1)
  const D = date.getDate()
  const h = date.getHours()
  return `${Y}年 ${M}月 ${D}日 ${h}時`
}

ActivitySDK.init({
  rootAPI: 'http://api.test.shopping.friday.tw:8200/',
  eventId: 1,
  DDIM_EC_ID: 'z%2BJchCDnjsyDNYJttgytCw%3D%3D'
})

ActivitySDK.verification()
  .then(res => {
    console.log(res)
  })

ActivitySDK.getInfo()
  .then(res => {
    let {eventStartDatetime, eventEndDatetime} = res.data
    const startDate = dateCompiled(eventStartDatetime)
    const endDate = dateCompiled(eventEndDatetime)
    let str =
        `<div class="field field-druing">
            <div> 開始日前： ${startDate}</div>
            <div> 結束日期： ${endDate}</div>
        </div>`
    innerHtmlBlocks.push(str)
    return res
  })
  .then(res => {
    let {poolList} = res.data
    let str = ''
    let poolListStr = ''
    let prizeListStr = ''
    poolList.forEach(function(el) {
      prizeListStr = ''
      el.prizeList.forEach(function($el) {
        prizeListStr += `<li>${$el.prizeType}</li>`
      })
      poolListStr +=
          `<div>
            <ul>${prizeListStr}</ul>
            <button>進行抽獎</button>
          </div>`
    })
    str = `<div class="field field-poolList">${poolListStr}</div>`
    innerHtmlBlocks.push(str)
    return res
  })
  .then(() => {
    document.body.innerHTML = innerHtmlBlocks.join('')
  })
