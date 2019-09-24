import * as messaging from "messaging";
import { settingsStorage} from "settings";
import { me } from "companion";

import * as cbor from "cbor";
import { outbox } from "file-transfer";
import { settingsPrefix } from "../common/constants";


//-------- SENDING SETTINGS DATA TO WATCH -----------

//Send Settings Data to Fitbit
// All guns blazing. Using every possible command in the fitbit environment to get the message across
// There might be a way to make this less extreme, but so far this is the only way to garuntee the communication


// Fire when settings are changed on phone
settingsStorage.onchange = function(evt) {
  console.log(evt.key)
  console.log("settings storage on change fired (route 1), sending value");
  sendValue(evt.key, evt.newValue);
}

//Fire via event listner of settings storage
settingsStorage.addEventListener("change", function(){
  console.log("settings storage via addEventListner fired (route 2 - disabled). No code here")
  //nothing for now, however this could be another method
});

// Fire when innactive and settings change has been detected via reasons
if (me.launchReasons.settingsChanged) {
  // Currently deactivating as it might be the reason for teh settings resetting during sleep
   console.log("settings changed launch reasons fired (route 3 - disabled), code temporarily disabled");

}

//The ammunition that gets fired from each of the three guns above
function sendValue(key, val) {
  if (val) {
    // check that the change was a change in the flow
    if(key=="flow_index"){

      var sendTime = new Date().getTime();
      sendSettingData({
        key: key,
        value: JSON.parse(val),
        time: sendTime
      });
    }else{
      console.log("change made was not related to the flow")
    }
  }
}

//Fire via both peer socket artilary cannon, and outbox guided missile 
function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.log(data)
    messaging.peerSocket.send({data: data.value.selected, time: data.time});
    console.log("data sent from companion")
  } else {
    // Note that the index.js is checking the time, and will only update via file transfer if the time made in data.time is greater
    console.log("No peerSocket connection. Attempting to send via file transfer");

      //Fire the Guideed Missile via outbox Woosh
      outbox.enqueue('flow_index.cbor', cbor.encode({data: data.value.selected, time: data.time}))
        .then((ft) => {
          console.log(`Transfer of ${ft.name} successfully queued.`);
          })
        .catch(error => {
          console.log(`Failed to queue settings for ${evt.key}. Error: ${error}`);
        });
  }

}

//-------- END (SENDING SETTINGS DATA TO WATCH) -----------

//-------- SENDING DATA TO AWS -----------

//Listen for peer socket from fitbit to send data to budslab.me
messaging.peerSocket.addEventListener("message", (evt) => {
  //get user id
  const user_id = JSON.parse(settingsStorage.getItem('user_id')).name;

  
  const experiment_id = JSON.parse(settingsStorage.getItem('experiment_id')).name;
  //get experiment id and set empty value to "default"
  // try {
  //   experiment_id = JSON.parse(settingsStorage.getItem('experiment_id')).name;
  // } catch {
  //   console.log("experiment id not defined, setting default")
  //   experiment_id = "default"
  // }

  evt.data.user_id = user_id
  console.log("user id is " + user_id);
  evt.data.experiment_id = experiment_id
  console.log("experiment id is " + experiment_id);
  
  if (evt.data) {
  // get location 
      // AWS API gateway link, triggers lambda function
      let url = `https://ay1bwnlt74.execute-api.us-east-1.amazonaws.com/test`

      
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(evt.data)
      })
      .then(res => {
          console.log("sent data")
          console.log(JSON.stringify(evt.data))
          console.log(JSON.stringify(res))
          console.log(res.body)
          console.log(res.status);
      })
      .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ', error.message);
      });

  } else {
    console.log("Error! Can not send request to server.")
  }
});