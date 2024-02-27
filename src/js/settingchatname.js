const template = document.createElement('template')
template.innerHTML = /* HTML */
`
<style>
</style>
<div id = 'setting-container'>
<div id = 'change-chat-name'>
<p id = 'current-chat-name'></p>
<input type = 'text' id = 'changechatname'>
<input type = 'button' id = 'submitname' value = 'submit'>
</div>
</div>
`

// this is the etting class (Use for change the user name of chat app)

class setting extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.name = null
  }

  /**
   * Change the chat name to all the opened chat app in PWD
   * Update the chatname in the localstorage
   */
  changethechatname () {
    const listofchatapp = document.querySelectorAll('custom-window')
    listofchatapp.forEach(function (customwindow) {
      if (customwindow.shadowRoot.querySelector('chat-app')) {
        customwindow.shadowRoot.querySelector('chat-app').setAttribute('name', window.localStorage.getItem('chatname'))
      }
    })
  }

  /**
   * 1. Add event listener to check if user click the submit button
   * If yes, run the changethechatname function
   * 2. Check the user has/has not set up user name
   */
  connectedCallback () {
    this.shadowRoot.querySelector('#submitname').addEventListener('click', (event) => {
      window.localStorage.setItem('chatname', this.shadowRoot.querySelector('#changechatname').value)
      this.shadowRoot.querySelector('#changechatname').value = ''
      this.shadowRoot.querySelector('#current-chat-name').textContent = `The current chat app user name: ${window.localStorage.getItem('chatname')}`
      this.changethechatname()
    })

    if (!window.localStorage.getItem('chatname')) {
      this.shadowRoot.querySelector('#current-chat-name').textContent = 'Please set up your Chap app user name!!'
    } else { this.shadowRoot.querySelector('#current-chat-name').textContent = `The current chat app user name: ${window.localStorage.getItem('chatname')}` }
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

window.customElements.define('setting-window', setting)
