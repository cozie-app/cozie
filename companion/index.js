import * as messaging from "messaging";
import { settingsStorage} from "settings";
import { me } from "companion";

import * as cbor from "cbor";
import { outbox } from "file-transfer";
import { settingsPrefix } from "../common/constants";

//Send Settings Data to Fitbit



let storage_key = "flow_index";

// Settings have been changed
settingsStorage.onchange = function(evt) {
  console.log("settings storage on change fired");
  sendValue(evt.key, evt.newValue);
}

settingsStorage.addEventListener("change", function(){
  console.log("settings storage via addEventListner fired")
});

// Settings were changed while the companion was not running
if (me.launchReasons.settingsChanged) {
  // Send the value of the setting
   console.log("settings changed launch reasons fired");
   console.log(settingsStorage.getItem(storage_key))
  sendValue(storage_key, settingsStorage.getItem(storage_key));
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}
function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
    console.log("data sent from companion")
  } else {
    console.log("No peerSocket connection");
  }

  outbox.enqueue('flow_index.cbor', cbor.encode(data))
        .catch(error => {
          console.log(`Failed to queue settings for ${evt.key}. Error: ${error}`);
        });
}


messaging.peerSocket.addEventListener("message", (evt) => {
  //to get user_id from fitbit account, login in settings from mobile device 
  let user_id = settingsStorage.getItem('user_id');
  evt.data.user_id = user_id
  console.log("user id is " + user_id);
  
  if (evt.data) {
  // get location 
      let url = `https://budslab.me`

      
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
          console.log(res.status);
      })
      .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ', error.message);
      });

  } else {
    console.log("Error! Can not send request to server.")
  }
});