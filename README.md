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


Supported Devices: Ionic, Versa, Versa-Lite
The app is available by the link. To install ClockFace follow the link https://gam.fitbit.com/gallery/clock/731497ca-5e7c-4383-a702-18330587d048 on your phone, it will redirect to FitBit app gallery.

# How Data is Mapped to Integers for storage on InfluxDB

```python
        if bodyData['comfort'] == 'comfy':
            fields.update({'comfort': 10})
            #response = 10
        elif bodyData['comfort'] == 'notComfy':
            fields.update({'comfort': 9})
            #response = 9
        else:
            return {'statusCode': 404, 'body': json.dumps('Response name not found')}

        if 'thermal' in bodyData:
            if bodyData['thermal'] == 'thermal_comfy':
                fields.update({'thermal': 10})
            elif bodyData['thermal'] == 'prefer_warm':
                fields.update({'thermal': 9})
            elif bodyData['thermal'] == 'prefer_cold':
                fields.update({'thermal': 11})

        if 'light' in bodyData:
            if bodyData['light'] == 'light_comfy':
                fields.update({'light': 10})
            elif bodyData['light'] == 'prefer_bright':
                fields.update({'light': 9})
            elif bodyData['light'] == 'prefer_dim':
                fields.update({'light': 11})

        if 'noise' in bodyData:
            if bodyData['noise'] == 'noise_comfy':
                fields.update({'noise': 10})
            elif bodyData['noise'] == 'prefer_louder':
                fields.update({'noise': 9})
            elif bodyData['noise'] == 'prefer_quiet':
                fields.update({'noise': 11})

        if 'indoorOutdoor' in bodyData:
            if bodyData['indoorOutdoor'] == 'indoor':
                fields.update({'indoorOutdoor': 11})
            elif bodyData['indoorOutdoor'] == 'outdoor':
                fields.update({'indoorOutdoor': 9})

        if 'inOffice' in bodyData:
            if bodyData['inOffice'] == 'in_office':
                fields.update({'inOffice': 11})
            elif bodyData['inOffice'] == 'out_office':
                fields.update({'inOffice': 9})

        if 'mood' in bodyData:
            if bodyData['mood'] == 'neutral':
                fields.update({'mood': 10})
            elif bodyData['mood'] == 'sad':
                fields.update({'mood': 9})
            elif bodyData['mood'] == 'happy':
                fields.update({'mood': 11})

        if 'clothing' in bodyData:
            if bodyData['clothing'] == 'light_clothes':
                fields.update({'clothing': 9})
            elif bodyData['clothing'] == 'medium_clothes':
                fields.update({'clothing': 10})
            elif bodyData['clothing'] == 'heavy_clothes':
                fields.update({'clothing': 11})
```


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

[![](http://www.budslab.org/buds-lab.github.io/budslab_banner.png)](http://www.budslab.org/)
