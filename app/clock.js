/*
This code takes care of displaying the time and date to the user.
It also displays the steps walked, the HR and the battery charge level.

When in debugging mode, i.e., isProduction = False the time and date are
not displayed and instead that area is used to display possible errors.
*/

import clock from "clock";
import document from "document";
import {preferences} from "user-settings";
import {goals, today} from "user-activity";
import {battery} from "power";
import {memory} from "system";

// import custom built modules
import {isProduction} from "./options";
import * as util from "../common/utils";

const months = {
    0: "Jan", 1: "Feb", 2: "Mar", 3: 'Apr', 4: "May", 5: 'Jun',
    6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"
};

const weekdays = {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: 'Sat', 0: 'Sun'};

// Update the clock every minute
clock.granularity = 'seconds';

const chargeLabel = document.getElementById("chargeLabel");
const timeLabel = document.getElementById("timeLabel");
const steps = document.getElementById("steps");
const dateLabel = document.getElementById("dateLabel");
const secLabel = document.getElementById("secLabel");
const memoryLabel = document.getElementById("memoryLabel");
const errorLabel = document.getElementById("errorLabel");
const bodyErrorLabel = errorLabel.getElementById("copy");

if (!isProduction) {
    timeLabel.style.display = "none";
    dateLabel.style.display = "none";
    secLabel.style.display = "none";
}

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
            if (!isProduction) {
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
        if (!isProduction) {
            bodyErrorLabel.text = bodyErrorLabel.text + "Battery : " + e;
        }
    }

    // show memory utilization
    if (!isProduction) {
        memoryLabel.text = "memory usage = " + Math.round(memory.js.used / memory.js.total * 100) + " %";
    }
};