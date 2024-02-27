const template = document.createElement('template')
template.innerHTML = /* HTML */
`
<style>
#search-bar{
    position: relative;
    top: 5px;
    height: 30px;
    text-align: center;
}

#search-bar input{
    width:40%;
}

#youtubeplayer{
  width: 485px;
  height: 325px;
}
</style>
<div id = 'web-browser'>
<div id = 'search-bar'>
Please input the Youtube Video id: <input type = 'text' id = 'videoid'>
</div>
<div id = 'web-page-container'>
<iframe id = 'youtubeplayer' src = 'https://www.youtube.com/embed/rRydvtibc-U'></ifream>
<div>
</div>
`
// the youtube player class

class youtubeplayer extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.url = 'https://www.youtube.com/embed/'
  }

  /**
  * Add event listener to user press "Enter"
  * If yes, chack the youtube video src
  */
  connectedCallback () {
    const currentobj = this

    this.shadowRoot.querySelector('#search-bar').addEventListener('keypress', async (event) => {
      if (event.which === 13 && event.keyCode === 13) {
        // console.log('I press enter')
        currentobj.shadowRoot.querySelector('#youtubeplayer').setAttribute('src', `${this.url}${currentobj.shadowRoot.querySelector('#videoid').value}`)
      }
    })
  }
}

window.customElements.define('youtube-player', youtubeplayer)
