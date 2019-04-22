import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import * as util from "../common/utils";
import { user } from "user-profile";
import { goals } from "user-activity";
import { battery } from "power";
import * as messaging from "messaging";
import { vibration } from "haptics";
import * as fs from "fs";
import { geolocation } from "geolocation";

import { inbox } from "file-transfer"
import * as cbor from "cbor";

var months = {0: "Jan", 1: "Feb", 2: "Mar", 3: 'Apr', 4: "May", 5: 'Jun',
              6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"}; 

var weekdays = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: 'Sat', 0: 'Sun'};

// Update the clock every minute
clock.granularity = 'seconds';

// read HR data

let hrLabel = document.getElementById("hrm");
hrLabel.text = "--";

let chargeLabel = document.getElementById("chargeLabel");

var hrm = new HeartRateSensor();
hrm.onreading = function() {
  // Peek the current sensor values
  // console.log("Current heart rate: " + hrm.heartRate);
  hrLabel.text = `${hrm.heartRate}`;
  if (user.heartRateZone(hrm.heartRate) == 'fat-burn') {
    hrLabel.style.fill = '#ffd733'; //yelow
  } else if (user.heartRateZone(hrm.heartRate) == 'cardio') {
    hrLabel.style.fill = '#f83c40'; //light red
  } else if (user.heartRateZone(hrm.heartRate) == 'peak') {
    hrLabel.style.fill = '#f80070'; //pink
  } else if (user.heartRateZone(hrm.heartRate) == 'out-of-range') { 
    hrLabel.style.fill = '#38f8df'; //blue
  };
}

// Begin monitoring the sensor
hrm.start();

// Get a handle on the <text> elements
const timeLabel = document.getElementById("timeLabel");
let steps = document.getElementById("steps");
let dateLabel = document.getElementById("dateLabel");
let secLabel = document.getElementById("secLabel");
// console.log((today.local.steps || 0) + " steps");

// Update the <text> element every tick with the current time
let local_file;
// intervals to check vibrations
let found = false;
setInterval(function() {
  const currentDate = new Date();
  // vibrate and change to response screen at  9, 11, 13, 15, 17
  const currentHour = currentDate.getHours();
  // make vibration during first minute
  const vibrationTime = [9, 11, 13, 15, 17]
  if(!found && vibrationTime.indexOf(currentHour) != -1) {
      vibrate();
      found = true;
  } else if(vibrationTime.indexOf(currentHour) === -1){
      found = false;
  }  
}, 1200000);

clock.ontick = (evt) => {
  let today_dt = evt.date;
  let hours = today_dt.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.monoDigits(util.zeroPad(hours));
  };
  let mins = util.monoDigits(util.zeroPad(today_dt.getMinutes()));
  let secs = util.monoDigits(util.zeroPad(today_dt.getSeconds()));
  
  timeLabel.text = `${hours}:${mins}`;  
  secLabel.text = secs;
  
  let month = months[today_dt.getMonth()];
  let weekday = weekdays[today_dt.getDay()];
  let day = today_dt.getDate();
   
  dateLabel.text = `${weekday}, ${month} ${day}`;
  
  
  // Steps
  steps.text = `${(Math.floor(today.adjusted.steps/1000) || 0)}k`;
  if (steps.text >= (goals.steps || 0)) {
    steps.style.fill = '#b8fc68'; //green
  } else if (steps.text >= (goals.steps || 0)/2) {
    steps.style.fill = '#ffd733'; //yelow
  } else {
    steps.style.fill = '#f83478'; //pink
  };
  
  
  // Charge 

  //get screen width 
  let charge = battery.chargeLevel/100;
  chargeLabel.width = 300*charge;
  if (charge < 0.2) {
    chargeLabel.style.fill = '#f83c40'
  } else { 
    chargeLabel.style.fill = '#505050'
  }
}

let flowSelector
var flow=[showThankyou]
const allFlows = [showThermal, showLight, showNoise, showIndoor, showInOffice, showMood ]

messaging.peerSocket.onmessage = function(evt) {
  console.log("settings received on device");
  console.log(JSON.stringify(evt))
  console.log(evt.data.value.selected)
  flowSelector = evt.data.value.selected
  console.log("flow selector from peer socket is" , flowSelector)
  mapFlows(flowSelector)
  console.log("end message socket")
}


function processAllFiles() {
  let fileName;
  while (fileName = inbox.nextFile()) {
    console.log(`/private/data/${fileName} is now available`);
    let flowSelector_file = fs.readFileSync(`${fileName}`, "cbor");
    console.log(JSON.stringify(flowSelector_file));
    flowSelector = flowSelector_file.value.selected
    mapFlows(flowSelector)

  }
}


function mapFlows(flowSelector){
  flow=[]
  if (flowSelector) {
  flowSelector.map(index => flow.push(allFlows[index]))
  }
    flow.push(showThankyou)
  console.log(flow)
}


inbox.addEventListener("newfile", processAllFiles);
processAllFiles();

//TODO: Once the flow_selector can be sent to the device, use the index to modify the flow below
// messaging.peerSocket.addEventListener("message", (evt) => {
//   console.log(evt)
// })

// Array of functions to be automatically generated by settings TODO
// const flowSelector = JSON.parse(settingsStorage.getItem('flow_index'));
// console.log(flowSelector)

//flowSelector = [0, 1, 3] //this should come via the settings app

var currentView = 0 //current view of flow


// views
const clockface = document.getElementById("clockface");
const indoorOutdoor = document.getElementById("indoor-outdoor");
const inOffice = document.getElementById("inoffice");
const warmCold = document.getElementById("warm-cold");
const brightDim = document.getElementById("bright-dim");
const loudQuiet = document.getElementById("loud-quiet");
const happySad = document.getElementById("happy-sad");
const thankyou = document.getElementById("thankyou");
//Useed to set all views to none when switching between screens
const allViews = [clockface, indoorOutdoor, inOffice, warmCold, brightDim, loudQuiet, happySad, thankyou]


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
const thermal_comfy = document.getElementById('thermal_comfy')
const prefer_warm = document.getElementById("prefer_warm");
const prefer_cold = document.getElementById("prefer_cold");
// buttons
const noise_comfy = document.getElementById('noise_comfy')
const prefer_bright = document.getElementById("prefer_bright");
const prefer_dim = document.getElementById("prefer_dim");
// buttons
const light_comfy = document.getElementById('light_comfy')
const prefer_loud = document.getElementById("prefer_loud");
const prefer_quiet = document.getElementById("prefer_quiet");
// buttons
const neutral = document.getElementById('neutral')
const happy = document.getElementById("happy");
const sad = document.getElementById("sad");


function showThermal(){
  console.log("Showing Thermal Feedback");
  allViews.map(v => v.style.display = "none")
  warmCold.style.display = "inline"
  currentView++
}

function showLight(){
  allViews.map(v => v.style.display = "none")
  brightDim.style.display = "inline"
  currentView++
}

function showNoise(){
  allViews.map(v => v.style.display = "none")
  loudQuiet.style.display = "inline"
  currentView++
}

function showMood(){
  console.log("Showing mood Feedback");
  allViews.map(v => v.style.display = "none")
  happySad.style.display = "inline"
  currentView++
}

function showIndoor(){
  allViews.map(v => v.style.display = "none")
  indoorOutdoor.style.display = "inline"
  currentView++
}

function showInOffice(){
  allViews.map(v => v.style.display = "none")
  inOffice.style.display = "inline"
  currentView++
}

function showThankyou(){
  allViews.map(v => v.style.display = "none")
  clockface.style.display = "inline"
  thankyou.style.display = "inline"
  sendEventIfReady(feedback_data)
  feedback_data = {}
  setTimeout(()=>{showClock()}, 2000)
  currentView=0
}


function showClock(){
  allViews.map(v => v.style.display = "none")
  clockface.style.display = "inline"
  currentView=0
}

//Global variable for handling feedback_data TODO: Check if there's a better way
var feedback_data

function initiateFeedbackData() {
  const isoDate = new Date().toISOString();
  feedback_data = {
    isoDate,
    heartRate: hrm.heartRate,
  }

}

// on click events
comfy.addEventListener("click", () => {
  console.log("comfy clicked")
  
  initiateFeedbackData();
  feedback_data.comfort = "comfy"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
  //console.log(flow[currentView]())
  // clockface.style.display = "none";
  // indoorOutdoor.style.display = "inline";
});
notComfy.addEventListener("click", () => {
  console.log("not comfy clicked")
  
  initiateFeedbackData();
  feedback_data.comfort = "notComfy"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
  // clockface.style.display = "none";
  // indoorOutdoor.style.display = "inline";
});

// on click events
indoor.addEventListener("click", () => {
  feedback_data.indoorOutdoor = "indoor"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
  // indoorOutdoor.style.display = "none";
  // warmCold.style.display = "inline";
});

outdoor.addEventListener("click", () => {
  feedback_data.indoorOutdoor = "outdoor"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
  // indoorOutdoor.style.display = "none";
  // warmCold.style.display = "inline";
});

// on click events
in_office.addEventListener("click", () => {
  feedback_data.inOffice = "inOffice"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
  // indoorOutdoor.style.display = "none";
  // warmCold.style.display = "inline";
});

out_office.addEventListener("click", () => {
  feedback_data.inOffice = "outOffice"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
  // indoorOutdoor.style.display = "none";
  // warmCold.style.display = "inline";
});

// on click events

thermal_comfy.addEventListener("click", () => {
  console.log("thermal comfy clicked");
  feedback_data.thermal = "comfy";
  console.log(JSON.stringify(feedback_data));
  flow[currentView]()
})

prefer_warm.addEventListener("click", () => {
  feedback_data.thermal = "tooCold"
  flow[currentView]()
});

prefer_cold.addEventListener("click", () => {
  feedback_data.thermal = "tooHot"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
});

// on click events

light_comfy.addEventListener("click", () => {
  feedback_data.light = "comfy"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
})

prefer_bright.addEventListener("click", () => {
  feedback_data.light = "tooDim"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
});

prefer_dim.addEventListener("click", () => {
  feedback_data.light = "tooBright"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
});

// on click events

noise_comfy.addEventListener("click", () => {
  feedback_data.noise = "comfy"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
})

prefer_loud.addEventListener("click", () => {
  feedback_data.noise = "tooQuiet"
  flow[currentView]()
});

prefer_quiet.addEventListener("click", () => {
  console.log(JSON.stringify(feedback_data))
  feedback_data.noise = "tooLoud"
  flow[currentView]()
});

// on click events

neutral.addEventListener("click", () => {
  feedback_data.mood = "neutral"
  console.log(JSON.stringify(feedback_data))
  flow[currentView]()
})

happy.addEventListener("click", () => {
  console.log(JSON.stringify(feedback_data))
  feedback_data.mood = "positive"
  flow[currentView]()
});

sad.addEventListener("click", () => {
  console.log(JSON.stringify(feedback_data))
  feedback_data.mood = "negative"
  flow[currentView]()
});






// button to make an action, not working code
console.log("pj was here!")
//const btn = document.getElementById("btn");
const clockFace = document.getElementById("clockFace");
const feedBack = document.getElementById("feedBack");
/* Location I'm now (Indoor) (Outdoor) */
const location = document.getElementById("location");

/* current status(cold, comfy, hot) */
var status = null;

/* On click hide main clockface
and show feedback screen */
// btn.addEventListener("click", () => {
//  clockFace.style.display = "none";
//   feedBack.style.display = "inline";
// });

/* Screen change functions */
// function showLocationFeedback() {
//   console.log("showing location feedback")
//   feedBack.style.display = "none";
//   location.style.display = "inline";
// }

// function backToClockface() {
//   location.style.display = "none";
//   clockFace.style.display = "inline";
// }

// //Buttons send a requests to server
// const cold = document.getElementById("cold");
// cold.addEventListener("click", () => {
//   //showLocationFeedback()
//   status = 'tooCold';
//   feedBack.style.display = "none";
//   clockFace.style.display = "inline";
//   sendEventIfReady(status, null);
// });

// const comfy = document.getElementById("comfy");
// comfy.addEventListener("click", () => {
//   //showLocationFeedback()
//   status = 'comfy';
//   feedBack.style.display = "none";
//   clockFace.style.display = "inline";
//   sendEventIfReady(status, null);
// });

// const hot = document.getElementById("hot");
// hot.addEventListener("click", () => {
//   //showLocationFeedback()
//   status = 'tooHot';
//   feedBack.style.display = "none";
//   clockFace.style.display = "inline";
//   sendEventIfReady(status, null);
// });

/* when user press indoor, isIndoor value set to true */
/*
const indoor = document.getElementById("indoor");
indoor.addEventListener("click", () => {
  sendEventIfReady(status, true);
});
const outdoor = document.getElementById("outdoor");
outdoor.addEventListener("click", () => {
  sendEventIfReady(status, false);
});
*/

function sendEventIfReady(feedback_data) {
  console.log("sending feedback_data")
  console.log(JSON.stringify(feedback_data))
  //backToClockface();

  
  // let data = {
  //   eventName,
  //   isIndoor,
  //   isoDate,
  //   heartRate: hrm.heartRate,
  // }

  //set timeout of gps aquisition to 10 seconds
  geolocation.getCurrentPosition(locationSuccess, locationError, {timeout: 10000});
  
  function locationSuccess(position) {
    console.log("location success")
    feedback_data.lat = position.coords.latitude,
    feedback_data.lon = position.coords.longitude,
    sendDataToCompanion(feedback_data);
  }

  function locationError(error) {
    console.log("location fail")
    feedback_data.lat = null,
    feedback_data.lon = null,
    sendDataToCompanion(feedback_data);
  }
}

// vibrate for 3 sec and change screen to reponse
function vibrate() {
  vibration.start("ring");

  //Change main clock face to response screen
  clockFace.style.display = "none";
  feedBack.style.display = "inline";
  
  //Stop vibration
  setTimeout(function(){
    vibration.stop()
  }, 5000);
}

function sendDataToCompanion(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // if setLocation value is true then companion will set location
    data.setLocation = true;
    messaging.peerSocket.send(data);
    console.log("data sent directly to companion")
    
    //remove data to prevent it beint sent twice
    data=null

    // read files saved during offline and send all on by one
    try {
      local_file = fs.readFileSync("local.txt", "json");
      for(let elem of local_file) {
        messaging.peerSocket.send(elem);
        console.log("data sent from: " + elem.isoDate + "sent to companion" );
      }
      // delete local file
      fs.unlinkSync("local.txt")
    } catch(err) {
      console.log(err)
    }
  } else {
    // try to read file with local data
    console.log("connection to companion not found, storing locally")
    try {
      console.log("checking if local file exists")
      local_file = fs.readFileSync("local.txt", "json");
    } catch(err) {
      // if can't read set local file to empty
      console.log("creating empty local.txt file")
      local_file = []
    } 
    // push new reponce and save
    console.log("pushing new data to local file")
    local_file.push(data)

    fs.writeFileSync("local.txt", local_file, "json");
  }
}

messaging.peerSocket.onopen = function() {
  // Have an event listener so that the moment a connection is open, files upload
  // read files saved during offline and send all on by one
  console.log("peer socket to companion opened")
    try {
      local_file = fs.readFileSync("local.txt", "json");
      for(let elem of local_file) {
        messaging.peerSocket.send(elem);
        console.log("data sent from: " + elem.isoDate + "sent to companion" );
      }
      // delete local file
      fs.unlinkSync("local.txt")
    } catch(err) {
      console.log(err)
    }
}