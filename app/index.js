import clock from "clock";
import document from "document";
import {preferences} from "user-settings";
import {HeartRateSensor} from "heart-rate";
import {goals, today} from "user-activity";
import * as util from "../common/utils";
import {user} from "user-profile";
import {battery} from "power";
import * as messaging from "messaging";
import {vibration} from "haptics";
import * as fs from "fs";
import {geolocation} from "geolocation";
import {inbox, outbox} from "file-transfer"
import * as cbor from "cbor";
import {memory} from "system";
import {BodyPresenceSensor} from "body-presence";

const production = true; // false for dev / debug releases

//-------- CLOCK FACE DESIGN -----------

const months = {
    0: "Jan", 1: "Feb", 2: "Mar", 3: 'Apr', 4: "May", 5: 'Jun',
    6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"
};

const weekdays = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: 'Sat', 0: 'Sun'};

// Update the clock every minute
clock.granularity = 'seconds';

// read HR data
const hrLabel = document.getElementById("hrm");  // get tag label
hrLabel.text = "--";
const chargeLabel = document.getElementById("chargeLabel");

const hrm = new HeartRateSensor();
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

// Get a handle on the <text> elements
const timeLabel = document.getElementById("timeLabel");
const steps = document.getElementById("steps");
const dateLabel = document.getElementById("dateLabel");
const secLabel = document.getElementById("secLabel");
const storageLabel = document.getElementById("storageLabel");
// Note that dev elements are hidden in production mode
const voteLogLabel = document.getElementById("voteLogLabel");
const voteLogPeerTransferLabel = document.getElementById("voteLogPeerTransferLabel");
const voteLogFileTransferLabel = document.getElementById("voteLogFileTransferLabel");
const memoryLabel = document.getElementById("memoryLabel");
const errorLabel = document.getElementById("errorLabel");
const bodyErrorLabel = errorLabel.getElementById("copy");

if (!production) {
    timeLabel.style.display = "none";
    dateLabel.style.display = "none";
    secLabel.style.display = "none";
}

// function that runs in the background and start vibration to remind the user to complete the survey
const buzzOptions = {
    0: [],
    1: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    2: [9, 11, 13, 15, 17, 19, 21],
    3: [9, 12, 15, 18, 21]
};

// log body presence if sensor is available
const bodyPresence = new BodyPresenceSensor();
if (BodyPresenceSensor) {
    console.log("This device has a BodyPresenceSensor!");
    bodyPresence.addEventListener("reading", () => {
        console.log(`The device is ${bodyPresence.present ? '' : 'not'} on the user's body.`);
    });
    bodyPresence.start();
} else {
    console.log("This device does NOT have a BodyPresenceSensor!");
}

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

clock.ontick = (evt) => {
    const today_dt = evt.date;
    let hours = today_dt.getHours();
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hours = hours % 12 || 12;
    } else {
        // 24h format
        hours = util.monoDigits(util.zeroPad(hours));
    }
    const mins = util.monoDigits(util.zeroPad(today_dt.getMinutes()));
    const secs = util.monoDigits(util.zeroPad(today_dt.getSeconds()));

    timeLabel.text = `${hours}:${mins}`;
    secLabel.text = secs;

    const month = months[today_dt.getMonth()];
    const weekday = weekdays[today_dt.getDay()];
    const day = today_dt.getDate();

    dateLabel.text = `${weekday}, ${month} ${day}`;

    // Steps
    if (today.adjusted.steps > 0) {
        try {
            steps.text = `${(Math.floor(today.adjusted.steps / 1000) || 0)}k`;
            if (steps.text >= (goals.steps || 0)) {
                steps.style.fill = 'fb-green'; //green
            } else if (steps.text >= (goals.steps || 0) / 2) {
                steps.style.fill = 'fb-peach'; //yellow
            } else {
                steps.style.fill = 'fb-orange'; //pink
            }
        } catch (e) {
            console.log("Change steps label color error: " + e);
            if (!production) {
                bodyErrorLabel.text = bodyErrorLabel.text + "Steps : " + e;
            }
        }
    }

    //get screen width
    try {
        const charge = battery.chargeLevel / 100;
        chargeLabel.width = 300 * charge;
        if (charge < 0.15) {
            chargeLabel.style.fill = 'fb-red'
        } else if (charge < 0.3) {
            chargeLabel.style.fill = 'fb-peach'
        } else {
            chargeLabel.style.fill = 'fb-light-gray'
        }
    } catch (e) {
        if (!production) {
            bodyErrorLabel.text = bodyErrorLabel.text + "Battery : " + e;
        }
    }

    // show memory utilization
    if (!production) {
        memoryLabel.text = "memory usage = " + Math.round(memory.js.used / memory.js.total * 100) + " %";
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
const svg_met = document.getElementById("metabolic_rate");
const svg_change = document.getElementById("any_change");
//Clock manipulation guis
const thankyou = document.getElementById("thankyou");
const svg_stop_survey = document.getElementById("stopSurvey");
const clockblock = document.getElementById("clockblock");

// Default shows only thank you screen in the flow
let flow_views = [thankyou];
// Used to set all views to none when switching between screens
const allViews = [warmCold, brightDim, loudQuiet, indoorOutdoor, inOffice, happySad, clothing, svg_air_vel, svg_met, svg_change, clockface, thankyou, clockblock, svg_stop_survey];
let flowSelectorUpdateTime = 0;

//read small icons
const smallIcons = [document.getElementById("small-thermal"),
    document.getElementById("small-light"),
    document.getElementById("small-noise"),
    document.getElementById("small-indoor"),
    document.getElementById("small-office"),
    document.getElementById("small-mood"),
    document.getElementById("small-clothing"),
    document.getElementById("small-velocity"),
    document.getElementById("small-met"),
    document.getElementById("small-any-change"),];

// Flow may have been previously saved locally as flow.txt
let flowFileRead;
let flowFileWrite;
let buzzFileWrite;
let flowSelector;

try {
    flowFileRead = fs.readFileSync("flow.txt", "json");
    console.log(JSON.stringify(flowFileRead));
    console.log(JSON.stringify(flowFileRead.flowSelector));
    flowSelector = flowFileRead.flowSelector;
    mapFlows(flowSelector);
    console.log("flows loaded via file sync")
} catch (e) {
    console.log(e);
    console.log("resetting flows");
    flowSelector = []
}

// receive message via peer socket
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
            } else if (fileData.key === 'buzz_time') {
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

function mapFlows(flowSelector) {
    flow_views = [];
    //set opacity of all small icons to 0.2
    smallIcons.map(icon => icon.style.opacity = 0.2);
    if (flowSelector) {
        flowSelector.map(index => {
            flow_views.push(allViews[index]);
            smallIcons[index].style.opacity = 1.0;
        })
    }
    flow_views.push(thankyou);
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
const location_work = document.getElementById("location_work");
const location_home = document.getElementById("location_home");
const location_other = document.getElementById("location_other");
const location_portable = document.getElementById("location_portable");
// buttons
const change_no = document.getElementById("change_no");
const change_yes = document.getElementById("change_yes");
// buttons
const thermal_comfy = document.getElementById('thermal_comfy');
const prefer_warm = document.getElementById("prefer_warm");
const prefer_cold = document.getElementById("prefer_cold");
// back and stop buttons
const flow_back = document.getElementById("flow_back");
const flow_stop = document.getElementById("flow_stop");
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
const clothes_very_light = document.getElementById('clothes_very_light');
const clothes_light = document.getElementById('clothes_light');
const clothes_medium = document.getElementById("clothes_medium");
const clothes_high = document.getElementById("clothes_high");
// buttons
const met_resting = document.getElementById('met_resting');
const met_sitting = document.getElementById('met_sitting');
const met_standing = document.getElementById("met_standing");
const met_exercising = document.getElementById("met_exercising");
// buttons air velocity
const air_vel_low = document.getElementById('air_vel_low');
const air_vel_medium = document.getElementById("air_vel_medium");
const air_vel_high = document.getElementById("air_vel_high");

function showFace(view_to_display) {
    allViews.map(v => v.style.display = "none");
    view_to_display.style.display = "inline";
    currentView++;

    vibration.start("bump");
}

function showThankYou() {
    allViews.map(v => v.style.display = "none");
    smallIcons.map(icon => icon.style.opacity = 0.2);
    if (flow_views.length >= 1) {
        flowSelector.map(index => {
            smallIcons[index].style.opacity = 1.0;
        })
    }
    clockface.style.display = "inline";
    thankyou.style.display = "inline";

    //Find out how many seconds has passed to give response
    const endFeedback = new Date();
    const startFeedback = new Date(feedbackData['startFeedback']);
    feedbackData['responseSpeed'] = ((endFeedback - startFeedback) / 1000.0).toFixed(1);
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
    allViews.map(v => v.style.display = "none");
    smallIcons.map(icon => icon.style.opacity = 0.2);

    // highlight all the icons corresponding to the questions selected in the fitbit app
    flowSelector.map(index => {
        smallIcons[index].style.opacity = 1.0;
    });
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
let votelog;       // Global variable for handling votelogs
let voteLogPeerTransfer = 0;       // Global variable for handling votelogs
let voteLogFileTransfer = 0;       // Global variable for handling votelogs

function initiateFeedbackData() {
    // Initiating feedback data
    const startFeedback = new Date().toISOString();
    // Initiate feedbackData object
    feedbackData = {
        startFeedback,
        heartRate: hrm.heartRate,
    };
}

const buttons = [{
    value: 10,
    obj: comfy,
    attribute: 'comfort'
}, {
    value: 9,
    obj: notComfy,
    attribute: 'comfort',
}, {
    value: 11,
    obj: indoor,
    attribute: 'indoorOutdoor',
}, {
    value: 9,
    obj: outdoor,
    attribute: 'indoorOutdoor',
}, {
    value: 10,
    obj: change_no,
    attribute: 'change',
}, {
    value: 11,
    obj: change_yes,
    attribute: 'change',
}, {
    value: 11,
    obj: location_home,
    attribute: 'location',
}, {
    value: 10,
    obj: location_other,
    attribute: 'location',
}, {
    value: 9,
    obj: location_work,
    attribute: 'location',
}, {
    value: 8,
    obj: location_portable,
    attribute: 'location',
}, {
    value: 10,
    obj: thermal_comfy,
    attribute: 'thermal',
}, {
    value: 9,
    obj: prefer_warm,
    attribute: 'thermal',
}, {
    value: 11,
    obj: prefer_cold,
    attribute: 'thermal',
}, {
    value: 'flow_back',
    obj: flow_back,
    attribute: 'flow_control',
}, {
    value: 'flow_stop',
    obj: flow_stop,
    attribute: 'flow_control',
}, {
    value: 10,
    obj: light_comfy,
    attribute: 'light',
}, {
    value: 9,
    obj: prefer_bright,
    attribute: 'light',
}, {
    value: 11,
    obj: prefer_dim,
    attribute: 'light',
}, {
    value: 10,
    obj: noise_comfy,
    attribute: 'noise',
}, {
    value: 9,
    obj: prefer_loud,
    attribute: 'noise',
}, {
    value: 11,
    obj: prefer_quiet,
    attribute: 'noise',
}, {
    value: 10,
    obj: neutral,
    attribute: 'mood',
}, {
    value: 11,
    obj: happy,
    attribute: 'mood',
}, {
    value: 9,
    obj: sad,
    attribute: 'mood',
}, {
    value: 8,
    obj: clothes_very_light,
    attribute: 'clothing',
}, {
    value: 9,
    obj: clothes_light,
    attribute: 'clothing',
}, {
    value: 10,
    obj: clothes_medium,
    attribute: 'clothing',
}, {
    value: 11,
    obj: clothes_high,
    attribute: 'clothing',
}, {
    value: 8,
    obj: met_resting,
    attribute: 'met',
}, {
    value: 9,
    obj: met_sitting,
    attribute: 'met',
}, {
    value: 10,
    obj: met_standing,
    attribute: 'met',
}, {
    value: 11,
    obj: met_exercising,
    attribute: 'met',
}, {
    value: 9,
    obj: air_vel_low,
    attribute: 'air-vel',
}, {
    value: 10,
    obj: air_vel_medium,
    attribute: 'air-vel',
}, {
    value: 11,
    obj: air_vel_high,
    attribute: 'air-vel',
}];

for (const button of buttons) {
    button.obj.addEventListener("click", () => {
        /** Constantly monitors if any buttons have been pressed */
        // init data object on first view click
        if (button.attribute === 'comfort') {
            // if any of the two buttons in the main view have been pressed initiate the loop through the selected
            smallIcons.map(icon => icon.style.opacity = 0);
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
                    // show previous view
                    showFace(flow_views[currentView])
                }
            } else if (button.value === "flow_stop") {
                // stop_flow button was pressed
                showMessageStopSurvey();
            }
        }

        console.log(`${button.attribute}: ${button.value} clicked`);

        if (button.attribute !== 'flow_control') {

            feedbackData[button.attribute] = button.value;

            if (flow_views[currentView] === thankyou) {
                // if all the views have already been shown
                showThankYou();
            } else {
                showFace(flow_views[currentView])
            }
        }
    });
}
//-------- END (DEFINE VIEWS BASED ON FLOW SELECTOR) -----------

// vibrate for 3 sec and change screen to response
function vibrate() {
    /**
     * It causes the watch to vibrate, and forces the start of the feedback.
     *
     * If there are no questions selected then it blocks the time until a response is given.
     * If there are questions in the flow, then it starts the flow
     */

    vibration.start("alert");

    //Change main clock face to response screen
    if (flow_views.length === 1) {
        clockblock.style.display = "inline";
    } else {
        smallIcons.map(icon => icon.style.opacity = 0);
        initiateFeedbackData();
        // Reset currentView to prevent an unattended fitbit from moving through the flow
        currentView = 0;
        // go to first item in the flow
        showFace(flow_views[currentView])
    }
    //Stop vibration after 5 seconds
    setTimeout(function () {
        vibration.stop()
    }, 2000);
}

//-------- COMPILE DATA AND SEND TO COMPANION  -----------
function sendEventIfReady(_feedbackData) {
    console.log(JSON.stringify(_feedbackData));

    console.log("Fitbit memory usage: " + memory.js.used + ", of the available: " + memory.js.total);
    // set timeout of gps https://dev.fitbit.com/build/reference/device-api/geolocation/
    console.log("Getting GPS location ... it may take a couple of minutes");
    geolocation.getCurrentPosition(locationSuccess, locationError, {timeout: 4 * 60 * 1000, maximumAge: 4 * 60 * 1000});

    // reading log file for debuging purposes
    try {
        votelog = fs.readFileSync("votelog.txt", "json");
    } catch (e) {
        // if can't read set local file to empty
        console.log("creating empty votelog.txt file");
        votelog = [0]
    }
    // Incremement the vote log by one
    votelog[0]++;
    console.log("Vote log: " + votelog[0]);
    if (!production) {
        voteLogLabel.text = votelog + 'vl;';
    }
    // add the votelog to the feedback data json
    _feedbackData['voteLog'] = votelog[0];
    // store the votelog on the device as votelog.txt
    fs.writeFileSync("votelog.txt", votelog, "json");

    function locationSuccess(position) {
        console.log("GPS location success");
        _feedbackData.lat = position.coords.latitude;
        _feedbackData.lon = position.coords.longitude;
        sendDataToCompanion(_feedbackData);
    }

    function locationError(error) {
        console.log("GPS location fail");
        console.log(error);
        _feedbackData.lat = null;
        _feedbackData.lon = null;
        sendDataToCompanion(_feedbackData);
    }
}

function sendDataToCompanion(data) {
    console.log("Sending feedback data ... ");

    if (JSON.stringify(data).length > (messaging.peerSocket.MAX_MESSAGE_SIZE - 200)) {
        console.log('The message you are sending has a length of : ' + JSON.stringify(data).length + "but you can only send messages up to this size" + messaging.peerSocket.MAX_MESSAGE_SIZE);
    }

    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {

        console.log("data sent via Peer Socket");
        messaging.peerSocket.send(data);

        if (!production) {
            voteLogPeerTransfer++;
            voteLogPeerTransferLabel.text = voteLogPeerTransfer + "pt;";
        }
    } else {
        console.log("No peerSocket connection. Attempting to send via file transfer");

        let local_file;

        // try to read file with local data
        try {
            console.log("checking if local file exists");
            local_file = fs.readFileSync("local.txt", "json");
        } catch (e) {
            // if can't read set local file to empty
            console.log("creating empty local.txt file");
            local_file = [];
        }

        // push new reponce and save
        local_file.push(data);

        fs.writeFileSync("local.txt", local_file, "json");

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
                storageLabel.text = `e ${local_file.length}`;
            })
    }
}

// function to determine changes in the status of the file transfer
function onFileTransferEvent() {
    console.log('File transfer state: ' + this.readyState);
    if (this.readyState === "transferred") {

        console.log("data sent via File Transfer");

        // delete local.txt file as data is now transferred
        if (fs.existsSync("local.txt")) {
            fs.unlinkSync("local.txt");
        }

        storageLabel.text = ``

        if (!production) {
            voteLogFileTransfer++;
            voteLogFileTransferLabel.text = voteLogFileTransfer + 'ft';
        }
    }

    if (this.readyState === "error") {
        console.log("WARNING: ERROR IN FILE TRANSFER");
        storageLabel.text = `e ${local_file.length}`;
    }
    //console.log(`onFileTransferEvent(): name=${this.name} readyState=${this.readyState};${Date.now()};`);
}
