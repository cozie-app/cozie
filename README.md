
# Website with links to download

https://cozie.app/

# Tutorials

Video Tutorials: https://www.youtube.com/playlist?list=PLkQs5WJXVHbiBDjmv-1tBYNUQOkmNCctA

Wiki: https://github.com/buds-lab/cozie/wiki/Cozie-Development-Guide

# Download

Latest Stable Release: https://gallery.fitbit.com/details/512ce6c5-f633-4f7b-853c-891869f5e3d8

Beta Development Version: https://gallery.fitbit.com/details/d787c911-ce11-432e-8b68-69da0f3446c8

Website: https://cozie.app/


# Colaborating using git and fitbit

1. first ensure that you have the latest nodejs installation https://nodejs.org/en/
2. clone the repo `git clone git@github.com:buds-lab/fitbit-hotorcold-app.git`
3. `cd fitbit-hotcold-app`
4. `npm install`

### Building and installing

1. `npx fitbut-build` will build the project
2. `npx fitbit` opens the browser, and logs into your fitbit account. From here you can connect to devices and install the app


# Project structure
— This guide explains the underlying structure of current and other Fitbit applications, and how the various elements are related. [dev.fitbit.com/build/guides/application/](https://dev.fitbit.com/build/guides/application/)
— To get started with ClockFace development or to launch project read more at [Fitbit Developer Website](https://dev.fitbit.com/getting-started/). 


Supported Devices: Ionic, Versa, Versa-Lite, Versa 2
The app is available by the link. To install ClockFace follow the link https://gam.fitbit.com/gallery/clock/731497ca-5e7c-4383-a702-18330587d048 on your phone, it will redirect to FitBit app gallery.

# Document structure saved in InfluxDB

```python
{
"startFeedback":"2019-11-22T01:57:14.342Z",  # Timestamp when the user started the survey (i.e. pressed one of the two buttons in the clock face)
"heartRate":60,  # heart rate measured when the user completed the survey
"dataHistoryArray":  # historical data measure at 1-minute interval before the user started the survey
    [{
    "time":"2019-11-22T01:58:10.879Z","heartRate":60,"stepCount":4860
    },{
    "time":"2019-11-22T01:59:10.879Z","heartRate":60,"stepCount":4919
    }],  
"voteLog":40,  # counter which stores information on how many times the user completed the survey, used for debugging to check that no responses where lost
"comfort":10,  # Clock face question, 10 = "Comfy", 9 = "Not Comfy" 
"thermal":9,  # Thermal preference, 9 = "Warm", 10 = "No Change", 11 = "Cooler"
"light":9,  # Light preference, 9 = "Brighter", 10 = "No Change", 11 = "Dimmer"
"noise":9,  # Noise preference, 9 = "Louder", 10 = "No Change", 11 = "Quiter"
"indoorOutdoor":11,  # Location, 9 = "Outdoor", 11 = "Indoor",
"inOffice":11,  # Are you working, 9 = "Not working", 11 = "working"
"mood":11,  # Mood, 9 = "Sad", 10 = "Neutral", 11 = "Happy"
"clothing":11,  # Clothing, 9 = "Light", 10 = "Medium", 11 = "Heavy"
"air-vel":11,  # Air speed, 9 = "Low", 10 = "Medium", 11 = "High"
"responseSpeed":2.577,  # Time in seconds it took to complete the survey
"endFeedback":"2019-11-22T01:57:16.919Z",  # Timestamp when the user completed the survey
"lat":48.13194,"lon":11.54944,  # Latitude and longitude provided by the GPS of the phone
"setLocation":True,
"user_id":"debug",  # User ID as per selection in settings
"experiment_id":"debug",  # Experiment ID as per selection in settings
}
```


Credits to https://github.com/gedankenstuecke/Minimal-Clock was used as a starter template.

[![](http://www.budslab.org/buds-lab.github.io/budslab_banner.png)](http://www.budslab.org/)
