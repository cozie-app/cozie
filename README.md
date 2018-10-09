# Fitbit Versa ClockFace (fitbit-hotorcold-app)

The clock face has two parts:

— The top part is a digital time, date, heartbeat, and step count. 
- The bottom part has a button — when this button is tapped on the clock face, it goes to a screen that will have three colored square buttons. The first square (on the left) is blue and say “too cold”, the middle is green and say “comfy” and the last one (on the right) say “too hot”. 
- When the user picks one of the buttons, the clock face goes back to the original setting. On the backend, the clock face sends a response to the server **http://localhost:7070/** (for now it is localhost).

If you want device to listen for HTTP request from the server. For example, ask the person to give a feedback once a day based on a signal from the server. It is tricky to implement and needed to be discussed. Please read [here](https://community.fitbit.com/t5/SDK-Development/How-to-make-device-listen-for-http-request-from-the-server/td-p/2963102)

# Screenshot
![screen-example](./screen/image1.png)
![screen-example](./screen/image2.png)

# To run the project on your computer (windows)
  - Create a Fitbit account. [Sign up here](https://www.fitbit.com/signup).
  - Install Fitbit OS Simulator for [Windows](https://simulator-updates.fitbit.com/download/latest/win)
  - Create an empty project in [Fitbit Studio](https://studio.fitbit.com/projects).
  - Download current repository files and add all files to newly created project in Fitbit Studio
  - Launch **OS Simulator**, connect to simulator from **Fitbit Studio**, and launch the project from **Fitbit Studio**
 
To get started with ClockFace development or to launch project read more at [Fitbit Developer Website](https://dev.fitbit.com/getting-started/).

[This link](https://github.com/Fitbit/ossapps) may be useful. A non-exhaustive list of open sourced clock faces, applications and modules from the community.
© 2018
