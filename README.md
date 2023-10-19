# Project Cozie  - A smartwatch methodology for quick and easy experience surveys 

## What is Cozie?

[Cozie](https://cozie-fitbit.app/) is a Fitit Ionic, Versa, Versa Lite and Versa 2 clock face that can ask people questions. It is useful for [experience sampling research](https://en.wikipedia.org/wiki/Experience_sampling_method) and was designed for the built environment, although there are also forks focused on [Covid-19 symptoms tracking](https://github.com/pjayathissa/cozie-covid)

The foundation for this project is the [BUDS Lab](https://www.budslab.org/) efforts towards human sujective feedback in the built environment:

- [Is your clock-face cozie? A smartwatch methodology for the in-situ collection of occupant comfort data](https://www.researchgate.net/publication/337376844_Is_your_clock-face_cozie_A_smartwatch_methodology_for_the_in-situ_collection_of_occupant_comfort_data)
- [Indoor Comfort Personalities: Scalable Occupant Preference Capture Using Micro Ecological Momentary Assessments](https://www.researchgate.net/publication/338527635_Indoor_Comfort_Personalities_Scalable_Occupant_Preference_Capture_Using_Micro_Ecological_Momentary_Assessments)

## Tutorials

Documentation found [here](https://cozie-fitbit.app/docs/home) and a shortcut to the [video tutorials](https://www.youtube.com/playlist?list=PLkQs5WJXVHbiBDjmv-1tBYNUQOkmNCctA) related to helping with the project or forking for yourself.

## Download Cozie Clock Face

[Latest Stable Release for Fitbit Ionic, Versa, Versa Light & Versa 2](https://gallery.fitbit.com/details/512ce6c5-f633-4f7b-853c-891869f5e3d8)

[Latest Stable Release for Fitbit Versa 3 & Sense](https://gallery.fitbit.com/details/354ed931-1207-4e2f-a92e-3383bd396f68)

[Beta Development Version](https://gallery.fitbit.com/details/d787c911-ce11-432e-8b68-69da0f3446c8)

## License

The Cozie clockface is open-sourced under at [GPLv3 License](https://github.com/buds-lab/cozie/blob/master/LICENSE)

Copyright © 2018-2020, BUDS Lab

## Run the project on your computer

### Clone repository
 
 1. first ensure that you have the latest nodejs installation https://nodejs.org/en/
 2. clone the repo `git clone git@github.com:buds-lab/cozie.git`
 3. `cd cozie`
 4. `npm install`
 
### Building and installing
 
 1. `npx fitbit-build` will build the project
 2. `npx fitbit` opens the browser, and logs into your fitbit account. From here you can connect to devices and install the app
 3. `bi` to building and install the application
 4.  Install the Fitbit Simulator for [Windows](https://simulator-updates.fitbit.com/download/stable/win) / [macOS](https://simulator-updates.fitbit.com/download/stable/mac)

 ### Document structure sent by Cozie

```python
{
 "airSpeed": 10, # Can you perceive air movement around you?, 10="Yes", 11="No", 
 "anyChange": 11, # Any changes in clo, loc, or met past 10-m?, 10="No", 11="Yes", 
 "clothing": 9, # What are you wearing?, 9="Medium", 10="Heavy", 11="Light", 
 "indoorOutdoor": 10, # Are you?, 10="Outdoor", 11="Indoor", 
 "light": 11, # Light preference, 9="No Change", 10="Brighter", 11="Dimmer", 
 "location": 10, # Where are you?, 9="Neither", 10="Office", 11="Home", 
 "met": 9, # Activity, lat 10-min?, 9="Sitting", 10="Standing", 11="Resting", 
 "mood": 10, # What mood are you in?, 9="Neutral", 10="Bad", 11="Good", 
 "noise": 10, # Sound preference, 9="No Change", 10="Louder", 11="Quieter", 
 "thermal": 12, # Would you prefer to be?, 9="No change", 10="Warmer", 11="Cooler", 12="Something else", 
 "comfort": 9, # Clock face question, 10 = "Comfy", 9 = "Not Comfy" 
 "voteLog": 14, # Counter which stores information on how many times the user completed the survey, used for debugging to check that no responses where lost
 "responseSpeed": 10.48, # # Time in seconds it took to complete the survey
 "heartRate": 76, # Heart rate [bpm] measured when the user completed the survey
 "restingHR": 58, # Resting heart rate [bpm]
 "BMR": 1216, # Basal metabolic rate [cal/d]
 "bodyPresence": True, # Passes information whether the user is wearing the watch or not
 "lat":48.13194, # Geographical latitude [°] provided by the GPS of the phone
 "lon":11.54944, # Geographifcal longtiude [°] provided by the GPS of the phone
 "userid": alpha01, # User ID as per selection in settings
 "experimentid": alpha # Experiment ID as per selection in settings
}
```

### More Information
 - [Getting Started with the Fitbit Software Development Kit (SDK)](https://dev.fitbit.com/getting-started/)

