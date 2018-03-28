import $ from 'jquery'

class Scratch{
  constructor(opt){
    this.el = opt.el
    this.canvasId = opt.canvasId
    this.storkeWidth = opt.storkeWidth
    this.imageSrc = opt.imageSrc
    this.maxWidth = opt.maxWidth && opt.maxWidth || '100%'
  }

  createCanvas(){
    const {el, canvasId, maxWidth} = this
    const $el = $(el)
    $el.css({ position: 'relative', 'max-width': maxWidth})
    $el.append(`<canvas id="${canvasId}" width="${$el.innerWidth()}" height=${$el.innerHeight()}></canvas>`)
  }

  addStyle(){
    const {el, canvasId} = this
    const $el = $(el)
    const $canvasId = $(`#${canvasId}`)
    $canvasId.css({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'})
    $el.find('*').css({ '-webkit-user-select': 'none', '-moz-user-select': 'none', '-ms-user-select': 'none', 'user-select': 'none' })
  }

  drawCanvas(){
    const {el, canvasId, imageSrc} = this
    const $el = $(el)

    const canvas = document.getElementById(canvasId)
    const ctx = canvas.getContext('2d')

    if(imageSrc){
      const img = new Image()
      img.src = imageSrc
      img.onload = function(){
        ctx.drawImage(img, 0, 0)
      }
    } else {
      console.log($el.innerWidth())
      ctx.rect(0, 0, $el.innerWidth(), $el.innerHeight())
      ctx.fill()
    }
  }

  run(){
    this.createCanvas()
    this.addStyle()
    this.drawCanvas()

    let {el, storkeWidth, canvasId} = this
    let $el = $(el)

    const canvas = document.getElementById(canvasId)
    const ctx = canvas.getContext('2d')

    const hasTouchEvent = 'ontouchstart' in window ? true : false
    const downEvent = hasTouchEvent ? 'ontouchstart' : 'mousedown'
    const moveEvent = hasTouchEvent ? 'ontouchmove' : 'mousemove'
    const upEvent = hasTouchEvent ? 'touchend' : 'mouseup'

    let x1 = 0
    let y1 = 0
    let x2 = 0
    let y2 = 0

    let isMouseActive = false

    let canvasCurrectWidth = $el.innerWidth()
    let canvasResizeWidth = $el.innerWidth()

    $(window).resize(function(){
      canvasResizeWidth = $el.innerWidth()
    })

    canvas.addEventListener(downEvent, function(e){

      isMouseActive = true

      x1 = e.offsetX * (canvasCurrectWidth / canvasResizeWidth)
      y1 = e.offsetY * (canvasCurrectWidth / canvasResizeWidth)

      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = storkeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.save()
      ctx.beginPath()

    })

    canvas.addEventListener(moveEvent, function(e){

      if(!isMouseActive){
        return
      }

      x2 = e.offsetX * (canvasCurrectWidth / canvasResizeWidth)
      y2 = e.offsetY * (canvasCurrectWidth / canvasResizeWidth)

      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)

      ctx.stroke()

      x1 = e.offsetX * (canvasCurrectWidth / canvasResizeWidth)
      y1 = e.offsetY * (canvasCurrectWidth / canvasResizeWidth)
    })

    canvas.addEventListener(upEvent, function(){

      isMouseActive = false

      ctx.restore()
    })
  }
}

export default Scratch
