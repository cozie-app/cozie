---
id: gs-sending-data-to-cloud
title: Sending data to the cloud
sidebar_label: Sending data to the cloud
---

<iframe width="100%" height="400" src="https://www.youtube.com/embed/PkTSNwP12TI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

We are sending the data from the Cozie application to our cloud database using an [AWS Lambda function](https://aws.amazon.com/lambda/).
The Lambda function listens for any incoming POST requests, checks that the sender has the right API key, 
process the data and send it to our cloud database.

We are using AWS Lambda functions, however, valid alternatives are: 
* [Google Cloud Functions](https://cloud.google.com/functions)
* [Node-RED](https://nodered.org)

You can also use any other cloud database out there, and you are not required to use InfluxDB.

Please find below the Python code we are currently using in the Lambda function to send the data to our cloud database. Please edit the following line and add your information `InfluxDBClient("hostname", 8086, "username",'password', "datatbase", ssl=True, verify_ssl=True)`.

```python
from __future__ import print_function
from influxdb import InfluxDBClient
import json


def lambda_handler(event, context):
    client = InfluxDBClient("hostname", 8086, "username",
        'password', "datatbase", ssl=True, verify_ssl=True)
    try:

        print(event["body"])

        body = json.loads(event["body"])

        fields = {}

        for key in body.keys():
            # Check if the key value is an integer or a float
            if isinstance(body[key], int) or isinstance(body[key], float):
                fields[key] = body[key]

        json_body = [{
            'time': body['endFeedback'],
            'measurement': 'fitbitAPI',
            'tags': {'userid': body['user_id'],
                     'experimentid': body['experiment_id']},
            'fields': fields,
            }]

        client.write_points(json_body)  # write to InfluxDB

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
                },
            "body": "Success"
            }
    except Exception as e:

        print(e)

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
                },
            "body": e
            }
```


