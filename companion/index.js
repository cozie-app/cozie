import * as messaging from "messaging";

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data) {
    let url = `http://localhost:7070/`
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