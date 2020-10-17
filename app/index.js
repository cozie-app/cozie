/*
This is the main function that handles the Cozie clock face on the FItbit.

Here we are importing the Fitbit APIs, external modules we have added and more.

The code below control which view needs to be shown to the participant.
*/

import document from "document";
import {user} from "user-profile";
import {vibration} from "haptics";
import {BodyPresenceSensor} from "body-presence";

// communication systems
import * as messaging from "messaging";
import * as fs from "fs";
import {inbox} from "file-transfer"

// import custom built modules
import {hrm, bodyPresence} from './sensors';
import {sendEventIfReady} from "./send";
import './clock'
import './buzz'

// import file containing question flow
import totalFlow from "../resources/flows/main-flow";

// question flow changes dynamically based on settings
let questionsFlow = totalFlow

// Import views
const clockface = document.getElementById("clockface");
const thankyou = document.getElementById("thankyou");
const svg_stop_survey = document.getElementById("stopSurvey");
const clockblock = document.getElementById("clockblock");

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

// main view that shows the buttons in the flow
const jsonFlow = document.getElementById("json-flow");

// Used to set all views to none when switching between screens
const allViews = [clockface, thankyou, clockblock, svg_stop_survey, jsonFlow];

let currentView = 0; //current view of flow
let feedbackData; // Global variable for handling feedbackData

let buttons = [
    {
        value: 10,
        obj: comfy,
        attribute: "startSurvey",
    },
    {
        value: 9,
        obj: notComfy,
        attribute: "startSurvey",
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

// show thank you message at the end of survey, add more info to message to be sent and send message
function endSurvey(reasonEnd) {
    // hiding all views to just show the clock
    allViews.map((v) => (v.style.display = "none"));
    clockface.style.display = "inline";

    //Find out how many seconds has passed to give response
    const endFeedback = new Date();
    const startFeedback = new Date(feedbackData['startFeedback']);
    feedbackData['responseSpeed'] = (endFeedback - startFeedback) / 1000.0;
    feedbackData['endFeedback'] = endFeedback.toISOString();

    if (reasonEnd === 'EndSurvey') {
        thankyou.style.display = "inline";

        // send feedback to companion
        sendEventIfReady(feedbackData);
    } else {
        svg_stop_survey.style.display = "inline";
    }

    feedbackData = {};

    setTimeout(() => {
        allViews.map(v => v.style.display = "none");
        clockface.style.display = "inline";
        currentView = 0
    }, 2000);

}

for (const button of buttons) {
    button.obj.addEventListener("click", () => {
        /** Constantly monitors if any buttons have been pressed */

        console.log(`${button.value} clicked`);

        // if any of the two buttons in the main view have been pressed initiate the loop through the selected
        if (button.attribute === 'startSurvey') {

            // Initiate feedbackData object
            feedbackData = {
                startFeedback: new Date().toISOString(),
                heartRate: hrm.heartRate,
            };

            if (BodyPresenceSensor) {
                try {
                    feedbackData['bodyPresence'] = bodyPresence.present;
                } catch (e) {
                    console.log("No body presence data");
                }
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
        } else if (button.attribute === 'flow_control') { // if any of the two buttons (back arrow or cross) have been selected

            if (button.value === "flow_back") {
                // decrease the value of currentView by 2 to go to previous view
                currentView--;
                currentView--;

                if (currentView < 0) {
                    // if user pressed back button in first question survey
                    endSurvey("StoppedSurvey");
                } else {
                    showFace(true);
                }
            } else if (button.value === "flow_stop") {
                // stop_flow button was pressed
                endSurvey("StoppedSurvey");
            }
        }

        if (button.attribute !== "flow_control") {
            if (button.attribute !== "startSurvey" && questionsFlow[currentView-1].name.indexOf("confirm") === -1) {
                console.log(currentView);
                //need to associate it to the previous view
                feedbackData[questionsFlow[currentView - 1].name] = button.value;
            }
            console.log(JSON.stringify(feedbackData));

            if (questionsFlow.length === currentView) {
                // if all the views have already been shown
                endSurvey("EndSurvey");
            } else {
                console.log("next question");
                showFace();
            }
        }
    });
}

function showFace(flowback = false, isFirst = false) {
    let skipQuestion = false;

    if(isFirst) {
        currentView=0;
    }

    // go through all views and set to none
    allViews.map((v) => {
        v.style.display = "none";
    });

    jsonFlow.style.display = "inline";

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
        document.getElementById("question-text").text = questionsFlow[currentView].questionText;
        document.getElementById("question-second-text").text = questionsFlow[currentView].questionSecondText;
        if (questionsFlow[currentView].name.indexOf("confirm")!==-1) {
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
        // move onto next flow
        currentView++;
    }

    // skipping question
    else if (skipQuestion === true) {
        // if we arrived here through the back button, then skip backwards
        if (flowback === true) {
            currentView--;
            showFace(true);
            // if we arrived here through the normal flow, skip forwards
        } else {
            currentView++;
            showFace();
        }
    }

    vibration.start("bump");
}

function getView() {
    return currentView;
}

// ------ Code to determine what questions are selected



let flowFileRead;
let flowFileWrite;
let flowSelector;

let flowSelectorUpdateTime = 0;

function mapFlows(flowSelector) {
    vibration.start("bump")
    questionsFlow = [];

    if (flowSelector) {
        flowSelector.map(index => {
            questionsFlow.push(totalFlow[index]);
        })
    }
    console.log(JSON.stringify(questionsFlow))
}

// retain selection incase the watch runs out of battery or crashes
try {
    flowFileRead = fs.readFileSync("flow.txt", "json");
    console.log(JSON.stringify(flowFileRead));
    console.log(JSON.stringify(flowFileRead.flowSelector));
    flowSelector = flowFileRead.flowSelector;
    if (flowSelector.length() > totalFlow.length()){
        flowSelector = []
    }
    mapFlows(flowSelector);
    console.log("flows loaded via file sync")
} catch (e) {
    console.log(e);
    console.log("resetting flows");
    flowSelector = []
}

// listen from any changes in the Settings
messaging.peerSocket.onmessage = function (evt) {
    console.log("settings received on device");
    console.log(JSON.stringify(evt));

    if (evt.data.key === 'flow_index') {
        flowSelector = evt.data.data;
        flowSelectorUpdateTime = evt.data.time;
        console.log("flow selector from peer socket is", flowSelector);
        mapFlows(flowSelector);
        //save flows locally in event of app rest
        flowFileWrite = {flowSelector: flowSelector};
        console.log(JSON.stringify(flowFileWrite));
        fs.writeFileSync("flow.txt", flowFileWrite, "json");
        console.log("flowSelector, files saved locally")
    } else if (evt.data.key === 'error') {
        console.log("error message called and displaying on watch");
        if (!isProduction) {
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
            if (fileData.key === 'flow_index') {
                flowSelector = fileData.data;
                mapFlows(flowSelector);
                console.log("settings updated via file transfer");

                //save flows locally in event of app rest
                flowFileWrite = {flowSelector: flowSelector};
                console.log(JSON.stringify(flowFileWrite));
                fs.writeFileSync("flow.txt", flowFileWrite, "json");
                console.log("files saved locally")
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

export default {getView, showFace};