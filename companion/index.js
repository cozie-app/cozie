import {peerSocket} from "messaging";
import {settingsStorage} from "settings";
import {me} from "companion";
import * as cbor from "cbor";
import {outbox, inbox} from "file-transfer";

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
    console.log("settings storage via addEventListener fired (route 2 - disabled). No code here")
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

//Fire via both peer socket artillery cannon, and outbox guided missile
function sendSettingData(data) {
    // If we have a MessageSocket, send the data to the device
    if (peerSocket.readyState === peerSocket.OPEN) {
        // console.log(data);
        peerSocket.send({data: data.value.selected, time: data.time, key: data.key});
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

//Listen for peer socket from fitbit to send data to Influx
peerSocket.addEventListener("message", (evt) => {
    //get user id
    if (evt.data) {
        // AWS API gateway link, triggers lambda function
        console.log('data recieved at companion, preparing to send to influx')
        sendDataToInflux(evt.data)
    } else {
        console.log("Error! Can not send request to server.")
    }
});


// receive message via inbox
async function processAllFiles() {
    console.log("receiving file from fitbit");

    let file;

    while ((file = await inbox.pop())) {
        const input_data_file = JSON.parse(await file.text());
        //console.log(`file contents: ${input_data_file}`);
        console.log("preparing to send data to DB received from File Transfer");
        input_data_file.map(data => {
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

    let url = `https://0cs0bcauyc.execute-api.us-east-1.amazonaws.com/default/write-coziePublic-fitbitAPI`;

    let user_id = "";
    let experiment_id = "";
    let api_key;
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

    try {api_key = JSON.parse(settingsStorage.getItem('api_key')).name}
    catch (error) {
        api_key = "UBQpWptj9HaBJVAVEDOZ14aQoNh7EpTK9zccvBTa"
    }

    try {api_key = JSON.parse(settingsStorage.getItem('api_key')).name}
    catch (error) {
        api_key = "UBQpWptj9HaBJVAVEDOZ14aQoNh7EpTK9zccvBTa"
    }

    data.user_id = user_id;
    data.experiment_id = experiment_id;

    fetch(url, {
        method: "POST",
        credentials: 'include',
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "x-api-key": api_key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(res => {
            console.log("Sending data to DB ...");
            console.log(JSON.stringify(data));
            console.log('POST request status code: ' + res.status);
            if (res.status === 200) {
                console.log("Successfully sent data to DB!");
            }
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
