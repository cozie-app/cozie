import * as messaging from "messaging";
import { geolocation } from "geolocation";
import {
	settingsStorage
} from "settings";
import {
	me
} from "companion"

messaging.peerSocket.addEventListener("message", (evt) => {
	//to get user_id from fitbit account, login in settings from mobile device 
	let user_id = settingsStorage.getItem('user_id');
	evt.data.user_id = user_id
  
  if (evt.data) {
	// get location 
    geolocation.getCurrentPosition(function(position) {
      let url = `https://budslab.me`
      
      evt.data.lat = position.coords.latitude
      evt.data.lon = position.coords.longitude
      
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(evt.data)
      });
    })
	} else {
		console.log("Error! Can not send request to server.")
	}
});