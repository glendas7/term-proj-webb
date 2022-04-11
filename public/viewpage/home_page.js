import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import {
   updateJoystickData, updateButtonData, attachRealtimeListener, initFirestoreDocs,
} from '../controller/firestore_controller.js'

let adcDoc, cameraDoc, joystickDoc, buttonDoc, loadImg, cameraButton

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
    <div class="tempF-content" id="tempF-content">no data</div>
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
  <br>
  <div>
    <button class="btn" id=""> <----- </button>
    <button class="btn" id=""> Dispense Water </button>
    <button class="btn" id="camera-button"> Take Picture </button>
    <button class="btn" id=""> --> </button>
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
 
  cameraDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.CAMERA_DATA, cameraListener);
  buttonDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.BUTTON_DATA, buttonListener);

  cameraButton = document.getElementById('camera-button')
  cameraButton.addEventListener('click', e => {
    updateButtonData({ picButton: true });
    console.log("took pic")
  });
}


function cameraListener(doc) {
  const cameraDoc = doc.data()
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
  const buttonDoc = doc.data()
  if (buttonDoc['picButton']) {
    cameraButton.setAttribute("disabled", "")
    cameraButton.innerText = "Loading..."
  }
  else {
    cameraButton.removeAttribute('disabled')
    cameraButton.innerText = "Take Surveillance Picture"
  }
}




