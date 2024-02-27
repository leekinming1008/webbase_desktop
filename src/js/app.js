import './window.js'

// defind the PWD size
document.querySelector('#desktop').style.height = (document.documentElement.clientHeight - 50) + 'px'

/**
 *  add application icon into tools bar
 */

// add chat app icon to tools bar
var chatappopen = document.createElement('input')
chatappopen.setAttribute('type', 'image')
chatappopen.setAttribute('src', 'image/chaticonbar.png')
chatappopen.addEventListener('click', event => {
  const chatapp = document.createElement('custom-window')
  chatapp.setAttribute('jsfilename', 'chatapp')
  chatapp.setAttribute('apptitle', 'Chap App')
  chatapp.setAttribute('appicon', 'chaticon')
  chatapp.setAttribute('tagname', 'chat-app')
  chatapp.setAttribute('height', '300px')
  chatapp.setAttribute('width', '300px')
  chatapp.setAttribute('name', window.localStorage.getItem('chatname'))
  document.querySelector('#desktop').appendChild(chatapp)
})
document.querySelector('#toolsbars').appendChild(chatappopen)

// add memory game icon to tools bar
var memorygameopen = document.createElement('input')
memorygameopen.setAttribute('type', 'image')
memorygameopen.setAttribute('src', 'image/memorygamebar.png')
memorygameopen.addEventListener('click', event => {
  const memorygame = document.createElement('custom-window')
  memorygame.setAttribute('jsfilename', 'memory-game')
  memorygame.setAttribute('apptitle', 'memory-game')
  memorygame.setAttribute('appicon', 'memorygame')
  memorygame.setAttribute('tagname', 'memory-board')
  memorygame.setAttribute('height', '300px')
  memorygame.setAttribute('width', '300px')
  document.querySelector('#desktop').appendChild(memorygame)
})
document.querySelector('#toolsbars').appendChild(memorygameopen)

// add web cam icon to tools bar
var openwebcam = document.createElement('input')
openwebcam.setAttribute('type', 'image')
openwebcam.setAttribute('src', 'image/webcambar.png')
openwebcam.addEventListener('click', event => {
  const webcam = document.createElement('custom-window')
  webcam.setAttribute('jsfilename', 'webcam')
  webcam.setAttribute('apptitle', 'Video-taker')
  webcam.setAttribute('appicon', 'webcam')
  webcam.setAttribute('tagname', 'web-cam')
  webcam.setAttribute('height', '500px')
  webcam.setAttribute('width', '500px')
  document.querySelector('#desktop').appendChild(webcam)
})
document.querySelector('#toolsbars').appendChild(openwebcam)

// add setting icon to tools bar
var opensetting = document.createElement('input')
opensetting.setAttribute('type', 'image')
opensetting.setAttribute('src', 'image/settingbar.png')
opensetting.addEventListener('click', event => {
  const setting = document.createElement('custom-window')
  setting.setAttribute('jsfilename', 'settingchatname')
  setting.setAttribute('apptitle', 'setting')
  setting.setAttribute('appicon', 'setting')
  setting.setAttribute('tagname', 'setting-window')
  setting.setAttribute('height', '165px')
  setting.setAttribute('width', '300px')
  document.querySelector('#desktop').appendChild(setting)
})
document.querySelector('#toolsbars').appendChild(opensetting)

// add youtube player icon to tools bar
var openyoutube = document.createElement('input')
openyoutube.setAttribute('type', 'image')
openyoutube.setAttribute('src', 'image/youtubeplayerbar.png')
openyoutube.addEventListener('click', event => {
  const youtube = document.createElement('custom-window')
  youtube.setAttribute('jsfilename', 'youtubeplayer')
  youtube.setAttribute('apptitle', 'Youtube Player')
  youtube.setAttribute('appicon', 'youtubeplayer')
  youtube.setAttribute('tagname', 'youtube-player')
  youtube.setAttribute('height', '400px')
  youtube.setAttribute('width', '500px')
  document.querySelector('#desktop').appendChild(youtube)
})
document.querySelector('#toolsbars').appendChild(openyoutube)

// add time and date into tols bar
// const timedate = document.createTextNode('')
const timedate = document.createElement('input')
timedate.setAttribute('type', 'button')
timedate.setAttribute('id', 'datetime')
timedate.disabled = 'disabled'
document.querySelector('#toolsbars').appendChild(timedate)

setInterval(function () {
  const time = new Date()
  timedate.setAttribute('value', `Date: ${time.getFullYear()}-${time.getUTCMonth() + 1}-${time.getUTCDate()}  ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
}, 1000)
