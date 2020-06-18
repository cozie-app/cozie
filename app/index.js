import document from "document";
import {today} from "user-activity";
import {user} from "user-profile";
import * as messaging from "messaging";
import {vibration} from "haptics";
import * as fs from "fs";
import {inbox} from "file-transfer"
import * as cbor from "cbor";
import {BodyPresenceSensor} from "body-presence";

import {hrm, bodyPresence} from './sensors';
import {buzzOptions, production} from "./options";
import {sendEventIfReady} from "./send";
import './clock'

import questionsFlow from "../resources/flows/dorn-flow";

// Get a handle on the <text> elements
const errorLabel = document.getElementById("errorLabel");
const bodyErrorLabel = errorLabel.getElementById("copy");

let buzzSelection = 2; // default value
let vibrationTimeArray = buzzOptions[buzzSelection];
let completedVibrationCycleDay = false; // keeps in memory weather the watch has vibrated at all hours
let startDay = new Date().getDay(); // get the day when the app started for the first time

setInterval(function () {
    const currentDate = new Date(); // get today's date
    const currentDay = currentDate.getDay(); // get today's day
    const currentHour = currentDate.getHours();

    try {
        const buzzSelection = parseInt(fs.readFileSync("buzzSelection.txt", "json").buzzSelection); // read user selection
        vibrationTimeArray = buzzOptions[buzzSelection];
    } catch (e) {
        console.log(e);
        if (!production) {
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
        if (vibrationTimeArray[0] === currentHour && today.adjusted.steps > 300 && bodyPresence.present) { // vibrate only if the time is right and the user has walked at least 300 steps and the watch is worn
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

console.log("WARNING!! APP HAS RESET");
//Flow GUIs
const clockface = document.getElementById("clockface");
//Clock manipulation guis
const thankyou = document.getElementById("thankyou");
const svg_stop_survey = document.getElementById("stopSurvey");
const clockblock = document.getElementById("clockblock");

const jsonFlow = document.getElementById("json-flow");
// const jsonFlowNumerical = document.getElementById("json-flow-numerical");

// Used to set all views to none when switching between screens
const allViews = [clockface, thankyou, clockblock, svg_stop_survey, jsonFlow];
let flowSelectorUpdateTime = 0;

let buzzFileWrite;

// receive message via peer socket
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
        if (!production) {
            bodyErrorLabel.text = "Socket : " + evt.data.data.type + evt.data.data.message;
        }
    }
    console.log("end message socket")
};

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
                if (!production) {
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

//-------- END (READING EXPERIMENT QUESTIONS FROM PHONE SETTINGS) -----------

//-------- DEFINE VIEWS AND DATA COLLECTION BASED ON FLOW SELECTOR -----------

let currentView = 0; //current view of flow

// home screen buttons
const comfy = document.getElementById("comfy");
const notComfy = document.getElementById("not-comfy");

// flow buttons
const flow_back = document.getElementById("flow_back");
const flow_stop = document.getElementById("flow_stop");

// flow buttons json
const centerButton = document.getElementById("new-button-center");
const rightButton = document.getElementById("new-button-right");
const leftButton = document.getElementById("new-button-left");

function showThankYou() {
    allViews.map((v) => (v.style.display = "none"));

    clockface.style.display = "inline";
    thankyou.style.display = "inline";

    //Find out how many seconds has passed to give response
    const endFeedback = new Date();
    const startFeedback = new Date(feedbackData['startFeedback']);
    feedbackData['responseSpeed'] = (endFeedback - startFeedback) / 1000.0;
    feedbackData['endFeedback'] = endFeedback.toISOString();
    if (BodyPresenceSensor) {
        feedbackData['bodyPresence'] = bodyPresence.present;
    }

    try {
        feedbackData['restingHR'] = user.restingHeartRate;
    } catch (e) {
        console.log("No resting heart rate data available");
    }

    try {
        feedbackData['BMR'] = user.bmr;
    } catch (e) {
        console.log("No resting basal metabolic rate data available");
    }

    //send feedback to companion
    sendEventIfReady(feedbackData);
    feedbackData = {};
    setTimeout(() => {
        showClock()
    }, 2000);
    currentView = 0
}

function showMessageStopSurvey() {
    allViews.map((v) => (v.style.display = "none"));

    // highlight all the icons corresponding to the questions selected in the fitbit app
    clockface.style.display = "inline";
    svg_stop_survey.style.display = "inline";

    //clear feedback data recorded
    feedbackData = {};
    setTimeout(() => {
        showClock()
    }, 2000);
}

function showClock() {
    allViews.map(v => v.style.display = "none");
    clockface.style.display = "inline";
    currentView = 0
}

let feedbackData; // Global variable for handling feedbackData

function initiateFeedbackData() {
    // Initiating feedback data
    const startFeedback = new Date().toISOString();
    // Initiate feedbackData object
    feedbackData = {
        startFeedback,
        heartRate: hrm.heartRate,
    };
}

let buttons = [
    {
        value: 10,
        obj: comfy,
        attribute: "comfort",
    },
    {
        value: 9,
        obj: notComfy,
        attribute: "comfort",
    },
    {
        value: "flow_back",
        obj: flow_back,
        attribute: "flow_control",
    },
    {
        value: "flow_stop",
        obj: flow_stop,
        attribute: "flow_control",
    },
    {
        value: 9,
        obj: centerButton,
        attribute: "question",
    },
    {
        value: 10,
        obj: rightButton,
        attribute: "question",
    },
    {
        value: 11,
        obj: leftButton,
        attribute: "question",
    },
];

for (const button of buttons) {
    button.obj.addEventListener("click", () => {
        /** Constantly monitors if any buttons have been pressed */
        // init data object on first view click
        if (button.attribute === 'comfort') {
            // if any of the two buttons in the main view have been pressed initiate the loop through the selected

            initiateFeedbackData();
        } else if (button.attribute === 'flow_control') {
            // if any of the two buttons (back arrow or cross) have been selected
            if (button.value === "flow_back") {
                // decrease the value of currentView by 2 to go to previous view
                currentView--;
                currentView--;
                if (currentView < 0) {
                    // if user pressed back button in first question survey
                    showMessageStopSurvey();
                } else {
                    // show previous view with flowback set to true
                    let flowback;
                    showFace((flowback = true));
                }
            } else if (button.value === "flow_stop") {
                // stop_flow button was pressed
                showMessageStopSurvey();
            }
        }

        console.log(`${button.value} clicked`);

        if (button.attribute !== "flow_control") {
            if (button.attribute !== "comfort" && questionsFlow[currentView-1].name.indexOf("confirm") === -1) {
                console.log(currentView);
                //need to associate it to the prevous view
                feedbackData[questionsFlow[currentView - 1].name] = button.value;
            }
            console.log(JSON.stringify(feedbackData));

            if (questionsFlow.length === currentView) {
                console.log("all covid flow done, showing thankyou");
                // if all the views have already been shown
                showThankYou();
            } else {
                console.log("next question");

                showFace();
            }
        }
    });
}

function showFace(flowback = false) {
    let skipQuestion = false;

    // go through all views and set to none
    allViews.map((v) => {
        v.style.display = "none";
    });

    // check if numerical input is required and set Flow
    if (questionsFlow[currentView].type === "numerical") {
        jsonFlowNumerical.style.display = "inline";
    } else {
        jsonFlow.style.display = "inline";
    }


    //Does current flow have any requirements?
    if (questionsFlow[currentView].requiresAnswer.length !== 0) {
        //if so, see if the current feedback meets those requirements
        questionsFlow[currentView].requiresAnswer.map((req) => {
            if (feedbackData[req.question] !== req.value) {
                //requirements not met, skipping question
                skipQuestion = true;
            }
        });
    }

    if (skipQuestion === false) {
        // Set title of question

        if (questionsFlow[currentView].type === "numerical") {
            document.getElementById("question-text-numerical").text = questionsFlow[currentView].questionText;
            document.getElementById("question-second-text-numerical").text = questionsFlow[currentView].questionSecondText;

            let list = document.getElementById("tile-list");
            let items = list.getElementsByClassName("tile-list-item");

            items.forEach((element, index) => {
                element.text = questionsFlow[currentView].iconText[index];
                let touch = element.getElementById("tile-list-item-hitbox");
                touch.onclick = (evt) => {
                    console.log(`${index} clicked`);
                    feedbackData[questionsFlow[currentView-1].name] = questionsFlow[currentView-1].iconText[index];
                    // make sure confirm loads correctly
                    questionsFlow[currentView].requiresAnswer[0].value = questionsFlow[currentView-1].iconText[index];
                    console.log(JSON.stringify(feedbackData));
                    showFace()
                }
            });

        } else {
            document.getElementById("question-text").text = questionsFlow[currentView].questionText;
            document.getElementById("question-second-text").text = questionsFlow[currentView].questionSecondText;
            if(questionsFlow[currentView].name.indexOf("confirm")!=-1) {
                document.getElementById("question-text").text = questionsFlow[currentView].questionText.replace("xxxx",feedbackData[questionsFlow[currentView-1].name]);
            }
            // set buttons
            const buttonLocations = ["left", "right", "center"];
            // hide all buttons
            buttonLocations.forEach((location) => {
                document.getElementById("new-button-" + location).style.display =
                    "none";
            });

            // map through each text element in flow and map to button
            questionsFlow[currentView].iconText.forEach((text, ii) => {
                // first show the button
                document.getElementById(
                    "new-button-" + buttonLocations[ii]
                ).style.display = "inline";

                // then map the circle color, image, and text
                document.getElementById(
                    "circle-" + buttonLocations[ii]
                ).style.fill = questionsFlow[currentView].iconColors[ii];
                document.getElementById("image-" + buttonLocations[ii]).href =
                    questionsFlow[currentView].iconImages[ii];
                document.getElementById("button-text-" + buttonLocations[ii]).text =
                    questionsFlow[currentView].iconText[ii];
            });
        }
        // move onto next flow
        currentView++;
    }

    // skipping question
    else if (skipQuestion === true) {
        // if we arrived here through the back button, then skip backwards
        if (flowback === true) {
            currentView--;
            showFace((flowback = true));
            // if we arrived here through the normal flow, skip forwards
        } else {
            currentView++;
            showFace();
        }
    }

    vibration.start("bump");
}

//-------- END (DEFINE VIEWS BASED ON FLOW SELECTOR) -----------


