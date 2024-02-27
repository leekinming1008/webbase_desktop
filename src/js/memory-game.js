var template = document.createElement('template')
template.innerHTML = /* HTML */
`
<style>
.removed{
  visibility: hidden;
}

#memory-game-container{
  width:275px;
  height: 240px;
}

#gameboard{
  text-align: center;
  height: 175px;
}

#game-info{
  left: 5px;
  position: absolute;
  font-size: 11px;
  bottom: 49px;
}

#memory-game-option{
  right:30px;
  position: absolute;
  font-size: 11px;
  bottom: 30px;
}
</style>
<div id = 'memory-game-container'>
<div id = 'gameboard'>
</div>
<div id = 'game-info'>
<p id = 'timer'>Total Times: 0
<p id = 'turns'>Total Turns: 0
</div>
<div id = 'memory-game-option'>
The Game Board Size:<br>
<input type="radio" name="size"  boardwidth = 4 boardlong = 4 checked = 'true'>4 X 4<br>
<input type="radio" name="size"  boardwidth = 2 boardlong = 2>2 X 2<br>
<input type="radio" name="size"  boardwidth = 2 boardlong = 4>2 X 4
</div>
</div>
`
// this is the memory game class

class memorygame extends HTMLElement {
  constructor () {
    super()
    this.width = 4
    this.long = 4
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.totalnumberofphoto = 0
    this.photonumber = []
    this.temp = 0
    this.selectedid1 = null
    this.selectedid2 = null
    this.turns = 0
    this.pairdone = 0
    this.timer = 0
  }

  /**
   * Generate the rendom array for game
   * @var {array} this.photonumber store the place of the photo
   */
  generatenumberphoto () {
    this.photonumber = []

    // generate the array
    for (let i = 1; i <= (this.long * this.width) / 2; i++) {
      this.photonumber.push(i)
      this.photonumber.push(i)
    }

    // make the array random
    this.photonumber.sort(function (a, b) {
      return Math.floor(Math.random() * 3 - 1)
    })
  }

  /**
   * Generate the game board
   * @var shadowRootlocation short cut to get the path of #gameboard
   * @var long the height of game board
   */
  drawgameboard () {
    const shadowRootlocation = this.shadowRoot.querySelector('#gameboard')
    const long = this.long

    // add photo in to the screen
    this.photonumber.forEach(function (number, index) {
      const img = document.createElement('img')
      const a = document.createElement('a')
      a.setAttribute('href', '#')
      img.setAttribute('src', 'image/0.png')
      img.setAttribute('value', index)
      a.appendChild(img)
      shadowRootlocation.appendChild(a)

      // go to next row
      if ((index + 1) % long === 0) {
        shadowRootlocation.appendChild(document.createElement('br'))
      }
    })
  }

  /**
   * Check the user answer after he/she have turn two photos
   * @param {element} select1 the first turn of user
   * @param {element} select2 the second turn of user
   */
  checktheanswer (select1, select2) {
    if (this.photonumber[select1.getAttribute('value')] === this.photonumber[select2.getAttribute('value')]) {
      select1.parentNode.classList.add('removed')
      select2.parentNode.classList.add('removed')
      this.pairdone += 1
    } else {
      select1.setAttribute('src', 'image/0.png')
      select2.setAttribute('src', 'image/0.png')
    }
  }

  /**
   * Change the game board size. And reset the timer and total turns
   * @param {element} event eventlistener for #memory-game-option
   */
  checkgameboardsize (event) {
    if (event.target.tagName !== 'INPUT') { return }
    const radiolist = this.shadowRoot.querySelectorAll('input')
    const currentobj = this

    radiolist.forEach(function (detail) {
      if (detail.checked) {
        currentobj.long = detail.getAttribute('boardlong')
        currentobj.width = detail.getAttribute('boardwidth')
        currentobj.shadowRoot.querySelector('#gameboard').innerHTML = ''
        currentobj.generatenumberphoto()
        currentobj.drawgameboard()
        currentobj.timer = 0
        currentobj.shadowRoot.querySelector('#turns').textContent = 'Total Turns: ' + currentobj.turns
        currentobj.turns = 0
        currentobj.shadowRoot.querySelector('#turns').textContent = 'Total Turns: ' + currentobj.turns
        currentobj.pairdone = 0
      }
    })
  }

  /**
   * Add the timer to the game and add the event listener to #gameboard and #memory-game-option
   * Inside the #gameboard click event:
   * 1. Having the check of user turns
   * 2. Checking user is/is not win the game
   * 3. If the user win the game, it will restart the game after 1 second
   **/
  connectedCallback () {
    this.generatenumberphoto()
    this.drawgameboard()

    // Add the timer
    let totaltime = setInterval(() => {
      this.timer++
      this.shadowRoot.querySelector('#timer').textContent = 'Total Times: ' + this.timer
    }, 1000)

    this.shadowRoot.querySelector('#memory-game-option').addEventListener('click', (event) => {
      this.checkgameboardsize(event)
    })

    this.shadowRoot.querySelector('#gameboard').addEventListener('click', (event) => {
      if (this.selectedid2) { return }
      let userchoose = null
      if (event.target.tagName === 'IMG') {
        event.target.setAttribute('src', `image/${this.photonumber[event.target.getAttribute('value')]}.png`)
        userchoose = event.target
      }
      if (event.target.tagName === 'A') {
        event.target.firstElementChild.setAttribute('src', `image/${this.photonumber[event.target.firstElementChild.getAttribute('value')]}.png`)
        userchoose = event.target.firstElementChild
      }

      /**
       * check where the user is the first turn or second turn
       */
      if (this.selectedid1 === null) {
        this.selectedid1 = userchoose
      } else {
        if (userchoose === this.selectedid1) { return }// avoid user to choose same photo
        this.turns += 1
        this.shadowRoot.querySelector('#turns').textContent = 'Total Turns: ' + this.turns
        this.selectedid2 = userchoose

        // turn back the photo and check is that the user is win
        setTimeout(() => {
          this.checktheanswer(this.selectedid1, this.selectedid2)
          this.selectedid1 = null
          this.selectedid2 = null
          if (this.pairdone === (this.width * this.long) / 2) {
            clearInterval(totaltime)
            const winningstatment = document.createElement('p')
            winningstatment.textContent = 'Congratulation! You Win'
            this.shadowRoot.querySelector('#memory-game-option').appendChild(winningstatment)

            const startnewgame = setTimeout(() => {
              this.shadowRoot.querySelector('#gameboard').innerHTML = ''
              this.shadowRoot.querySelector('#memory-game-option').removeChild(this.shadowRoot.querySelector('#memory-game-option').lastElementChild)
              this.timer = 0
              this.turns = 0
              this.pairdone = 0
              this.shadowRoot.querySelector('#turns').textContent = 'Total Turns: ' + this.turns
              totaltime = setInterval(() => {
                this.timer++
                this.shadowRoot.querySelector('#timer').textContent = 'Total Times: ' + this.timer
              }, 1000)
              this.generatenumberphoto()
              this.drawgameboard()
              clearTimeout(startnewgame)
            }, 1000)
          }
        }, 300)
      }
    })
  }

  static get observedAttributes () {
    return ['long', 'width']
  }

  attributeChangedCallback (name, oldvalue, newvalue) {
    if (name === 'long') {
      this.long = newvalue
    }
    if (name === 'width') {
      this.width = newvalue
    }
  }
}

window.customElements.define('memory-board', memorygame)
