const template = document.createElement('template')
template.innerHTML = /* HTML */`
<style>
:host{
  position: absolute;
}
#myModal {
    position: relative; 
    z-index: 1;
    width: 300px; 
    height: 300px; 
    overflow: auto; 
  }
  
  /* Modal Content */
  #modal-content {
    background-color: #fefefe;
    margin: 0px;
    padding: 0px;
    border: 1px solid #888;
    width: 280px;
    height: 280px;
  }
  
  /* The Close Button */
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }

  #top-bar{
      width:100%;
      height: 30px;
      font-size: 10px;
      background-color: blue;
  }

  #appicon img{
    height:30px;
    vertical-align: middle;
  }

  #apptitle{
    color: white;
    font-size: 20px;
    vertical-align: middle;
  }
  
  </style>
  <!-- The Modal -->
<div id="myModal" class="modal">

  <!-- Modal content -->
  <div id="modal-content">
    <div id = 'top-bar'>
    <span class="close" id = 'close'>&times;</span>
    <span id="appicon"><img></span>
    <span id="apptitle"></span>
    </div>
    <div id = 'tagname'>
    </div>

  </div>

</div>

`

/**
 * This is the custom window class
 * It is a object to obtain every application in this PWD
 */

class customwindow extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.apptitle = null
    this.appicon = null
    this.tagname = null
    this.name = null
    this.beginx = 0
    this.beginy = 0
    this.jsfilename = null
  }

  /**
   * Build different application inside the window
   */
  setupwindow () {
    this.shadowRoot.querySelector('#apptitle').textContent = this.apptitle
    this.shadowRoot.querySelector('#appicon').firstElementChild.setAttribute('src', `image/${this.appicon}.png`)
    const createapp = document.createElement(this.tagname)
    createapp.setAttribute('name', this.name)
    this.shadowRoot.querySelector('#tagname').appendChild(createapp)
  }

  /**
   * Put the selected element in the front of the PWD
   */
  putwindowinfront () {
    const customwindows = document.querySelectorAll('custom-window')

    // set other custom window element z-index to 1
    customwindows.forEach(element => {
      if (element !== this) { element.shadowRoot.querySelector('#myModal').style.zIndex = 1 }
    })

    this.shadowRoot.querySelector('#myModal').style.zIndex = 10
  }

  /**
   * Get the position of new custom window element
   */
  settingposition () {
    const listofobj = document.querySelectorAll('custom-window')
    if (this.checktonewlocation((10 * (listofobj.length - 1) + 10), (10 * (listofobj.length - 1) + 50))) {
      this.style.top = `${10 * (listofobj.length - 1) + 50}px`
      this.style.left = `${10 * (listofobj.length - 1) + 10}px`
    } else if (this.checktonewlocation((10 * (listofobj.length - 1) + 20), (10 * (listofobj.length - 1) + 50))) {
      this.style.top = `${10 * (listofobj.length - 1) + 50}px`
      this.style.left = `${10 * (listofobj.length - 1) + 20}px`
    } else if (this.checktonewlocation((10 * (listofobj.length - 1) + 10), (10 * (listofobj.length - 1) + 60))) {
      this.style.top = `${10 * (listofobj.length - 1) + 60}px`
      this.style.left = `${10 * (listofobj.length - 1) + 10}px`
    } else {
      this.style.top = '50px'
      this.style.left = '10px'
    }
  }

  /**
   * Avoid the custom window been out of the screen
   * @param {location} newx new x-axis index location for element
   * @param {location} newy new y-axis index location for element
   */
  checktonewlocation (newx, newy) {
    if (newx < 10 || newy < 50) {
      return false
    } else if ((newx + parseInt(this.style.width)) > (document.body.clientWidth + 10) || (newy + parseInt(this.style.height)) > (document.body.clientHeight + 10)) {
      return false
    } else {
      return true
    }
  }

  /**
   * Dynamicly load different file
   */
  addrequiredjsfile () {
    let jsfileexcited = false

    const currentjsfile = document.querySelectorAll('script')

    currentjsfile.forEach((jsfile) => {
      if (jsfile.src === `http://localhost:4000/js/${this.jsfilename}.js`) {
        jsfileexcited = true
      }
    })

    if (!jsfileexcited) {
      const newobject = document.createElement('script')
      newobject.setAttribute('type', 'module')
      newobject.setAttribute('src', `js/${this.jsfilename}.js`)
      document.head.appendChild(newobject)
    }
  }

  /**
   * 1. add event listener to allow user to drag and move window element and remove this function
   * after particular user event
   * 2. get the window postion when create window element
   * 3. put the new window element in the front
   */
  connectedCallback () {
    this.addrequiredjsfile()
    this.settingposition()
    var modal = this.shadowRoot.getElementById('myModal')
    var currentobj = this
    this.setupwindow()
    this.putwindowinfront(this)

    // Get the <span> element that closes the modal
    var span = this.shadowRoot.getElementById('close')

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = 'none'
      currentobj.remove()
    }

    // Let user to drag and move the custom window
    this.shadowRoot.querySelector('#top-bar').addEventListener('mousedown', function mousedownaction (event) {
      this.beginx = event.clientX
      this.beginy = event.clientY

      currentobj.mousemoveaction = function (event) {
        if (currentobj.checktonewlocation((currentobj.offsetLeft + event.clientX - this.beginx), (currentobj.offsetTop + event.clientY - this.beginy))) {
          currentobj.style.left = (currentobj.offsetLeft + event.clientX - this.beginx) + 'px'
          currentobj.style.top = (currentobj.offsetTop + event.clientY - this.beginy) + 'px'
          this.beginx = event.clientX
          this.beginy = event.clientY
        }
      }
      currentobj.shadowRoot.querySelector('#top-bar').addEventListener('mousemove', currentobj.mousemoveaction)
    })

    this.shadowRoot.querySelector('#myModal').addEventListener('click', event => {
      this.putwindowinfront()
      event.stopPropagation()
    })

    this.shadowRoot.querySelector('#top-bar').addEventListener('mouseup', event => {
      this.shadowRoot.querySelector('#top-bar').removeEventListener('mousemove', currentobj.mousemoveaction)
    })
    this.shadowRoot.querySelector('#top-bar').addEventListener('mouseout', event => {
      this.shadowRoot.querySelector('#top-bar').removeEventListener('mousemove', currentobj.mousemoveaction)
    })
  }

  static get observedAttributes () {
    return ['apptitle', 'appicon', 'tagname', 'name', 'width', 'height', 'jsfilename']
  }

  /**
   * @var this.apptitle The app title show in top bar of custom window
   * @var this.appicon The app icon show in top bar of custom window
   * @var this.tagname The custom element tag name of application
   * @var this.name This only use for the chat app
   * @var this.height The height of custom window
   * @var this.width The width of custom window
   */
  attributeChangedCallback (name, oldvalue, newvalue) {
    if (name === 'jsfilename') {
      this.jsfilename = newvalue
    }
    if (name === 'apptitle') {
      this.apptitle = newvalue
    }
    if (name === 'appicon') {
      this.appicon = newvalue
    }
    if (name === 'tagname') {
      this.tagname = newvalue
    }

    if (name === 'name') {
      this.name = newvalue
    }

    if (name === 'width') {
      this.style.width = newvalue
      this.shadowRoot.querySelector('#myModal').style.width = newvalue
      this.shadowRoot.querySelector('#modal-content').style.width = (parseInt(newvalue) - 10) + 'px'
    }

    if (name === 'height') {
      this.style.height = newvalue
      this.shadowRoot.querySelector('#myModal').style.height = newvalue
      this.shadowRoot.querySelector('#modal-content').style.height = (parseInt(newvalue) - 10) + 'px'
    }
  }
}

window.customElements.define('custom-window', customwindow)
