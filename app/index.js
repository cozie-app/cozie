/*
This is the main function that handles the Cozie clock face on the FItbit.

Here we are importing the Fitbit APIs, external modules we have added and more.

The code below control which view needs to be shown to the participant.
*/

import document from "document";
import {
    today
} from "user-activity";
import {
    user
} from "user-profile";
import {
    vibration
} from "haptics";
import {
    BodyPresenceSensor
} from "body-presence";

// communication systems
import * as messaging from "messaging";
import * as fs from "fs";
import {
    inbox
} from "file-transfer"
import * as cbor from "cbor";

// import custom built modules
import {
    hrm,
    bodyPresence
} from './sensors';
import {
    sendEventIfReady
} from "./send";
import {
    isProduction
} from "./options";
import './clock';

import totalFlow from "../resources/flows/main-flow";

/* -----------------------------------------------------------------------------------------------
                                    GLOBAL VARIABLES DECLARATION
----------------------------------------------------------------------------------------------- */

// Question flow's array
let questionsFlow = totalFlow

// Useful views
const clockface = document.getElementById("clockface");
const thankyou = document.getElementById("thankyou");
const svg_stop_survey = document.getElementById("stopSurvey");
const clockblock = document.getElementById("clockblock");

// Home screen buttons
const comfy = document.getElementById("comfy");
const notComfy = document.getElementById("not-comfy");

// Navigation buttons
const flowBack = document.getElementById("flow_back");
const flowStop = document.getElementById("flow_stop");

// 2-answers' questions buttons
let rightButton2 = document.getElementById("new-button-right2");
let leftButton2 = document.getElementById("new-button-left2");

// 3-answers' questions buttons
let centerButton3 = document.getElementById("new-button-center3");
let rightButton3 = document.getElementById("new-button-right3");
let leftButton3 = document.getElementById("new-button-left3");

// 4-answers' questions buttons
let centerButton4 = document.getElementById("new-button-center4");
let rightButton4 = document.getElementById("new-button-right4");
let leftButton4 = document.getElementById("new-button-left4");
let bottomButton4 = document.getElementById("new-button-bottom4");

// Main view that shows the buttons in the flow
const jsonFlow2 = document.getElementById("json-flow2"); // 2-answers' questions view
const jsonFlow = document.getElementById("json-flow");   // 3-answers' questions view
const jsonFlow4 = document.getElementById("json-flow4"); // 4-answers' questions view

// Array containing all buttons
let allButtons = [{
    value: 10,
    obj: comfy,
    attribute: "startSurvey",
}, {
    value: 9,
    obj: notComfy,
    attribute: "startSurvey",
},
{
    value: "flowBack",
    obj: flowBack,
    attribute: "flowControl",
}, {
    value: "flowStop",
    obj: flowStop,
    attribute: "flowControl",
}, {
    value: 9,
    obj: centerButton3,
    attribute: "question",
}, {
    value: 10,
    obj: rightButton3,
    attribute: "question",
}, {
    value: 11,
    obj: leftButton3,
    attribute: "question",
}, {
    value: 10,
    obj: rightButton2,
    attribute: "question",
}, {
    value: 11,
    obj: leftButton2,
    attribute: "question",
}, {
    value: 9,
    obj: centerButton4,
    attribute: "question",
}, {
    value: 10,
    obj: rightButton4,
    attribute: "question",
}, {
    value: 11,
    obj: leftButton4,
    attribute: "question",
}, {
    value: 12,
    obj: bottomButton4,
    attribute: "question",
}, ];

// Array containing all the views
let viewsArray = [{
    viewAttribute: "clockface",
    viewObj: clockface,
    viewQuestion: null
},
{
    viewAttribute: "thankyou",
    viewObj: thankyou,
    viewQuestion: null
},
{
    viewAttribute: "clockblock",
    viewObj: clockblock,
    viewQuestion: null
},
{
    viewAttribute: "svg_stop_survey",
    viewObj: svg_stop_survey,
    viewQuestion: null
}];

/* -----------------------------------------------------------------------------------------------
                                        INITIALIZATIONS
----------------------------------------------------------------------------------------------- */
console.log('------ Initialization started ------');

for (let index = 0; index < questionsFlow.length; index++)
{
    viewsArray.push(jsonQuestionToView(questionsFlow, index));
}

let feedbackData;                        // Global variable gathering all data to feed back
let nextView;                            // Temp for the next view to be shown
let viewsStack = [];                     // Initialization of the stack
viewsStack = initStack(viewsStack);

console.log('------ Initialization ended ------');
/* -----------------------------------------------------------------------------------------------
                                          MAIN PROCESS
----------------------------------------------------------------------------------------------- */
console.log('------ Main process started ------');

// Show clockface
viewDisplay(viewsArray[0]);

// Assign action on every button, taking into account the state of the stack and the button's attribute
for (const button of allButtons)
{
    button.obj.addEventListener('mousedown', () => {
        switch (button.attribute)
        {
            case 'startSurvey':
                getDataFromSensors();
                viewsStack.push(viewsArray[4]); // Start the survey by the first question
                break;
            case 'flowControl':
                if (button.value === 'flowBack' && viewsStack.length > 2)
                    viewsStack.pop(); // Go back to the last view
                else
                {
                    viewsStack = initStack(viewsStack); // Go back to the clockface after stopping the survey
                    feedbackData = {};
                }
                break;
            case 'question':
                feedbackData[viewsStack[viewsStack.length - 1].viewQuestion.name] = button.value; // Pushing the answer in the feedback data object
                nextView = getNextview(button, viewsStack[viewsStack.length - 1], viewsArray);    // Get the next question
                if (nextView.viewAttribute === 'thankyou')
                {
                    getDataEndSurvey();
                    sendEventIfReady(feedbackData);
                    feedbackData = {};
                }
                viewsStack.push(nextView);
                break;
            default:
                break;
        }
        // Display the top view of the stack
        viewDisplay(viewsStack[viewsStack.length - 1]);
    });
}

console.log('------ Main process ended ------');
/* -------------------------------------------------------------------------------------
    Name        : initStack
    Description : initialize the stack of views with the clockface and the clockblock.
    Parameters  :
        - stack     : stack to initialize
    Return      : initialized stack.
------------------------------------------------------------------------------------- */

function initStack(stack)
{
    stack = [];
    stack.push(viewsArray[0]);
    stack.push(viewsArray[3]);
    return stack;
}

/* -------------------------------------------------------------------------------------
    Name        : jsonQuestionToView
    Description : convert the <indexView>th question from the question flow to a view
                  object.
    Parameters  :
        - flow      : question flow
        - indexView : index of the question
    Return      : view created thanks to a question in the question flow.
------------------------------------------------------------------------------------- */

function jsonQuestionToView(flow, indexView)
{
    let returnedView = {
        viewAttribute: "question",
        viewObj: null,
        viewQuestion: flow[indexView]
    }
    switch (flow[indexView].iconText.length)
    {
        case 2:
            returnedView.viewObj = jsonFlow2;
            break;
        case 3:
            returnedView.viewObj = jsonFlow;
            break;
        case 4:
            returnedView.viewObj = jsonFlow4;
            break;
        default:
            break;
    }
    return returnedView;
}

/* -------------------------------------------------------------------------------------
    Name        : getNextview
    Description : get the next view to be shown after <button> has been pressed.
    Parameters  :
        - button      : button pressed
        - view        : view including the button that has been pressed
        - views       : array gathering all views of the question flow
    Return      : view corresponding to the next view that has to be shown. If it is
                  the end of the question flow, view will correspond to the thankyou
                  view.
------------------------------------------------------------------------------------- */

function getNextview(button, view, views)
{
    let returned_view = views[1];
    let index = 4;
    while (index < views.length && view.viewQuestion.answerDirectTo[button.value].next !== views[index].viewQuestion.name)
    {
        index++;
    }
    if (index != views.length)
        returned_view = views[index];
    return returned_view;
}

/* -------------------------------------------------------------------------------------
    Name        : getDataFromSensors
    Description : get data from the sensors at the beginning of the survey
    Parameters  :
        none
    Return      : none
------------------------------------------------------------------------------------- */

function getDataFromSensors() {
    feedbackData = {
        startFeedback: new Date().toISOString(),
        heartRate: hrm.heartRate,
    };
    // Body presence
    if (BodyPresenceSensor) {
        try {
            feedbackData['bodyPresence'] = bodyPresence.present;
        } catch (e) {
            console.log("No body presence data");
        }
    }
    // Heart rate
    try {
        feedbackData['restingHR'] = user.restingHeartRate;
    } catch (e) {
        console.log("No resting heart rate data available");
    }
    // Basal metabolic rate
    try {
        feedbackData['BMR'] = user.bmr;
    } catch (e) {
        console.log("No resting basal metabolic rate data available");
    }
}

/* -------------------------------------------------------------------------------------
    Name        : getDataEndSurvey
    Description : get data from the sensors at the end of the survey and compute the
                  survey duration.
    Parameters  :
        none
    Return      : none
------------------------------------------------------------------------------------- */

function getDataEndSurvey() {
    const endFeedback = new Date();
    const startFeedback = new Date(feedbackData['startFeedback']);
    feedbackData['responseSpeed'] = (endFeedback - startFeedback) / 1000.0;
    feedbackData['endFeedback'] = endFeedback.toISOString();
}

/* -------------------------------------------------------------------------------------
    Name        : returnButtonLocations
    Description : get the location of the buttons according to the number of answers 
                  in a question.
    Parameters  :
        - len_buttons      : number of answers in a question
    Return      : object gathering the position of each button on the screen
------------------------------------------------------------------------------------- */

function returnButtonLocations(len_buttons) {
    switch (len_buttons)
    {
        case 2:
            return {
                "left": {
                    "cx": "25%",
                    "cy": "70%"
                },
                "right": {
                    "cx": "75%",
                    "cy": "70%"
                }
            }
            break;
        case 3:
            return {
                "left": {
                    "cx": "30%",
                    "cy": "70%"
                },
                "right": {
                    "cx": "75%",
                    "cy": "70%"
                },
                "center": {
                    "cx": "50%",
                    "cy": "36%"
                }
            }
            break;
        case 4:
            return {
                "left": {
                    "cx": "25%",
                    "cy": "50%"
                },
                "right": {
                    "cx": "75%",
                    "cy": "50%"
                },
                "center": {
                    "cx": "50%",
                    "cy": "30%"
                },
                "bottom": {
                    "cx": "50%",
                    "cy": "60%"
                },
    
            }
            break;
        default:
            break;
    }
}

/* -------------------------------------------------------------------------------------
    Name        : hideAllButtons
    Description : hide all buttons.
    Parameters  :
        none
    Return      : none
------------------------------------------------------------------------------------- */

function hideAllButtons() {
    for (const button of allButtons)
    {
        if (button.attribute === 'question')
            button.obj.style.display = 'none';
    }
}

/* -------------------------------------------------------------------------------------
    Name        : hideAllViews
    Description : hide all views.
    Parameters  :
        none
    Return      : none
------------------------------------------------------------------------------------- */

function hideAllViews() {
    for (const view of viewsArray)
    {
        view.viewObj.style.display = 'none';
    }
}

/* -------------------------------------------------------------------------------------
    Name        : viewDisplay
    Description : display all the objects that must be shown if we want to display
                  the view <view>. This function takes into account the type of the
                  view.
    Parameters  :
        - view      : view that has to be shown
    Return      : none
------------------------------------------------------------------------------------- */

function viewDisplay(view)
{
    hideAllViews();

    switch (view.viewAttribute)
    {
        case 'clockface':
            viewsArray[0].viewObj.style.display = 'inline';
            console.log("---> Displayed clockface");
            break;
        case 'thankyou':
            // Display thank you for 2s
            viewsArray[0].viewObj.style.display = 'inline';
            viewsArray[1].viewObj.style.display = 'inline';
            console.log("---> Displayed thank you");
            // Display clockface
            setTimeout( () => {
                viewDisplay(viewsArray[0]);
            }, 2000);
            break;
        case 'svg_stop_survey':
            // Display stop survey for 2s
            viewsArray[0].viewObj.style.display = 'inline';
            viewsArray[3].viewObj.style.display = 'inline';
            console.log("---> Displayed survey stopped");
            // Display clockface
            setTimeout( () => {
                viewDisplay(viewsArray[0]);
            }, 2000);
            break;
        case 'question':
            const questionLength = view.viewQuestion.iconText.length;
            let allButtonLocations = ["left", "right", "center", "bottom"];

            view.viewObj.style.display = "inline";
            document.getElementById("question-text" + questionLength.toString()).text = view.viewQuestion.questionText;
            document.getElementById("question-second-text" + questionLength.toString()).text = view.viewQuestion.questionSecondText;
            console.log("---> Displayed text question");
            
            const objectsLocation = returnButtonLocations(questionLength);
            const buttonsLocations = Object.keys(objectsLocation);
            // Hide all buttons
            hideAllButtons();
            console.log("---> Hidden all buttons");
            // Display needed buttons
            view.viewQuestion.iconText.forEach((text, index) => {
                // Show button
                document.getElementById("new-button-" + buttonsLocations[index] + questionLength.toString()).style.display = "inline";
                // Show circle
                document.getElementById("circle-" + buttonsLocations[index] + questionLength.toString()).style.fill = view.viewQuestion.iconColors[index];
                // Show image
                document.getElementById("image-" + buttonsLocations[index] + questionLength.toString()).href = view.viewQuestion.iconImages[index];
                // Show text
                document.getElementById("button-text-" + buttonsLocations[index] + questionLength.toString()).text = view.viewQuestion.iconText[index];
            });
            console.log("---> Displayed needed buttons");
            break;
        default:
            break;
    }
    vibration.start("bump");
}

/* -------------------------------------------------------------------------------------
    Name        : refreshViews
    Description : refresh the views to be shown according to the settings (Depending on
                  the version of your cozie and your question flow, this function might
                  not be used).
    Parameters  :
        none
    Return      : none
------------------------------------------------------------------------------------- */

function refreshViews() {
    let settingsStored = false;
    try
    {
        flowFileRead = fs.readFileSync("flow.txt", "json");
        flowSelector = flowFileRead.flowSelector;
        settingsStored = true;
    }
    catch (e)
    {
        console.log('/!\\ ERROR:' + e);
        settingsStored = false;
    }

    viewsArray = [];
    for (let index = 0; index < questionsFlow.length; index++)
    {
        console.log('Flow selector value :' + flowSelector[index]);
        if (flowSelector[index])
        {
            viewsArray.push(jsonQuestionToView(questionsFlow, index));
        }
    }
}

// ------- BUZZ SELECTOR -------------------

const errorLabel = document.getElementById("errorLabel");
const bodyErrorLabel = errorLabel.getElementById("copy");

// define what at what hour of the day each buzz option would buzz at
const buzzOptions = {
    0: [],
    1: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    2: [9, 11, 13, 15, 17, 19],
    3: [9, 12, 15, 18]
};

let buzzSelection = 1; // default value
let vibrationTimeArray = buzzOptions[buzzSelection];

// Shift the array to the next vibration hour
const currentDate = new Date();
const currentHour = currentDate.getHours();
let testedHoursNumber = 0;
while (vibrationTimeArray[0] <= currentHour && testedHoursNumber < vibrationTimeArray.length)
{
    // this remove the first hour of the array and push it to the end
    console.log("Hour tested: " + vibrationTimeArray[0]);
    const firstElement = vibrationTimeArray.shift();
    vibrationTimeArray.push(firstElement);
    testedHoursNumber++;
}

// Reminder test (this function runs every 5 min)
setInterval(function() {
    const currentDate = new Date(); // get today's date
    const currentHour = currentDate.getHours();

    console.log("Starting to evaluate whether the watch need to vibrate or not");
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

    if (vibrationTimeArray.length != 0) {
        const maxHour = vibrationTimeArray.reduce(function(a, b) {
            return Math.max(a, b);
        });
    } else {
        const maxHour = 0
    }

    if (testedHoursNumber != vibrationTimeArray.length)
    {
        console.log("Next hour of vibration : " + vibrationTimeArray[0]);
        if (vibrationTimeArray[0] == currentHour) {
            if (bodyPresence.present) { // REMOVED : && today.adjusted.steps > 300 -- vibrate only if the time is right and the user has walked at least 300 steps and the watch is worn
                // this ensures that the watch does not vibrate if the user is still sleeping
                console.log("The watch should vibrate");
                vibrate();
            }
            const firstElement = vibrationTimeArray.shift();
            vibrationTimeArray.push(firstElement);
        }
    }
    console.log("Buzz variables: currentHour = " + currentHour + ", vibrationTimeArray[0] = " + vibrationTimeArray[0] + ", testedHoursNumber = " + testedHoursNumber);
}, 300000); // timeout for 5 minutes


/* -------------------------------------------------------------------------------------
    Name        : vibrate
    Description : trigger a 2 seconds vibration on the watch and switch on the screen.
    Parameters  :
        none
    Return      : none
------------------------------------------------------------------------------------- */

function vibrate() {
    vibration.start("alert");
    viewDisplay(viewsArray[0]);
    viewsStack = initStack(viewsStack);
    //Stop vibration after 2 seconds
    setTimeout(function() {
        vibration.stop()
    }, 2000);
}

//-------- READING EXPERIMENT QUESTIONS FROM PHONE SETTINGS -----------

let buzzFileWrite;
let flowSelectorUpdateTime = 0;

let flowFileRead;
let flowFileWrite;
let flowSelector;

function mapFlows(flowSelector) {
    vibration.start("bump")
    questionsFlow = [];

    if (flowSelector) {
        flowSelector.map(index => {
            questionsFlow.push(totalFlow[index]);
        })
    }
}

// retain selection incase the watch runs out of battery or crashes
try {
    flowFileRead = fs.readFileSync("flow.txt", "json");
    console.log(JSON.stringify(flowFileRead));
    console.log(JSON.stringify(flowFileRead.flowSelector));
    flowSelector = flowFileRead.flowSelector;
    // if the flow-json has changed and is smaller
    if (flowSelector.length() > totalFlow.length()) {
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
messaging.peerSocket.onmessage = function(evt) {
    console.log("settings received on device");
    console.log(JSON.stringify(evt));

    /* ------------------------------------------------------------------------------------------------------------
        The next line must be commented out if you are note using the flow_index section in the settings.jsx file

        See documentation  :   https://cozie.app/docs/change-settings
    ------------------------------------------------------------------------------------------------------------ */
    //refreshViews();

    if (evt.data.key === 'flow_index') {
        flowSelector = evt.data.data;
        flowSelectorUpdateTime = evt.data.time;
        console.log("flow selector from peer socket is", flowSelector);
        mapFlows(flowSelector);
        //save flows locally in event of app rest
        flowFileWrite = {
            flowSelector: flowSelector
        };
        console.log(JSON.stringify(flowFileWrite));
        fs.writeFileSync("flow.txt", flowFileWrite, "json");
        console.log("flowSelector, files saved locally")
    } else if (evt.data.key === 'buzz_time') {
        buzzFileWrite = {
            buzzSelection: evt.data.data
        };
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
                /* ------------------------------------------------------------------------------------------------------------
                    The next line must be commented out if you are note using the flow_index section in the settings.jsx file

                    See documentation  :   https://cozie.app/docs/change-settings
                ------------------------------------------------------------------------------------------------------------ */
                // refreshViews();

                flowSelector = fileData.data;
                mapFlows(flowSelector);
                console.log("settings updated via file transfer");

                //save flows locally in event of app rest
                flowFileWrite = {
                    flowSelector: flowSelector
                };
                console.log(JSON.stringify(flowFileWrite));
                fs.writeFileSync("flow.txt", flowFileWrite, "json");
                console.log("files saved locally")
            } else if (fileData.key === 'buzz_time') {
                buzzSelection = fileData.data;
                console.log("buzz selection is", buzzSelection);
                buzzFileWrite = {
                    buzzSelection: fileData.data
                };
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