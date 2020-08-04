/*
This code queries data from Fitbit APIs, in particular here we are
requesting HR, and body presence data.
*/

import {HeartRateSensor} from "heart-rate";
import {user} from "user-profile";
import document from "document";
import {BodyPresenceSensor} from "body-presence";

// HR sensor
const hrLabel = document.getElementById("hrm");  // get tag label
hrLabel.text = "--";

export const hrm = new HeartRateSensor();

hrm.onreading = function () {
    // Peek the current sensor values
    // console.log("Current heart rate: " + hrm.heartRate);
    try {
        hrLabel.text = `${hrm.heartRate}`;
        if (user.heartRateZone(hrm.heartRate) === 'fat-burn') {
            hrLabel.style.fill = 'fb-peach'; //yelow
        } else if (user.heartRateZone(hrm.heartRate) === 'cardio') {
            hrLabel.style.fill = 'fb-orange'; //light red
        } else if (user.heartRateZone(hrm.heartRate) === 'peak') {
            hrLabel.style.fill = 'fb-red'; //pink
        } else if (user.heartRateZone(hrm.heartRate) === 'out-of-range') {
            hrLabel.style.fill = 'fb-green'; //blue
        }
    } catch (e) {
        console.log("Heart rate reading error: " + e);
    }

};

// Begin monitoring the sensor
hrm.start();

// Body Presence sensor, log body presence if sensor is available
export const bodyPresence = new BodyPresenceSensor();

if (BodyPresenceSensor) {
    console.log("This device has a BodyPresenceSensor!");
    bodyPresence.addEventListener("reading", () => {
        console.log(`The device is ${bodyPresence.present ? '' : 'not'} on the user's body.`);
    });
    bodyPresence.start();
} else {
    console.log("This device does NOT have a BodyPresenceSensor!");
}