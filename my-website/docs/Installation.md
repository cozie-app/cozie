---
id: installation
title: Installation and setup
sidebar_label: Installation and setup
---

<iframe width="100%" height="400" src="https://www.youtube.com/watch?v=oLrP8FDAQd8&list=PLkQs5WJXVHbiBDjmv-1tBYNUQOkmNCctA&index=2&t=0s" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Make sure you have npm, and node installed on your system

    Node: https://nodejs.org/en/download/
    npm: https://www.npmjs.com/get-npm
    fitbit cli: https://dev.fitbit.com/build/guides/command-line-interface/
    Fitbit OS Simulator: https://dev.fitbit.com/getting-started/

Once that is setup, clone and install the repository:
```
git init
git clone git@github.com:cozie-app/cozie.git
cd cozie
npm install
```

You can then open the Fitbit OS Simulator.
In order to run the project, you'll have to build and install first.
Open a fitbit shell.

```
npx fitbit
```
From there, build the project.

```sh
fitbit$ build
```

And then run install, which will open the browser and log you into your fitbit developer account.

```sh
fitbit$ install
```

The simulator should pick up on this and a new app should be listed on the right. Once you power up the simulator, the app will be running on it.
