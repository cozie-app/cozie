import clock from "clock";
import document from "document";
import {preferences} from "user-settings";
import {HeartRateSensor} from "heart-rate";
import {today} from "user-activity";
import * as util from "../common/utils";
import {user} from "user-profile";
import {goals} from "user-activity";
import {battery} from "power";
import * as messaging from "messaging";
import {vibration} from "haptics";
import * as fs from "fs";
import {geolocation} from "geolocation";
import {inbox} from "file-transfer"
import {outbox} from "file-transfer";
import * as cbor from "cbor";
// import { listDirSync } from "fs";
import {memory} from "system";

const production = false; // false for dev / debug releases

//-------- CLOCK FACE DESIGN -----------
const months = {
    0: "Jan", 1: "Feb", 2: "Mar", 3: 'Apr', 4: "May", 5: 'Jun',
    6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"
};

const weekdays = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: 'Sat', 0: 'Sun'};

// Update the clock every minute
clock.granularity = 'seconds';

// read HR data
let hrLabel = document.getElementById("hrm");
hrLabel.text = "--";

let chargeLabel = document.getElementById("chargeLabel");

var hrm = new HeartRateSensor();
hrm.onreading = function () {
    // Peek the current sensor values
    // console.log("Current heart rate: " + hrm.heartRate);
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
};

// Begin monitoring the sensor
hrm.start();

// Get a handle on the <text> elements
const timeLabel = document.getElementById("timeLabel");
let steps = document.getElementById("steps");
let dateLabel = document.getElementById("dateLabel");
let secLabel = document.getElementById("secLabel");
let storageLabel = document.getElementById("storageLabel");
// Note that dev elements are hidden in production mode
let devMemoryLabel = document.getElementById("devMemoryLabel");
let devHeartStorageLabel = document.getElementById("devHeartStorageLabel");
let devErrorLabel = document.getElementById("devErrorLabel");
let devErrorMessageLabel = document.getElementById("devErrorMessageLabel");

// console.log((today.local.steps || 0) + " steps");

// set the local_file which will be used to store data
let local_file;

// intervals to check vibrations
let found = false;
const buzzOptions = {
    '0': [],
    '1': [9, 10, 11, 12, 13, 14, 15, 16, 17],
    '2': [9, 11, 13, 15, 17],
    '3': [9, 12, 15]
};
let buzzSelection;
setInterval(function () {
    try {
        buzzSelection = fs.readFileSync("buzzSelection.txt", "json").buzzSelection;
    } catch (err) {
        console.log(err);
        console.log("buzz default option is [9,11,13,15,17]");
        buzzSelection = 2;
    }

    let vibrationTime = buzzOptions[buzzSelection];
    const currentDate = new Date();
    // vibrate and change to response screen based on selected buzz option
    const currentHour = currentDate.getHours();
    // make vibration during first minute
    if (!found && vibrationTime.indexOf(currentHour) !== -1) {
        vibrate();
        found = true;
    } else if (vibrationTime.indexOf(currentHour) === -1) {
        found = false;
    }
}, 1200000); // timeout for 20 minutes

// Collect 90 minutes of heart rate data
let dataHistoryArray = [];
// To run every minute and populate the data history array with 90min of data
setInterval(function () {
    if (dataHistoryArray.length >= 90) {
        dataHistoryArray.shift() // remove the first element of the array
    }

    let currentTime = new Date().toISOString();
    dataHistoryArray.push({time: currentTime, heartRate: hrm.heartRate, stepCount: today.adjusted.steps});

    console.log(JSON.stringify(dataHistoryArray));
    console.log("number of heart rate data points", dataHistoryArray.length);

    // store the data on the watch for debugging
    if (!production) {
        devMemoryLabel.text = `${Math.floor(memory.js.used / 1000)}/${Math.floor(memory.js.total / 1000)}kb`;
        devHeartStorageLabel.text = dataHistoryArray.length + '/90';
        // Colour based on memory allocation
        if (memory.js.used > 50000) {
            devMemoryLabel.style.fill = 'fb-violet' //pink
        } else if (memory.js.used < 40000) {
            devMemoryLabel.style.fill = 'fb-green'; //green
        } else {
            devMemoryLabel.style.fill = 'fb-peach'; //yelow
        }
    }

    console.log("JS memory: " + memory.js.used + "/" + memory.js.total);

}, 60000); // timeout for 1 minute

clock.ontick = (evt) => {
    let today_dt = evt.date;
    let hours = today_dt.getHours();
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hours = hours % 12 || 12;
    } else {
        // 24h format
        hours = util.monoDigits(util.zeroPad(hours));
    }
    let mins = util.monoDigits(util.zeroPad(today_dt.getMinutes()));
    let secs = util.monoDigits(util.zeroPad(today_dt.getSeconds()));

    timeLabel.text = `${hours}:${mins}`;
    secLabel.text = secs;

    let month = months[today_dt.getMonth()];
    let weekday = weekdays[today_dt.getDay()];
    let day = today_dt.getDate();

    dateLabel.text = `${weekday}, ${month} ${day}`;


    // Steps
    steps.text = `${(Math.floor(today.adjusted.steps / 1000) || 0)}k`;
    if (steps.text >= (goals.steps || 0)) {
        steps.style.fill = 'fb-green'; //green
    } else if (steps.text >= (goals.steps || 0) / 2) {
        steps.style.fill = 'fb-peach'; //yelow
    } else {
        steps.style.fill = 'fb-red'; //pink
    }

    // Charge
    //get screen width
    let charge = battery.chargeLevel / 100;
    chargeLabel.width = 300 * charge;
    if (charge < 0.2) {
        chargeLabel.style.fill = 'fb-red'
    } else {
        chargeLabel.style.fill = 'fb-light-gray'
    }

};

//-------- END (CLOCK FACE DESIGN) -----------

//-------- READING EXPERIMENT QUESTIONS FROM PHONE SETTINGS -----------
console.log("WARNING!! APP HAS RESET");

//Flow GUIs
const clockface = document.getElementById("clockface");
const indoorOutdoor = document.getElementById("indoor-outdoor");
const inOffice = document.getElementById("inoffice");
const warmCold = document.getElementById("warm-cold");
const brightDim = document.getElementById("bright-dim");
const loudQuiet = document.getElementById("loud-quiet");
const happySad = document.getElementById("happy-sad");
const clothing = document.getElementById("clothing");
const svg_air_vel = document.getElementById("svg_air_vel");
//Clock manipulation guis
const thankyou = document.getElementById("thankyou");
const clockblock = document.getElementById("clockblock");

// Default shows only thank you screen in the flow
let flow = [showThankyou];
let flowViews;
// const allFlows = [showFace, showFace, showFace, showFace, showFace, showFace, showFace, showFace];
// const face_to_show = [warmCold, brightDim, loudQuiet, indoorOutdoor, inOffice, happySad, clothing, svg_air_vel];
//Useed to set all views to none when switching between screens
const allViews = [warmCold, brightDim, loudQuiet, indoorOutdoor, inOffice, happySad, clothing, svg_air_vel, clockface, thankyou, clockblock];
var flowSelectorUpdateTime = 0;

//read small icons 
const smallIcons = [document.getElementById("small-thermal"),
    document.getElementById("small-light"),
    document.getElementById("small-noise"),
    document.getElementById("small-indoor"),
    document.getElementById("small-office"),
    document.getElementById("small-mood"),
    document.getElementById("small-clothing"),
    document.getElementById("small-velocity")];

// Flow may have been previously saved locally as flow.txt
var flowFileRead;
var flowFileWrite;
var buzzFileWrite;
var flowSelector;

try {
    flowFileRead = fs.readFileSync("flow.txt", "json");
    console.log(JSON.stringify(flowFileRead));
    console.log(JSON.stringify(flowFileRead.flowSelector));
    flowSelector = flowFileRead.flowSelector;
    mapFlows(flowSelector);
    console.log("flows loaded via file sync")
} catch (err) {
    console.log(err);
    console.log("resetting flows");
    let flowSelector = []
}

//recieve message via peer socket
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
    } else if (evt.data.key === 'buzz_time') {
        buzzFileWrite = {buzzSelection: evt.data.data};
        console.log(evt.data.data);
        fs.writeFileSync("buzzSelection.txt", buzzFileWrite, "json");
        console.log("buzzSelection, files saved locally");
        buzzSelection = fs.readFileSync("buzzSelection.txt", "json").buzzSelection;
        console.log("Buzz Selection is", buzzSelection)
    } else if (evt.data.key === 'error') {
        console.log("error message called and displaying on watch");
        if (!production) {
            devErrorLabel.text = evt.data.data.type;
            devErrorMessageLabel.text = evt.data.data.message
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
            } else if (fileData.key === 'buzz_time') {
                buzzSelection = fileData.data;
                console.log("buzz selection is", buzzSelection);
                buzzFileWrite = {buzzSelection: fileData.data};
                fs.writeFileSync("buzzSelection.txt", buzzFileWrite, "json");

            } else if (fileData.key === 'error') {
                console.log("error message called and displaying on watch");
                if (!production) {
                    devErrorLabel.text = fileData.data.type + ' ' + Date(fileData.time);
                    devErrorMessageLabel.text = fileData.data.message
                }
            }
        } else {
            console.log("settings already updated via peer socket")
        }


    }
}

function mapFlows(flowSelector) {
    flow = [];
    flowViews = [];
    //set opacity of all small icons to 0.2
    smallIcons.map(icon => icon.style.opacity = 0.2);
    if (flowSelector) {
        flowSelector.map(index => {
            // flow.push(allFlows[index]);
            flowViews.push(allViews[index]);
            smallIcons[index].style.opacity = 1.0;
        })
    }
    // flow.push(showThankyou);
    flowViews.push(thankyou);

    console.log(flow);
    console.log(flowViews);
}

inbox.addEventListener("newfile", processAllFiles);
processAllFiles();

//-------- END (READING EXPERIMENT QUESTIONS FROM PHONE SETTINGS) -----------

//-------- DEFINE VIEWS AND DATA COLLECTION BASED ON FLOW SELECTOR -----------

let currentView = 0; //current view of flow

// buttons
const comfy = document.getElementById("comfy");
const notComfy = document.getElementById("not-comfy");
// buttons
const indoor = document.getElementById("indoor");
const outdoor = document.getElementById("outdoor");
// buttons
const in_office = document.getElementById("in-office");
const out_office = document.getElementById("out-office");
// buttons
const thermal_comfy = document.getElementById('thermal_comfy');
const prefer_warm = document.getElementById("prefer_warm");
const prefer_cold = document.getElementById("prefer_cold");
// buttons
const noise_comfy = document.getElementById('noise_comfy');
const prefer_bright = document.getElementById("prefer_bright");
const prefer_dim = document.getElementById("prefer_dim");
// buttons
const light_comfy = document.getElementById('light_comfy');
const prefer_loud = document.getElementById("prefer_loud");
const prefer_quiet = document.getElementById("prefer_quiet");
// buttons
const neutral = document.getElementById('neutral');
const happy = document.getElementById("happy");
const sad = document.getElementById("sad");
// buttons
const light_clothes = document.getElementById('light_clothes');
const medium_clothes = document.getElementById("medium_clothes");
const heavy_clothes = document.getElementById("heavy_clothes");
// buttons air velocity
const air_vel_low = document.getElementById('air_vel_low');
const air_vel_medium = document.getElementById("air_vel_medium");
const air_vel_high = document.getElementById("air_vel_high");

function showFace(viewToDisplay) {
    console.log("Test");
    allViews.map(v => v.style.display = "none");
    viewToDisplay.style.display = "inline";
    currentView++
}

function showThankyou() {
    allViews.map(v => v.style.display = "none");
    smallIcons.map(icon => icon.style.opacity = 0.2);
    flowSelector.map(index => {
        smallIcons[index].style.opacity = 1.0;
    });
    clockface.style.display = "inline";
    thankyou.style.display = "inline";

    //Find out how many seconds has passed to give response
    const endFeedback = new Date();
    const startFeedback = new Date(feedbackData['startFeedback']);
    feedbackData['responseSpeed'] = (endFeedback - startFeedback) / 1000.0;
    feedbackData['endFeedback'] = endFeedback.toISOString();
    console.log(feedbackData['responseSpeed']);

    //send feedback to companion
    sendEventIfReady(feedbackData);
    feedbackData = {};
    setTimeout(() => {
        showClock()
    }, 2000);
    currentView = 0
}

function showClock() {
    allViews.map(v => v.style.display = "none");
    clockface.style.display = "inline";
    currentView = 0
}

var feedbackData; // Global variable for handling feedbackData
var votelog;       // Global variable for handling votelogs

function initiateFeedbackData() {
    // Initiating feedback data
    const startFeedback = new Date().toISOString();
    // Initiate feedbackData object
    feedbackData = {
        startFeedback,
        heartRate: hrm.heartRate,
    };

    // access heart rate array data
    feedbackData['dataHistoryArray'] = dataHistoryArray;

    // reading log file for debuging purposes
    try {
        console.log("checking if local file exists");
        votelog = fs.readFileSync("votelog.txt", "json");
    } catch (err) {
        // if can't read set local file to empty
        console.log("creating empty votelog.txt file");
        votelog = [0]
    }
    // Incremement the vote log by one
    votelog[0]++;
    console.log(votelog[0]);
    // add the votelog to the feedback data json
    feedbackData['voteLog'] = votelog[0];
    // store the votelog on the device as votelog.txt
    fs.writeFileSync("votelog.txt", votelog, "json");
}


let buttons = [{
    value: 'comfy',
    obj: comfy,
    attribute: 'comfort',
}, {
    value: 'notComfy',
    obj: notComfy,
    attribute: 'comfort',
}, {
    value: 'indoor',
    obj: indoor,
    attribute: 'indoorOutdoor',
}, {
    value: 'outdoor',
    obj: outdoor,
    attribute: 'indoorOutdoor',
}, {
    value: 'in_office',
    obj: in_office,
    attribute: 'inOffice',
}, {
    value: 'out_office',
    obj: out_office,
    attribute: 'inOffice',
}, {
    value: 'thermal_comfy',
    obj: thermal_comfy,
    attribute: 'thermal',
}, {
    value: 'prefer_warm',
    obj: prefer_warm,
    attribute: 'thermal',
}, {
    value: 'prefer_cold',
    obj: prefer_cold,
    attribute: 'thermal',
}, {
    value: 'light_comfy',
    obj: light_comfy,
    attribute: 'light',
}, {
    value: 'prefer_bright',
    obj: prefer_bright,
    attribute: 'light',
}, {
    value: 'prefer_dim',
    obj: prefer_dim,
    attribute: 'light',
}, {
    value: 'noise_comfy',
    obj: noise_comfy,
    attribute: 'noise',
}, {
    value: 'prefer_loud',
    obj: prefer_loud,
    attribute: 'noise',
}, {
    value: 'prefer_quiet',
    obj: prefer_quiet,
    attribute: 'noise',
}, {
    value: 'neutral',
    obj: neutral,
    attribute: 'mood',
}, {
    value: 'happy',
    obj: happy,
    attribute: 'mood',
}, {
    value: 'sad',
    obj: sad,
    attribute: 'mood',
}, {
    value: 'light_clothes',
    obj: light_clothes,
    attribute: 'clothing',
}, {
    value: 'medium_clothes',
    obj: medium_clothes,
    attribute: 'clothing',
}, {
    value: 'heavy_clothes',
    obj: heavy_clothes,
    attribute: 'clothing',
}, {
    value: 'low',
    obj: air_vel_low,
    attribute: 'air-vel',
}, {
    value: 'medium',
    obj: air_vel_medium,
    attribute: 'air-vel',
}, {
    value: 'high',
    obj: air_vel_high,
    attribute: 'air-vel',
}];

for (const button of buttons) {
    button.obj.addEventListener("click", () => {
        // init data object on first view click
        if (button.attribute === 'comfort') {
            smallIcons.map(icon => icon.style.opacity = 0);
            initiateFeedbackData();
        }

        // console.log(`${button.value} clicked`)
        feedbackData[button.attribute] = button.value;

        //Go straight to end if comfortable
        if (flowViews[currentView] === thankyou) {
            showThankyou();
        } else {
            showFace(flowViews[currentView]) // temporarily doing this for the experiment)
        }

        // if (button.attribute === 'comfort' & button.value === "comfy") {
        //       showThankyou();
        // } else {
        //   // continue the flow
        //   flow[currentView]()
        // }
    });
}

//-------- END (DEFINE VIEWS BASED ON FLOW SELECTOR) -----------

// vibrate for 3 sec and change screen to reponse
function vibrate() {
    vibration.start("ring");

    //Change main clock face to response screen
    if (flow.length === 1) {
        clockblock.style.display = "inline";
    } else {
        smallIcons.map(icon => icon.style.opacity = 0);
        initiateFeedbackData();
        // Reset currentView to prevent an unattended fitbit from moving through the flow
        currentView = 0;
        // go to first item in the flow
        flow[currentView]()
    }
    //Stop vibration after 5 seconds
    setTimeout(function () {
        vibration.stop()
    }, 5000);
}

//-------- COMPILE DATA AND SEND TO COMPANION  -----------
function sendEventIfReady(feedbackData) {
    console.log("sending feedbackData");
    console.log(JSON.stringify(feedbackData));

    console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
    // set timeout of gps aquisition to 5 seconds and allow cached geo locations up to 1min to be allowed
    geolocation.getCurrentPosition(locationSuccess, locationError, {timeout: 20000, maximumAge: 60000});

    function locationSuccess(position) {
        console.log("location success");
        feedbackData.lat = position.coords.latitude;
        feedbackData.lon = position.coords.longitude;
        sendDataToCompanion(feedbackData);
    }

    function locationError(error) {
        console.log("location fail");
        feedbackData.lat = null;
        feedbackData.lon = null;
        sendDataToCompanion(feedbackData);
    }
}


function sendDataToCompanion(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        // if setLocation value is true then companion will set location
        data.setLocation = true;
        messaging.peerSocket.send(data);
        console.log("data sent directly to companion");

        //remove data to prevent it beint sent twice
        data = null

    } else {
        console.log("No peerSocket connection. Attempting to send via file transfer");

        // try to read file with local data
        try {
            console.log("checking if local file exists");
            local_file = fs.readFileSync("local.txt", "json");
        } catch (err) {
            // if can't read set local file to empty
            console.log("creating empty local.txt file");
            local_file = []
        }

        // push new reponce and save
        console.log("pushing new data to local file");
        local_file.push(data);

        fs.writeFileSync("local.txt", local_file, "json");
        // Note on device how many locally stored files are present
        storageLabel.text = `${local_file.length}`;

        // Prepare outbox for file transfer
        outbox
            .enqueueFile("local.txt")
            .then((ft) => {
                console.log(`Transfer of ${ft.name} successfully queued.`);

                // Let user know that data is in queue
                storageLabel.text = `q ${local_file.length}`;
                // On change of ft, launch file transfer event
                ft.onchange = onFileTransferEvent;
            })
            .catch((error) => {
                console.log(`Failed to schedule transfer: ${error}`);
                storageLabel.text = `${local_file.length}`
            })


    }
}

// function to determine changes in the status of the file transfer
function onFileTransferEvent(e) {
    console.log(this.readyState);
    if (this.readyState === "transferred") {
        console.log("transferred successfully");
        // delete local.txt file as data is now trasnferred
        fs.unlinkSync("local.txt");
        storageLabel.text = ``
    }
    if (this.readyState === "error") {
        console.log("WARNING: ERROR IN FILE TRANSFER");
        storageLabel.text = `Error`
    }
    //console.log(`onFileTransferEvent(): name=${this.name} readyState=${this.readyState};${Date.now()};`);
}
