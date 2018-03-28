import EventAPI from './event-api'
import Scratch from './scratch'

EventAPI.init({
  rootAPI: 'http://api.test.shopping.friday.tw:8200/',
  eventId: 15,
  DDIM_EC_ID: 'z%2BJchCDnjsyDNYJttgytCw%3D%3D'
})

window.addEventListener('load', function(){
  let scratch = new Scratch({
    el: '.gua-card',
    canvasId: 'scratch-canvas',
    imageSrc: './images/guabg.png',
    maxWidth: '665px',
    storkeWidth: 50
  })
  scratch.run()
})


//console.log(EventAPI.getEventSettings())
