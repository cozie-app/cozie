import * as messaging from "messaging";
import { settingsStorage } from "settings";

messaging.peerSocket.addEventListener("message", (evt) => {
  //to get user_id from fitbit account, login in settings from mobile device 
  let user_id = settingsStorage.getItem('user_id');
  evt.data.user_id = user_id

  if (evt.data) {
    let url = `http://104.248.132.164:7070`
    fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(evt.data)
    });
  } else {
    console.log("Error! Can not send request to server.")
  }
});