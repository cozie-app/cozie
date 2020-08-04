/*
The Cozie clock face offers the functionality of reminding participants
to complete the survey at predefined intervals with a short buzz.
The frequency at which participants are reminded to complete the survey
can be changed in the settings of the Cozie clock face in the Fitbit app,
the options that will be presented to the users are hardcoded below
"buzzOptions".

Every 10 minute the code check if it is time to buzz the Fitbit and if the
user change the vibration settings in the FItbit app.
*/

import {today} from "user-activity";
import * as messaging from "messaging";
import * as fs from "fs";
import {inbox} from "file-transfer"
import * as cbor from "cbor";
import document from "document";
import {vibration} from "haptics";

// import custom built modules
import {bodyPresence} from "./sensors";
import {isProduction} from "./options";
import Index from './index'

const errorLabel = document.getElementById("errorLabel");
const bodyErrorLabel = errorLabel.getElementById("copy");

// define what at what hour of the day each buzz option would buzz at
const buzzOptions = {
    0: [],
    1: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    2: [9, 11, 13, 15, 17, 19, 21],
    3: [9, 12, 15, 18, 21]
};

let buzzSelection = 2; // default value
let vibrationTimeArray = buzzOptions[buzzSelection];
let completedVibrationCycleDay = false; // keeps in memory weather the watch has vibrated at all hours
let startDay = new Date().getDay(); // get the day when the app started for the first time

// this function runs every ten minutes to ensure that the Fitbit buzzes when selected
setInterval(function () {
    const currentDate = new Date(); // get today's date
    const currentDay = currentDate.getDay(); // get today's day
    const currentHour = currentDate.getHours();

    try {
        const buzzSelection = parseInt(fs.readFileSync("buzzSelection.txt", "json").buzzSelection); // read user selection
        vibrationTimeArray = buzzOptions[buzzSelection];
    } catch (e) {
        console.log("Could not open the file buzzSelection.txt");
        console.log(e);
        if (!isProduction) {
            bodyErrorLabel.text = bodyErrorLabel.text + "Vibration : " + e;
        }
    }

    if (currentDay !== startDay) { // if it is a new day check user
        startDay = currentDay;
        completedVibrationCycleDay = false;
    }

    const maxHour = vibrationTimeArray.reduce(function (a, b) {
        return Math.max(a, b);
    });

    if (!completedVibrationCycleDay) {
        if (vibrationTimeArray[0] === currentHour && today.adjusted.steps > 300 && bodyPresence.present && Index.getView()===0) { // vibrate only if the time is right and the user has walked at least 300 steps and the watch is worn
            // this ensures that the watch does not vibrate if the user is still sleeping
            vibrate();
            const firstElement = vibrationTimeArray.shift();
            vibrationTimeArray.push(firstElement);
            if (currentHour === maxHour) {
                completedVibrationCycleDay = true;
            }
        } else if (vibrationTimeArray[0] < currentHour) {  // the vector is shifted by one since the that hour is already passed
            const firstElement = vibrationTimeArray.shift();
            vibrationTimeArray.push(firstElement);
        }
    }
}, 600000); // timeout for 10 minutes

//-------- READING EXPERIMENT QUESTIONS FROM PHONE SETTINGS -----------

let buzzFileWrite;

// listen from any changes in the Settings
messaging.peerSocket.onmessage = function (evt) {
    console.log("settings received on device");
    console.log(JSON.stringify(evt));

    if (evt.data.key === 'buzz_time') {
        buzzFileWrite = {buzzSelection: evt.data.data};
        console.log(evt.data.data);
        fs.writeFileSync("buzzSelection.txt", buzzFileWrite, "json");
        console.log("buzzSelection, files saved locally");
        buzzSelection = fs.readFileSync("buzzSelection.txt", "json").buzzSelection;
        console.log("Buzz Selection is", buzzSelection)
    } else if (evt.data.key === 'error') {
        console.log("error message called and displaying on watch");
        if (!isProduction) {
            bodyErrorLabel.text = "Socket : " + evt.data.data.type + evt.data.data.message;
        }
    }
    console.log("end message socket")
};

let flowSelectorUpdateTime = 0;

// receive message via inbox
function processAllFiles() {
    let fileName;
    while (fileName = inbox.nextFile()) {
        console.log(`/private/data/${fileName} is now available`);
        let fileData = fs.readFileSync(`${fileName}`, "cbor");
        console.log(JSON.stringify(fileData));
        console.log("settings received via file transfer");
        if (fileData.time > flowSelectorUpdateTime) {
            flowSelectorUpdateTime = fileData.time;
            if (fileData.key === 'buzz_time') {
                buzzSelection = fileData.data;
                console.log("buzz selection is", buzzSelection);
                buzzFileWrite = {buzzSelection: fileData.data};
                fs.writeFileSync("buzzSelection.txt", buzzFileWrite, "json");

            } else if (fileData.key === 'error') {
                console.log("error message called and displaying on watch");
                if (!isProduction) {
                    bodyErrorLabel.text = "Process files : " + fileData.data.type + ' ' + Date(fileData.time) + fileData.data.message;
                }
            }
        } else {
            console.log("settings already updated via peer socket")
        }
    }
}

inbox.addEventListener("newfile", processAllFiles);
processAllFiles();

function vibrate() {
    /**
     * It causes the watch to vibrate, and forces the start of the feedback.
     *
     * If there are no questions selected then it blocks the time until a response is given.
     * If there are questions in the flow, then it starts the flow
     */

    vibration.start("alert");
    Index.showFace(false, true);

    //Stop vibration after 2 seconds
    setTimeout(function () {
        vibration.stop()
    }, 2000);
}