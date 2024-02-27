var template = document.createElement('template')
template.innerHTML = /* HTML */
`
<style>
#container {
    margin: 0px;
    height: 440px;
    border: 10px #333 solid;
}
#videoElement {
    width: 100%;
    height: 100%;
    background-color: #666;
}
</style>
<div id="container">
<video autoplay="true" id="videoElement">
</video>
</div>
`

/**
 * this is the web cam class
 */

class webcam extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.reocrder = null
  }

  /**
   * Get access to web cam and start stream
   * @var video: get the video place
   */
  connectedCallback () {
    var video = this.shadowRoot.querySelector('#videoElement')

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream
        })
        .catch(function (err0r) {
          console.log('Something went wrong!')
        })
    }
  }

  /**
   * Turn off the web cam access
   * @var video: get the video place
   */
  disconnectedCallback () {
    var video = this.shadowRoot.querySelector('#videoElement')
    const stream = video.srcObject
    if (stream) {
      const tracks = stream.getTracks()
      for (let i = 0; i < tracks.length; i++) {
        var track = tracks[i]
        track.stop()
      }
    }
  }
}

window.customElements.define('web-cam', webcam)
