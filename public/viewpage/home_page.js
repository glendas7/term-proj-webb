import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import {
   updateButtonData, attachRealtimeListener, initFirestoreDocs,
} from '../controller/firestore_controller.js'

let cameraDoc, buttonDoc, servoDoc, loadImg, cameraButton, musicButton,
  rightButton, leftButton, waterButton, enviroDoc, lightsDoc, lcdDoc, value

export async function home_page() {
  if (!Auth.currentUser) {
    Elements.root.innerHTML = `
        <h3>Not Signed In</h3>
    `;
    return;
  }
  await initFirestoreDocs()
  loadImg = '../model/images/flower.gif'

  let html = '';
  html += `
  <br>
  <div class="humid-box">
    Humidity:
    <div class="humid-content" id="humid-content">no data</div>
  </div>
  <br>
  <div class="temp-box">
    Temp(Fahrenheit):
    <div class="tempF-content" id="tempF-content">no data</div>
    <br>
    Temp(Celsius):
    <div class="tempC-content" id="tempC-content">no data</div>
  </div>
  <br>
  <div class="light-box">
    Lights:
    <div class="light-content" id="light-content">no data</div>
  </div>
  <br>
  <div class="lcd-box">
    LCD Display Message:<br>
    <div class="lcd-content" id="lcd-content"></div>
  </div>
  <br>
  <br>
  <div>
    <button class="btn" id="left-button"> <----- </button>
    <button class="btn" id="water-button"> Dispense Water </button>
    <button class="btn" id="music-button">Play Music</button>
    <button class="btn" id="camera-button"> Take Picture </button>
    <button class="btn" id="right-button"> -----> </button>
  </div>
  <br>
  <div class="camera-img-box">
    <div id="image-timestamp"></div>
  </div>
  <br>
  <div class="camera-img-box">
    <img id="camera-img" src="../model/images/distortion.gif" width="700" height="500">
  </div>

  `;

  Elements.root.innerHTML = html;
  value = 0

  cameraDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.CAMERA_DATA, cameraListener);
  buttonDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.BUTTON_DATA, buttonListener);
  enviroDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.ENVIRONMENT_DATA, enviroListener);
  lightsDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.LIGHT_DATA, lightListener);
  lcdDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.LCD_DATA, lcdListener);
  servoDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.BUTTON_DATA, servoListener);

  cameraButton = document.getElementById('camera-button')
  cameraButton.addEventListener('click', e => {
    updateButtonData({ picButton: true });
    console.log("took pic")
  });

  musicButton = document.getElementById('music-button')
  musicButton.addEventListener('click', e => {
    if (musicButton.innerText == "Play Music") {
      console.log("playing music")
      updateButtonData({ musicButton: true});
      musicButton.innerText = "Stop Music"
    }
    else if (musicButton.innerText == "Stop Music") {
      console.log("stopping music")
      updateButtonData({ musicButton: false });
      musicButton.innerText = "Play Music"
    }
  });

  waterButton = document.getElementById('water-button')
  waterButton.addEventListener('click', e => {
    updateButtonData({ waterButton: true });
    setTimeout(() => {
      updateButtonData({ arrowButton: false });
    }, 8000); 
    updateButtonData({ arrowButton: false });
  });
    
  rightButton = document.getElementById('right-button')
  rightButton.addEventListener('click', e => {
    updateButtonData({ arrowButton: true });
    incrementRight()
    updateButtonData({ picButton: true });
  });

  leftButton = document.getElementById('left-button')
  leftButton.addEventListener('click', e => {
    updateButtonData({ arrowButton: true });
    incrementLeft()
    updateButtonData({ picButton: true });
  });
}

function incrementRight(){
  if (value == -1) {
    value = 0
    updateButtonData({ arrowVal: 0});
  }
  else if (value == 0) {
    value = 1
    updateButtonData({ arrowVal: 1 });
  }
}


function incrementLeft(){
  if (value == 0) {
    value = -1
    updateButtonData({ arrowVal: -1 });
  }
  else if (value == 1) {
    value = 0
    updateButtonData({ arrowVal: 0 });
  }
}


function cameraListener(doc) {
  cameraDoc = doc.data()
  if (cameraDoc['url'] == null) {
    document.getElementById('camera-img').src = loadImg
    document.getElementById('image-timestamp').innerText = "--"
  }
  else {
    document.getElementById('camera-img').src = cameraDoc['url']
    const timestamp = cameraDoc['timestamp'];
    document.getElementById('image-timestamp').innerText = new Date(timestamp / 1e6).toString();
  }
}

function buttonListener(doc) {
  buttonDoc = doc.data()
  if (buttonDoc['picButton']) {
    cameraButton.setAttribute("disabled", "")
    cameraButton.innerText = "Loading..."
  }
  else {
    cameraButton.removeAttribute('disabled')
    cameraButton.innerText = "Take Surveillance Picture"
  }
}

function enviroListener(doc) {
  enviroDoc = doc.data()
  if (enviroDoc['tempC']) {
    document.getElementById('tempC-content').innerText = enviroDoc['tempC']
  }
  if (enviroDoc['tempF']) {
    document.getElementById('tempF-content').innerText = enviroDoc['tempF']
  }
  if (enviroDoc['humidity']) {
    document.getElementById('humid-content').innerText = enviroDoc['humidity']
  }
}

function lightListener(doc) {
  lightsDoc = doc.data()
  if (lightsDoc['status']) {
    document.getElementById('light-content').innerText = lightsDoc['status']
  }
}

function lcdListener(doc) {
  lcdDoc = doc.data()
  if (lcdDoc['message']) {
    document.getElementById('lcd-content').innerText = lcdDoc['message']
  }
}

function servoListener(doc) {
  servoDoc = doc.data()
  if (servoDoc['arrowVal']) {
    value = servoDoc['arrowVal']    
  }
}




