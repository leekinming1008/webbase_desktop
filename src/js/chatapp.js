var apikey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

var template = document.createElement('template')
template.innerHTML = /* HTML */
`
<style>
#text-contanter{
  height: 200px;
  width: 275px;
  overflow: auto;
  border-style: dashed;
}

#input-text-area{
  width: 90%;
  height: 10%;
  bottom: 15px;
  position: absolute;
  left: 5px;
}

#chat-text{
  width: 200px;
  resize: none;
}

#sent-message{
  right: 0px;
  position: absolute;
}

</style>
<div id='chatapp'>
<div id='text-contanter'>
</div>
<div id='input-text-area'>
<textarea id = 'chat-text'></textarea>
<input id = 'sent-message' type = 'button' value = 'send'>
</div>
</div>
`

var texttemplate = document.createElement('template')
texttemplate.innerHTML = /* HTML */
`
<style>
</style>
<div id='text-message'>
<div id='text-name'>
</div>
<div id='text-detail'>
</div>
</div>
`

var inputnametemplate = document.createElement('template')
inputnametemplate.innerHTML = /* HTML */
`
<div id = 'input-user-name'>
Please input user name: <input type = 'text' id = 'user-name'>
<input id = 'submit-user-name' type = 'button' value = 'submit'>
</div>
`
// this is chat app class

class chatapp extends HTMLElement {
  /**
   * @var this.name The user name
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.name = null
    this.storedchat = []
    this.connectserver = null
  }

  /**
   * Send out the message
   * @param {string} sendmessage The message type in the text box
   * @param {channel} servername The media of connected to the server
   */
  async sendmessage (sendmessage, servername) {
    // console.log(servername.readyState)
    var sendtoserver = {

      type: 'message',
      data: sendmessage,
      username: this.name,
      channel: 'my, not so secret, channel',
      key: apikey

    }
    sendtoserver = JSON.stringify(sendtoserver)
    servername.send(sendtoserver)
  }

  /**
   * Receive Message
   * @param {date} receivedmessage Received data from the server
   */
  receivemessage (receivedmessage) {
    const receiveddate = JSON.parse(receivedmessage.data)

    /**
     * Identifiy the message is from user or server
     * If it is from user, it will show in to chat app
    */
    if (receiveddate.type === 'message') {
      const textcontainer = texttemplate.content.cloneNode(true)
      textcontainer.querySelector('#text-name').textContent = 'User Name: ' + receiveddate.username + ': '
      textcontainer.querySelector('#text-detail').textContent = receiveddate.data
      this.shadowRoot.querySelector('#text-contanter').appendChild(textcontainer)
      this.shadowRoot.querySelector('#text-contanter').scrollTop = this.shadowRoot.querySelector('#text-contanter').scrollHeight
      this.storedmessage(receiveddate.data, receiveddate.username)
    }
  }

  /**
   * Store all the message from user
   * @param {string} storedmessage The message detail
   * @param {string} name The sender name of the message
   */
  storedmessage (storedmessage, name) {
    this.storedchat.push({ name: name, message: storedmessage })
    if (this.storedchat.length > 20) {
      this.storedchat.shift()
    }
  }

  /**
   * Restore the saved message to chat app
   */
  restoredmessage () {
    if (window.localStorage.getItem('chatrecords')) {
      const chatrecords = JSON.parse(window.localStorage.getItem('chatrecords'))
      let index = 0
      chatrecords.forEach(element => {
        this.storedchat.push(element)
        const textcontainer = texttemplate.content.cloneNode(true)
        textcontainer.querySelector('#text-name').textContent = 'User Name: ' + this.storedchat[index].name + ': '
        textcontainer.querySelector('#text-detail').textContent = this.storedchat[index].message
        this.shadowRoot.querySelector('#text-contanter').appendChild(textcontainer)
        index++
      })
    }
  }

  /**
   * Build up the connection to the server
   * check user has/has not set user name
   * Add event listener when received any data from server
   * Add event listener when user click the send button
   */
  connectedCallback () {
    const currentobj = this
    this.restoredmessage()
    this.shadowRoot.querySelector('#text-contanter').scrollTop = this.shadowRoot.querySelector('#text-contanter').scrollHeight

    if (window.localStorage.getItem('chatname')) {
      this.name = window.localStorage.getItem('chatname')
    } else {
      this.shadowRoot.querySelector('#text-contanter').appendChild(inputnametemplate.content.cloneNode(true))
      this.shadowRoot.querySelector('#submit-user-name').addEventListener('click', event => {
        this.name = currentobj.shadowRoot.querySelector('#user-name').value
        window.localStorage.setItem('chatname', this.name)
        currentobj.shadowRoot.querySelector('#text-contanter').removeChild(currentobj.shadowRoot.querySelector('#text-contanter').children[0])
      })
    }

    this.connectserver = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
    this.shadowRoot.querySelector('#sent-message').addEventListener('click', event => {
      if (window.localStorage.getItem('chatname')) {
        this.sendmessage(this.shadowRoot.querySelector('#chat-text').value, this.connectserver)
        this.shadowRoot.querySelector('#chat-text').value = ''
      } else {
        this.shadowRoot.querySelector('#chat-text').value = 'Please set the user name before send message'
      }
    })

    this.connectserver.addEventListener('message', event => {
      this.receivemessage(event)
    })
  }

  /**
   * Store the recorded message to the local storage
   */
  disconnectedCallback () {
    if (window.localStorage.getItem('chatrecords')) {
      window.localStorage.setItem('chatrecords', JSON.stringify(this.storedchat))
    } else { window.localStorage.setItem('chatrecords', JSON.stringify(this.storedchat)) }
    this.connectserver.close()
  }

  static get observedAttributes () {
    return ['name']
  }

  attributeChangedCallback (name, oldvalue, newvalue) {
    if (name === 'name') {
      this.name = newvalue
    }
  }
}

window.customElements.define('chat-app', chatapp)
