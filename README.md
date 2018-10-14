# Fitbit Versa ClockFace (fitbit-hotorcold-app)

— The clock face has two parts:

- The top part is a digital time, date, heartbeat, and step count. 
- The bottom part has a button — when this button is tapped on the clock face, it goes to a screen that will have three colored buttons. The first button (on the top) is blue and say “too cold”, the middle is green and say “comfy” and the last one (on the bottom) say “too hot”. 
- When the user picks one of the buttons, the clock face goes back to the original setting. On the backend, the clock face sends a response to the server [http://104.248.132.164:7070](http://104.248.132.164:7070).

# Install  ClockFace to your own Fitbit Versa

— The app is available only by the link for now. To install ClockFace follow the link [https://gam.fitbit.com/gallery/clock/731497ca-5e7c-4383-a702-18330587d048](https://gam.fitbit.com/gallery/clock/731497ca-5e7c-4383-a702-18330587d048) on your phone, it will redirect to FitBit app gallery.
— In order to send data to the server from FitBit device:
- watch should be connected to the phone via Bluetooth
- To track user id, user should login first in settings of the clock face
![screen-example](./screen/image3.png)
![screen-example](./screen/image4.png)

— If you want to get records from the server:

- To get CSV go to [http://104.248.132.164:7070](http://104.248.132.164:7070)
- It is possible to get JSON, but data format might be different. In order to get JSON, go to [http://104.248.132.164:7070/test](http://104.248.132.164:7070/test) and right mouse click and chose "Save as".

# Screenshot
![screen-example](./screen/image1.png)
![screen-example](./screen/image2.png)

# To run the project on your computer (windows)
  - Create a Fitbit account. [Sign up here](https://www.fitbit.com/signup).
  - Install Fitbit OS Simulator for [Windows](https://simulator-updates.fitbit.com/download/latest/win)
  - Create an empty project in [Fitbit Studio](https://studio.fitbit.com/projects).
  - Download current repository files and add all files to newly created project in Fitbit Studio
  - Launch **OS Simulator**, connect to simulator from **Fitbit Studio**, and launch the project from **Fitbit Studio**
  - Also you need to update FitBit app clientId and clientSecret in "settings/indexjsx" file
 
To get started with ClockFace development or to launch project read more at [Fitbit Developer Website](https://dev.fitbit.com/getting-started/).

If you want device to listen for HTTP request from the server. For example, ask the person to give a feedback once a day based on a signal from the server. It is tricky to implement and needed to be discussed. Please read [here](https://community.fitbit.com/t5/SDK-Development/How-to-make-device-listen-for-http-request-from-the-server/td-p/2963102)

[This link](https://github.com/Fitbit/ossapps) may be useful. A non-exhaustive list of open sourced clock faces, applications and modules from the community.
© 2018
