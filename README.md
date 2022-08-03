# Project Cozie  - A smartwatch methodology for quick and easy experience surveys 

## What is Cozie?

[Cozie](https://cozie.app/) is a Fitbit Ionic, Versa, Versa Lite and Versa 2 clock face that can ask people questions. It is useful for [experience sampling research](https://en.wikipedia.org/wiki/Experience_sampling_method) and was designed for the built environment, although there are also forks focused on [Covid-19 symptoms tracking](https://github.com/pjayathissa/cozie-covid)

#### Please cite us if you use this software: 
[Jayathissa, Prageeth, Matias Quintana, Tapeesh Sood, Negin Nazarian, and Clayton Miller. 2019. “Is Your Clock-Face Cozie? A Smartwatch Methodology for the in-Situ Collection of Occupant Comfort Data.” Journal of Physics. Conference Series 1343 (1): 012145.](https://iopscience.iop.org/article/10.1088/1742-6596/1343/1/012145)

The foundation for this project is the [BUDS Lab](https://www.budslab.org/) efforts towards human sujective feedback in the built environment:

- [Humans-as-a-sensor for buildings: Intensive longitudinal indoor comfort models](https://arxiv.org/abs/2007.02014)

## Tutorials

Documentation found [here](https://www.budslab.org/website-dev/docs/home) and a shortcut to the [video tutorials](https://www.youtube.com/playlist?list=PLkQs5WJXVHbiBDjmv-1tBYNUQOkmNCctA) related to helping with the project or forking for yourself.

## Download Cozie Clock Face

[Latest Stable Release](https://gallery.fitbit.com/details/512ce6c5-f633-4f7b-853c-891869f5e3d8)

[Beta Development Version](https://gallery.fitbit.com/details/d787c911-ce11-432e-8b68-69da0f3446c8)

## License


The Cozie clockface is open-sourced under at [LGPLv3 License](https://github.com/buds-lab/cozie/blob/master/LICENSE)

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

 ### Document structure sent by Cozie
 ```python
 {
 "startFeedback":"2019-11-22T01:57:14.342Z",  # Timestamp when the user started the survey (i.e. pressed one of the two buttons in the clock face)
 "heartRate":60,  # heart rate measured when the user completed the survey
 "voteLog":40,  # counter which stores information on how many times the user completed the survey, used for debugging to check that no responses where lost
 "comfort":10,  # Clock face question, 10 = "Comfy", 9 = "Not Comfy" 
 "indoorOutdoor":11,  # Location, 9 = "Outdoor", 11 = "Indoor",
 "change": 10, # Change location, activity or clothing, 11 = "Yes Change", 10 = "No Change"
 "location": 10, # Where are you, 8 = "Portable", 9 = "Work", 10 = "Other", 11 = "Home"
 "thermal":9,  # Thermal preference, 9 = "Warmer", 10 = "No Change", 11 = "Cooler"
 "light":9,  # Light preference, 9 = "Brighter", 10 = "No Change", 11 = "Dimmer"
 "noise":9,  # Noise preference, 9 = "Louder", 10 = "No Change", 11 = "Quiter"
 "clothing":11,  # Clothing, 8="very light", 9 = "Light", 10 = "Medium", 11 = "Heavy"
 "met":11,  # Metabolic rate, 8="resting", 9 = "sitting", 10 = "standing", 11 = "exercising"
 "air-vel":11,  # Perceived air movement, 9 = "Not Perceived", 11 = "Perceived"
 "mood":11,  # Mood, 9 = "Sad", 10 = "Neutral", 11 = "Happy"
 "responseSpeed":2.577,  # Time in seconds it took to complete the survey
 "endFeedback":"2019-11-22T01:57:16.919Z",  # Timestamp when the user completed the survey
 "lat":48.13194,"lon":11.54944,  # Latitude and longitude provided by the GPS of the phone
 "setLocation":True,
 "bodyPresence":True, # passes information whether the user is wearing the watch or not
 "user_id":"debug",  # User ID as per selection in settings
 "experiment_id":"debug",  # Experiment ID as per selection in settings
 }
 ```

