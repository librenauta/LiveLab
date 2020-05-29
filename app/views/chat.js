var html = require('choo/html')
var Component = require('choo/component')
const input = require('./components/input.js')
const anchorme = require("anchorme").default;

module.exports = class Chat extends Component {
  constructor (id, state, emit) {
    super(id)
    this.user = state.user
    this.emit = emit
   this.channel = state.multiPeer.addChannel('chat', {})
    // console.log('added chat channel', id,state, emit)
    // this.messages = []
    this.channel.on('message', (message, peer) => {
      this.addMessage(message, peer)
    })
    this.messages = []
    this.inputValue = ''
  }

  update() {
    return false
  }

  addMessage(message, user) {
    this.messages.push({
      message: message,
      user: user,
      time: Date.now()
    })
    this.emit('layout:openChat')
    this.rerender()

    // for some reason this only works with getElementById??
    setTimeout(() => {
      let t = document.getElementById('scroll-container')
      t.scrollTop = t.scrollHeight
    }, 200)
  }


  sendMessage() {
    this.channel.send('message', this.inputValue)
    this.addMessage(this.inputValue, this.user)
    this.inputValue = ''
    this.rerender()
  }

  createElement(state) {
    var scrollEl = html`<div id="testScroll" style="bottom:0px">
      ${this.messages.map((obj)=>{
        let msg = html`<span class="pa1"></span>`
        msg.innerHTML = anchorme({ input: obj.message, options: {
          truncate: 100,
          attributes: {
            target: '_blank',
            class: 'white dim'
          }
        }})
        return html`
          <div class='mv2'>
            <span class="pr1 pt1 b">${obj.user.nickname}:</span>
            ${msg}
          </div>
        `
      })}
    </div>`
    var container =  html
    `<div  id="scroll-container" class="overflow-y-auto" style="max-height:200px;">
    ${scrollEl}
    </div>`
    this.container = container
    container.scrollTop = container.scrollHeight

      // ${container}
    return html`  <div>
          ${container}
          ${input('', 'send a message', {
            value: this.inputValue,
            onkeyup: (e) => {
              if(e.keyCode=== 13){
                this.sendMessage()
              } else {
                this.inputValue = e.target.value
                this.rerender()
              }
            }
          })}
          <div class="f6 fr ma2 link ph3 pv2 mb2 white bg-dark-pink pointer" onclick=${this.sendMessage.bind(this)}>Send</div>
        </div>
        `
  }
}