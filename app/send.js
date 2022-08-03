/*
This code sends the survey completed by the user to the companion app.
*/

import fs from "fs";
import document from "document";
import {
    geolocation
} from "geolocation";
import {
    memory
} from "system";
import {
    outbox
} from "file-transfer"
import {
    peerSocket
} from "messaging";

// import custom built modules
import {
    isProduction
} from "./options";

const storageLabel = document.getElementById("storageLabel");
const voteLogLabel = document.getElementById("voteLogLabel");
const voteLogPeerTransferLabel = document.getElementById("voteLogPeerTransferLabel");
const voteLogFileTransferLabel = document.getElementById("voteLogFileTransferLabel");

let voteLog; // Global variable for handling vote logs
let voteLogPeerTransfer = 0; // Global variable for handling vote logs
let voteLogFileTransfer = 0; // Global variable for handling vote logs

//-------- COMPILE DATA AND SEND TO COMPANION  -----------
export function sendEventIfReady(_feedbackData) {
    console.log(JSON.stringify(_feedbackData));

    console.log("Fitbit memory usage: " + memory.js.used + ", of the available: " + memory.js.total);
    // set timeout of gps https://dev.fitbit.com/build/reference/device-api/geolocation/
    console.log("Getting GPS location ... it may take a couple of minutes");
    geolocation.getCurrentPosition(locationSuccess, locationError, {
        timeout: 4 * 60 * 1000,
        maximumAge: 4 * 60 * 1000
    });

    // reading log file for debugging purposes
    try {
        voteLog = fs.readFileSync("votelog.txt", "json");
    } catch (e) {
        // if can't read set local file to empty
        console.log("creating empty votelog.txt file");
        voteLog = [0]
    }
    // Incremement the vote log by one
    voteLog[0]++;
    // console.log("Vote log: " + voteLog[0]);
    if (!isProduction) {
        voteLogLabel.text = voteLog + 'vl;';
    }
    // add the votelog to the feedback data json
    _feedbackData['voteLog'] = voteLog[0];
    // store the votelog on the device as votelog.txt
    fs.writeFileSync("votelog.txt", voteLog, "json");

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

    if (JSON.stringify(data).length > (peerSocket.MAX_MESSAGE_SIZE - 200)) {
        console.log('The message you are sending has a length of : ' + JSON.stringify(data).length + "but you can only send messages up to this size" + peerSocket.MAX_MESSAGE_SIZE);
    }

    if (peerSocket.readyState === peerSocket.OPEN) {

        console.log("data sent via Peer Socket");
        peerSocket.send(data);

        if (!isProduction) {
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

        if (!isProduction) {
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