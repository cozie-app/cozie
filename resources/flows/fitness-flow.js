export default [{
        name: "stairsElevators",
        displayName: "Satir or Lift",
        type: "icon",
        // requiresAnswer: [],
        questionText: "In the past 60 min, I used:",
        questionSecondText: "",
        answerDirectTo: {
            11: {
                next: "whyLift",
            },
            10: {
                next: "whyStairs",
            },
            12: {
                next: "workingNow"
            },
            9: {
                next: "BothLiftAndStairs_WhyLift"
            }
        },
        iconText: ["Lift", "Stairs", "Both", "Neither"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/elevator.png", // 11
            "images/icons/fitness/stairs.png", // 10
            "images/icons/fitness/both.png", // 9
            "images/icons/fitness/neither.png", // 12
        ],
    }, {
        name: "workingNow",
        displayName: "Working ?",
        type: "icon",
        // requiresAnswer: [{
        //     question: "stairsElevators",
        //     value: 12 // neither stairs nor lift
        // }],
        answerDirectTo: {
            11: {
                next: "areYou"
            },
            10: {
                next: "workStationType"
            }
        },
        questionText: "Are you working now?",
        questionSecondText: "",
        iconText: ["No", "Yes"],
        iconColors: ["fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/no.png", //11
            "images/icons/fitness/yes.png" //10
        ],
    }, {
        name: "BothLiftAndStairs_WhyLift",
        displayName: "Both? Why lift?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "BOTH_LiftConvenientBecuause"
            },
            10: {
                next: "BothLiftAndStairs_WhyStairs"
            },
            11: {
                next: "BothLiftAndStairs_WhyStairs"
            },
            12: {
                next: "BothLiftAndStairs_WhyStairs"
            }
        },
        questionText: "Took lift, Why?",
        questionSecondText: "",
        iconText: ["Less effort", "No stairs", "Convenient"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/02_less_effort.png",
            "images/icons/fitness/03_nostairs.png",
            "images/icons/fitness/01_convenience.png",
        ],
    }, {
        name: "BothLiftAndStairs_WhyStairs",
        displayName: "Both? Why staris?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "BOTH_StairsConvenientBecuause"
            },
            10: {
                next: "workingNow"
            },
            11: {
                next: "workingNow"
            },
            12: {
                next: "workingNow"
            }
        },
        questionText: "Took stairs, Why?",
        questionSecondText: "",
        iconText: ["Healthy", "No lift", "Convenient", "Save Energy"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/fitness.png", // 11
            "images/icons/fitness/noelevators.png", // 10
            "images/icons/fitness/01_convenience.png", // 9
            "images/icons/fitness/save_energy.png", // 12
        ],
    }, {
        name: "whyLift",
        displayName: "Why lift?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "LiftConvenientBecuause"
            },
            10: {
                next: "workingNow"
            },
            11: {
                next: "workingNow"
            },
            12: {
                next: "workingNow"
            }
        },
        questionText: "Took lift, Why?",
        questionSecondText: "",
        iconText: ["Less effort", "No stairs", "Convenient"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/02_less_effort.png",
            "images/icons/fitness/03_nostairs.png",
            "images/icons/fitness/01_convenience.png",
        ],
    }, {
        name: "whyStairs",
        displayName: "Why staris?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "StairsConvenientBecuause"
            },
            10: {
                next: "workingNow"
            },
            11: {
                next: "workingNow"
            },
            12: {
                next: "workingNow"
            }
        },
        questionText: "Took stairs, Why?",
        questionSecondText: "",
        iconText: ["Healthy", "No lift", "Convenient", "Save Energy"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/fitness.png", // 11
            "images/icons/fitness/noelevators.png", // 10
            "images/icons/fitness/01_convenience.png", // 9
            "images/icons/fitness/save_energy.png", // 12
        ],
    }, {
        name: "workStationType",
        displayName: "Workstation Type",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "adjustedWorkstationToday"
            },
            10: {
                next: "areYou"
            },
            11: {
                next: "areYou"
            }
        },
        questionText: "What kind of workstation?",
        questionSecondText: "",
        iconText: ["Standing", "Sitting", "adjustable"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/standing.png",
            "images/icons/fitness/sitting.png",
            "images/icons/fitness/adjustable.png",
        ],
    }, {
        name: "adjustedWorkstationToday",
        displayName: "Adjusted Workstation ?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "areYou"
            },
            10: {
                next: "areYou"
            },
            11: {
                next: "areYou"
            },
            12: {
                next: "areYou"
            }
        },
        questionText: "Adjusted height today?",
        questionSecondText: "",
        iconText: ["down", "up", "up&down", "never"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/down.png",
            "images/icons/fitness/up.png",
            "images/icons/fitness/adjustable.png",
            "images/icons/fitness/no.png",

        ],
    }, {
        name: "StairsConvenientBecuause",
        displayName: "Stairs Convenient Because?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "workingNow"
            },
            10: {
                next: "workingNow"
            },
            11: {
                next: "workingNow"
            }
        },
        questionText: "Stairs convenient because?",
        questionSecondText: "",
        iconText: ["Easiest", "Fastest", "Both"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/easier.png",
            "images/icons/fitness/faster.png",
            "images/icons/fitness/both.png",
        ],

    }, {
        name: "BOTH_StairsConvenientBecuause",
        displayName: "If both, stairs Convenient Because?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "workingNow"
            },
            10: {
                next: "workingNow"
            },
            11: {
                next: "workingNow"
            }
        },
        questionText: "Stairs convenient because?",
        questionSecondText: "",
        iconText: ["Easiest", "Fastest", "Both"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/easier.png",
            "images/icons/fitness/faster.png",
            "images/icons/fitness/both.png",
        ],

    }, {
        name: "LiftConvenientBecuause",
        displayName: "Stairs Convenient Because?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "workingNow"
            },
            10: {
                next: "workingNow"
            },
            11: {
                next: "workingNow"
            }
        },
        questionText: "Lift convenient because?",
        questionSecondText: "",
        iconText: ["Easiest", "Fastest", "Both"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/easier.png",
            "images/icons/fitness/faster.png",
            "images/icons/fitness/both.png",
        ],

    }, {
        name: "BOTH_LiftConvenientBecuause",
        displayName: "If both, lift Convenient Because?",
        type: "icon",
        answerDirectTo: {
            9: {
                next: "BothLiftAndStairs_WhyStairs"
            },
            10: {
                next: "BothLiftAndStairs_WhyStairs"
            },
            11: {
                next: "BothLiftAndStairs_WhyStairs"
            }
        },
        questionText: "Lift convenient because?",
        questionSecondText: "",
        iconText: ["Easiest", "Fastest", "Both"],
        iconColors: ["fb-peach", "fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/easier.png",
            "images/icons/fitness/faster.png",
            "images/icons/fitness/both.png",
        ],

    }, {
        name: "areYou",
        displayName: "Are you sitting/standing?",
        type: "icon",
        answerDirectTo: {
            10: {
                next: "end"
            },
            11: {
                next: "end"
            }
        },
        questionText: "Are you?",
        questionSecondText: "",
        iconText: ["Standing", "Sitting"],
        iconColors: ["fb-peach", "fb-peach"],
        iconImages: [
            "images/icons/fitness/standing.png", // 11
            "images/icons/fitness/sitting.png", // 10
        ],
    }

]