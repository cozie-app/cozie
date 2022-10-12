---
id: extracting-data
title: Extracting Data from Cozie Basic
sidebar_label: Extracting Data from Cozie Basic
---


## Extracting Data
Data can be extracted via our API

**URL Key:** https://ay1bwnlt74.execute-api.us-east-1.amazonaws.com/test/request/

**Parameters**
* experiment-id: The name you set in the cozie settings above (required)
* user-id: The user-id set above (optional, if not included all users are extracted)
* weeks: Weeks of data (optional, default is 2 weeks)

### Extracting Data with Python

```python
import requests

payload = {'experiment-id': 'test', 'weeks': '30', 'user-id': 'test05'}
response = requests.get('https://ay1bwnlt74.execute-api.us-east-1.amazonaws.com/test/request/', params = payload)

print(response.content)
```

### Extracting Data with Bash

```bash
$ curl https://ay1bwnlt74.execute-api.us-east-1.amazonaws.com/test/request/?experiment-id=test&weeks=3
```

### Extracting Data with Node js

There are multiple methods to access data. You may use `fetch` or `https`

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

```js
fetch('https://ay1bwnlt74.execute-api.us-east-1.amazonaws.com/test/request/?experiment-id=test&weeks=3')
.then(function(response) {return response.json()})
.then(function(myJson) {console.log(JSON.stringify(myJson))});
```

### Extracting as a human using a browser
https://ay1bwnlt74.execute-api.us-east-1.amazonaws.com/test/request/?experiment-id=YOUR EXPERIMENT ID&weeks=NUMBER_OF_WEEKS&user-id=USER-ID(OPTIONAL)

for example. For Experiment-ID = test, User-ID = Vivid Vervet, and the last 30 weeks of data:

https://ay1bwnlt74.execute-api.us-east-1.amazonaws.com/test/request/?experiment-id=besh&weeks=30&user-id=test05

### Other crowdsourced examples of extracting data from the Cozie app
