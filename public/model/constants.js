export const COLLECTION = 'RPI_DATA';
export const ADC_DATA = 'ADC_DATA';
export const CAMERA_DATA = 'CAMERA_DATA';
export const BUTTON_DATA = 'BUTTON_DATA';
export const JOYSTICK_DATA = 'JOYSTICK_DATA';
export const ENVIRONMENT_DATA = 'ENVIRONMENT_DATA';
export const LIGHT_DATA = 'LIGHT_DATA'
export const LCD_DATA = 'LCD_DATA'

export const joystickData = {
 xVal: null,
}

export const lightData = {
  value: null,
  status: null,
}

export const environmentData = {
  humidity: null,
  tempC: null,
  tempF: null,
}

export const buttonData = {
  picButton: null,
  musicButton: false,
  arrowButton: false,
  waterButton: false,
  arrowVal: 0,
}

export const cameraData = {
  url: null,
  timestamp: null,
}

export const lcdData = {
  message: "",
}
