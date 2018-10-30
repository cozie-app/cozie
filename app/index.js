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
  steps.text = (today.adjusted.steps || 0);
  if (steps.text >= (goals.steps || 0)) {
    steps.style.fill = '#b8fc68'; //green
  } else if (steps.text >= (goals.steps || 0)/2) {
    steps.style.fill = '#ffd733'; //yelow
  } else {
    steps.style.fill = '#f83478'; //pink
  };
  
  
  // Charge 
  let charge = battery.chargeLevel/100;
  chargeLabel.width = 300*charge;
  if (charge < 0.2) {
    chargeLabel.style.fill = '#f83c40'
  } else { 
    chargeLabel.style.fill = '#505050'}
}


// button to make an action, not working code
const btn = document.getElementById("btn");
const clockFace = document.getElementById("clockFace");
const feedBack = document.getElementById("feedBack");

/* On click hide main clockface
and show feedback screen */
btn.addEventListener("click", () => {
  clockFace.style.display = "none";
  feedBack.style.display = "inline";
});

//Buttons send a requests to server
const cold = document.getElementById("cold");
cold.addEventListener("click", () => {
  sendEventIfReady('tooCold');
});

const comfy = document.getElementById("comfy");
comfy.addEventListener("click", () => {
  sendEventIfReady('comfy');
});

const hot = document.getElementById("hot");
hot.addEventListener("click", () => {
  sendEventIfReady('tooHot');
});

function backToClockface() {
  clockFace.style.display = "inline";
  feedBack.style.display = "none";
}

function sendEventIfReady(eventName) {
  backToClockface();
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      eventName: eventName
    });
  }
  
}

setInterval(function() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({eventName: 'check' });
  }
  // Check every 30 min
}, 1800000);

//When companion sends a message
messaging.peerSocket.onmessage = evt => {
  vibration.start("ring");

  //Change main clock face to response screen
  clockFace.style.display = "none";
  feedBack.style.display = "inline";
  
  //Stop vibration
  setTimeout(function(){
    vibration.stop()
  }, 3000);
}



