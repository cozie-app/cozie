import * as messaging from "messaging";
import {settingsStorage} from "settings";
import {me} from "companion";
import * as cbor from "cbor";
import {outbox} from "file-transfer";
import {inbox} from "file-transfer";

//-------- SENDING SETTINGS DATA TO WATCH -----------
//Send Settings Data to Fitbit

// Fire when settings are changed on phone
settingsStorage.onchange = function (evt) {
    console.log(evt.key);
    console.log("settings storage on change fired (route 1), sending value");
    sendValue(evt.key, evt.newValue);
};

//Fire via event listener of settings storage
settingsStorage.addEventListener("change", function () {
    console.log("settings storage via addEventListner fired (route 2 - disabled). No code here")
    //nothing for now, however this could be another method
});

// Fire when inactive and settings change has been detected via reasons
if (me.launchReasons.settingsChanged) {
    // Currently deactivating as it might be the reason for teh settings resetting during sleep
    console.log("settings changed launch reasons fired (route 3 - disabled), code temporarily disabled");

}

//The ammunition that gets fired from each of the three guns above
function sendValue(key, val) {
    if (val) {
        // check that the change was a change in the flow
        if (key === "flow_index" || key === "buzz_time") {
            var sendTime = new Date().getTime();
            sendSettingData({
                key: key,
                value: JSON.parse(val),
                time: sendTime
            });
        } else {
            console.log("change made was not related to the flow")
        }
    }
}

//Fire via both peer socket artilary cannon, and outbox guided missile 
function sendSettingData(data) {
    // If we have a MessageSocket, send the data to the device
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log(data);
        messaging.peerSocket.send({data: data.value.selected, time: data.time, key: data.key});
        console.log("data sent from companion")
    } else {
        // Note that the index.js is checking the time, and will only update via file transfer if the time made in data.time is greater
        console.log("No peerSocket connection. Attempting to send via file transfer");

        //Fire the Guideed Missile via outbox Woosh
        outbox.enqueue('flow_index.cbor', cbor.encode({data: data.value.selected, time: data.time, key: data.key}))
            .then((ft) => {
                console.log(`Transfer of ${ft.name} successfully queued.`);
            })
            .catch(error => {
                console.log(`Failed to queue settings for ${evt.key}. Error: ${error}`);
            });
    }
}

//-------- END (SENDING SETTINGS DATA TO WATCH) -----------

//-------- READING DATA FROM WATCH -----------

//Listen for peer socket from fitbit to send data to budslab.me
messaging.peerSocket.addEventListener("message", (evt) => {
    //get user id
    if (evt.data) {
        // get location
        // AWS API gateway link, triggers lambda function
        sendDataToInflux(evt.data)
    } else {
        console.log("Error! Can not send request to server.")
    }
});


// receive message via inbox
async function processAllFiles() {
    console.log("recieving file from fitbit");

    let file;

    while ((file = await inbox.pop())) {
        const input_data_file = JSON.parse(await file.text());
        //console.log(`file contents: ${input_data_file}`);
        input_data_file.map(data => {
            console.log("preparing to send data to influx");
            sendDataToInflux(data);
        });
        //console.log(`file contents: ${JSON.stringify(input_data_file)}`);
    }
}

// Process new files as they are received
inbox.addEventListener("newfile", processAllFiles);

// Also process any files that arrived when the companion wasn’t running
processAllFiles();

//-------- END (READING DATA FROM WATCH) -----------

//-------- SENDING DATA TO AWS -----------

function sendDataToInflux(data) {

    let url = `https://ay1bwnlt74.execute-api.us-east-1.amazonaws.com/test`;

    //get experiment id and set empty value to "default"
    // try {
    //   experiment_id = JSON.parse(settingsStorage.getItem('experiment_id')).name;
    // } catch {
    //   console.log("experiment id not defined, setting default")
    //   experiment_id = "default"
    // }
    let user_id = "";
    let experiment_id = "";
    // if user_id is not defined then assign the value undefined
    try {user_id = JSON.parse(settingsStorage.getItem('user_id')).name;}
    catch (error) {
        if (error instanceof TypeError) {
            user_id = "undefined"
    }}

    try {experiment_id = JSON.parse(settingsStorage.getItem('experiment_id')).name;}
    catch (error) {
        if (error instanceof TypeError) {
            experiment_id = "undefined"
    }}

    data.user_id = user_id;
    data.experiment_id = experiment_id;

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            console.log("sent data");
            console.log(JSON.stringify(data));
            console.log(JSON.stringify(res));
            console.log(JSON.stringify(res.body));
            console.log(res.status);
            if (res.status !== 200) {
                sendSettingData({
                    key: 'error',
                    value: {selected: {type: "fetchErr", message: res.status}},
                    time: new Date().getTime()
                });
            }
        })
        .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
            sendSettingData({
                key: 'error',
                value: {selected: {type: "fetchErr", message: error.message}},
                time: new Date().getTime()
            });
        });
}