
# Remote COVID Patient Monitoring With Cozie

## Goals
- To be able to remotely monitor patients that have tested positive with COVID-19, and are showing mild symptoms
- To be able to notice a deterioation of COVID condition

### Patient Requirements
- I am worried about my positive diagnosis, but I can't go to the hospital all the time due to my infection rate. I would like to remotely let doctors know about my situation and have them watch over me
- I don't want to deal with


### Clinician Requirements
- I may not have capacity to deal with all COVID positive cases, and healthlines are already overwhelmed. I would like to have an easy overview of all my patients and be able to call them when their situation deterioates
- I have responsibilty for all my patients, and am responsible if their situation deterioates. My patients lives are in my hands
- I want to know when I need to call my patient into an intensive care unit (ICU)

# Flow

- home screen (ok, not ok)

## Cough

- Do you have a cough (yes, no [green light])
	- Is your cough different from a normal cough (yes [medium alert], no)
	- How bad is your cough (here and there, frequently, severe [high alert]) 
	- Is your cough getting worse (yes [high alert], no, same)

## Difficulty Breathing

- Do you find it hard to breath (yes, no [green light])
	- is this difficult while resting (yes [medium alert], no)
	- is your breathing getting worse (yes [high alert], no)
	- are you concerned with your breathing (yes [medium alert], no)


## Fever
- Do you feel feverish (yes, no [green light])
	- Are you concerned about your fever (yes [medium alert], no)
- Do you have a thermometer (yes, no [medium alert])
	- Can you take your temperature (numerical input [alert depending on variation from baseline])

## Lethargy
- Do you feel tired (yes, no [green light])
	- How sever is your tiredness (mild, moderate [medium alert], sever [high alert])


# This open source project is built upon cozie

https://cozie.app/

Video Tutorials: https://www.youtube.com/playlist?list=PLkQs5WJXVHbiBDjmv-1tBYNUQOkmNCctA

Wiki: https://github.com/buds-lab/cozie/wiki/Cozie-Development-Guide

# Download

Latest Stable Release: Coming soon

# Dev guide
1. `npx fitbit-build` will build the project
2. `npx fitbit` opens the browser, and logs into your fitbit account. From here you can connect to devices and install the app


# Install  ClockFace to your own Fitbit Versa

Supported Devices: Ionic, Versa, Versa-Lite, Versa 2
Download inks coming soon

# Backend

AWS backend coming soon
