export default [{
    name: "thermal",
    displayName: "Thermal",
    type: "icon",
    questionText: "Would you prefer to be?",
    questionSecondText: "",
    answerDirectTo: {
        9: {
            next: "indoorOutdoor"
        },
        10: {
            next: "indoorOutdoor"
        },
        11: {
            next: "indoorOutdoor"
        },
        12: {
            next: "indoorOutdoor"
        }
    },
    iconText: ["Cooler", "Warmer", "No change", "Something else"],
    iconColors: ["fb-cyan", "fb-orange", "fb-green", "fb-yellow"],
    iconImages: [
        "images/icons/prefer_cold.png",
        "images/icons/prefer_warmer.png",
        "images/icons/comfy.png",
        "images/icons/outdoor.png",
    ],
}, {
    name: "indoorOutdoor",
    displayName: "Indoor / Outdoor",
    type: "icon",
    questionText: "Are you?",
    questionSecondText: "",
    answerDirectTo: {
        10: {
            next: "location"
        },
        11: {
            next: "location"
        }
    },
    iconText: ["Indoor", "Outdoor"],
    iconColors: ["fb-peach", "fb-peach"],
    iconImages: [
        "images/icons/indoor.png",
        "images/icons/outdoor.png",
    ],
}, {
    name: "location",
    displayName: "Location",
    type: "icon",
    questionText: "Where are you?",
    questionSecondText: "",
    answerDirectTo: {
        9: {
            next: "clothing"
        },
        10: {
            next: "clothing"
        },
        11: {
            next: "clothing"
        }
    },
    iconText: ["Home", "Office", "Neither"],
    iconColors: ["fb-peach", "fb-peach", "fb-peach"],
    iconImages: [
        "images/icons/home.png",
        "images/icons/work.png",
        "images/icons/no.png",
    ],
}, {
    name: "clothing",
    displayName: "Clothing",
    type: "icon",
    questionText: "What are you wearing?",
    questionSecondText: "",
    answerDirectTo: {
        9: {
            next: "airSpeed"
        },
        10: {
            next: "airSpeed"
        },
        11: {
            next: "airSpeed"
        }
    },
    iconText: ["Light", "Heavy", "Medium"],
    iconColors: ["#6decb9", "#42dee1", "#3fc5f0"],
    iconImages: [
        "images/icons/light_clothes.png",
        "images/icons/heavy_clothes.png",
        "images/icons/medium_clothes.png",
    ],
}, {
    name: "airSpeed",
    displayName: "Air Speed",
    type: "icon",
    questionText: "Can you perceive air",
    questionSecondText: "movement around you?",
    answerDirectTo: {
        10: {
            next: "met"
        },
        11: {
            next: "met"
        }
    },
    iconText: ["No", "Yes"],
    iconColors: ["fb-orange", "fb-green"],
    iconImages: [
        "images/icons/air_vel_low.png",
        "images/icons/air_vel_high.png",
    ],
}, {
    name: "met",
    displayName: "Activity",
    type: "icon",
    questionText: "Activity last 10-min?",
    questionSecondText: "",
    answerDirectTo: {
        9: {
            next: "anyChange"
        },
        10: {
            next: "anyChange"
        },
        11: {
            next: "anyChange"
        }
    },
    iconText: ["Resting", "Standing", "Sitting"],
    iconColors: ["#A7F3D5", "#6decb9", "#42dee1"],
    iconImages: [
        "images/icons/met_resting.png",
        "images/icons/outdoor.png",
        "images/icons/indoor.png",
    ],
}, {
    name: "anyChange",
    displayName: "Any Changes",
    type: "icon",
    questionText: "Any changes in clo, loc",
    questionSecondText: "or met past 10-m?",
    answerDirectTo: {
        10: {
            next: "mood"
        },
        11: {
            next: "mood"
        }
    },
    iconText: ["Yes", "No"],
    iconColors: ["fb-green", "fb-orange"],
    iconImages: [
        "images/icons/yes.png",
        "images/icons/no.png",
    ],
}, {
    name: "mood",
    displayName: "Mood",
    type: "icon",
    questionText: "What mood are you in?",
    questionSecondText: "",
    answerDirectTo: {
        9: {
            next: "noise"
        },
        10: {
            next: "noise"
        },
        11: {
            next: "noise"
        }
    },
    iconText: ["Good", "Bad", "Neutral"],
    iconColors: ["fb-green", "fb-orange", "fb-cyan"],
    iconImages: [
        "images/icons/comfy.png",
        "images/icons/not-comfy.png",
        "images/icons/neutral.png",
    ],
}, {
    name: "noise",
    displayName: "Noise",
    type: "icon",
    questionText: "Sound preference",
    questionSecondText: "",
    answerDirectTo: {
        9: {
            next: "light"
        },
        10: {
            next: "light"
        },
        11: {
            next: "light"
        }
    },
    iconText: ["Quiter", "Louder", "No Change"],
    iconColors: ["fb-orange", "fb-purple", "fb-green"],
    iconImages: [
        "images/icons/prefer_quieter.png",
        "images/icons/prefer_louder.png",
        "images/icons/neutral.png",
    ],
}, {
    name: "light",
    displayName: "Light",
    type: "icon",
    questionText: "Light preference",
    questionSecondText: "",
    answerDirectTo: {
        9: {
            next: "end"
        },
        10: {
            next: "end"
        },
        11: {
            next: "end"
        }
    },
    iconText: ["Dimmer", "Brighter", "No Change"],
    iconColors: ["fb-blue", "fb-peach", "fb-green"],
    iconImages: [
        "images/icons/prefer_dimmer.png",
        "images/icons/prefer_brighter.png",
        "images/icons/neutral.png",
    ],
}, ];