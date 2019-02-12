[![](http://www.budslab.org/buds-lab.github.io/budslab_banner.png)](http://www.budslab.org/)

# Project structure
— This guide explains the underlying structure of current and other Fitbit applications, and how the various elements are related. [dev.fitbit.com/build/guides/application/](https://dev.fitbit.com/build/guides/application/)
— To get started with ClockFace development or to launch project read more at [Fitbit Developer Website](https://dev.fitbit.com/getting-started/).


Supported Devices: Ionic, Versa
The app is available by the link. To install ClockFace follow the link https://gam.fitbit.com/gallery/clock/731497ca-5e7c-4383-a702-18330587d048 on your phone, it will redirect to FitBit app gallery.


— The clock face has two parts:

- The top part is a digital time, date, heartbeat, and step count. 
- The bottom part has a button — when this button is tapped on the clock face, it goes to a screen that will have three colored buttons. The first button (on the top) is blue and say “too cold”, the middle is green and say “comfy” and the last one (on the bottom) say “too hot”. 
- After the user picks one of the buttons (too cold/comfy/too hot) ~~and (indoor/outdoor)~~, the clock face goes back to the original setting. On the backend, the clock face sends a POST request to the server [https://budslab.me](https://budslab.me). Request with a JSON body has "user_id", "eventName", "lon", "lat",~~"isIndoor"~~keys. To get the location device use smartphone GPS, it means latitude and longitude will be null if there is no connection to phone with GPS. 
-- eventName is a string value (tooCold/comfy/tooHot)
~~-- isIndoor is a boolean value (true/false)~~
- At 9, 11, 13, 15, 17(according to device settings) device will vibrate for 3 seconds and change to response screen with too cold/comfy/too hot buttons.
- Responses made without mobile phone connection will be saved on the Fitbit device memory and will be sent to the server when the user respond next time with phone and internet connection.

# Install  ClockFace to your own Fitbit Versa

— The app is available only by the link for now. To install ClockFace follow the link [https://gam.fitbit.com/gallery/clock/731497ca-5e7c-4383-a702-18330587d048](https://gam.fitbit.com/gallery/clock/731497ca-5e7c-4383-a702-18330587d048) on your phone, it will redirect to FitBit app gallery.

— In order to send data to the server from the FitBit device:
- the watch should be connected to the phone via Bluetooth and the phone should have the internet
- If Responses made without connection to the mobile phone, data will be saved locally on Fitbit device memory and will be sent to the server when the user respond next time with phone and internet connection.
- To track user id user should log in first in settings of the clock face. As shown below.

![screen-example](./screen/image3.jpg)
![screen-example](./screen/image4.jpg)

— If you want to get records from the server:
- Time stored in UTC, it should be converted
- To get CSV go to [http://54.169.153.174:7070](http://54.169.153.174:7070)
- It is possible to get JSON, but the data format might be different. In order to get JSON, go to [http://54.169.153.174:7070/test](http://54.169.153.174:7070/test) and right mouse click and chose "Save as".

# Screenshot
![screen-example](./screen/image1.png)
![screen-example](./screen/image2.png)
# To run the project on your computer (windows)
  - Create a Fitbit account. [Sign up here](https://www.fitbit.com/signup).
  - Install Fitbit OS Simulator for [Windows](https://simulator-updates.fitbit.com/download/latest/win)
  - Create an empty project in [Fitbit Studio](https://studio.fitbit.com/projects).
  - Download current repository files and add all files to the newly created project in Fitbit Studio
  - Launch **OS Simulator**, connect to simulator from **Fitbit Studio**, and launch the project from **Fitbit Studio**
  - Also you need to update FitBit app clientId and clientSecret in "settings/indexjsx" file
# Good to know about fibit device/companion API
--- How to make device listen for http request from the server.  [here](https://community.fitbit.com/t5/SDK-Development/How-to-make-device-listen-for-http-request-from-the-server/td-p/2963102)
--- clock.ontick doesn't happen when the display is off. Use setTimeout.
--- To send request to the server use HTTPS endpoint.

https://github.com/gedankenstuecke/Minimal-Clock was used as a starter template.

[This link](https://github.com/Fitbit/ossapps) may be useful. A non-exhaustive list of open sourced clock faces, applications, and modules from the community.
© 2018 
