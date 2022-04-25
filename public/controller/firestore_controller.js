import {
	getFirestore, onSnapshot, doc, setDoc, updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"

import * as Constants from '../model/constants.js'

const db = getFirestore()


export async function initFirestoreDocs() {
	await setDoc(doc(db, Constants.COLLECTION, Constants.CAMERA_DATA), Constants.cameraData)
	await setDoc(doc(db, Constants.COLLECTION, Constants.BUTTON_DATA), Constants.buttonData)
	await setDoc(doc(db, Constants.COLLECTION, Constants.JOYSTICK_DATA), Constants.joystickData)
	await setDoc(doc(db, Constants.COLLECTION, Constants.ENVIRONMENT_DATA), Constants.environmentData)
	await setDoc(doc(db, Constants.COLLECTION, Constants.LIGHT_DATA), Constants.lightData)
	await setDoc(doc(db, Constants.COLLECTION, Constants.LCD_DATA), Constants.lcdData)

}

export function attachRealtimeListener(collection, document, callback) {
	const unsubscribeListener = onSnapshot(doc(db, collection, document), callback);
	return unsubscribeListener;
}

export async function updateAdcData(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.ADC_DATA);
	await updateDoc(docRef, update);
}

export async function updateButtonData(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.BUTTON_DATA);
	await updateDoc(docRef, update);
}

export async function updateJoystickData(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.JOYSTICK_DATA);
	await updateDoc(docRef, update);

}

export async function updateEnvironmentData(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.ENVIRONMENT_DATA);
	await updateDoc(docRef, update);

}


