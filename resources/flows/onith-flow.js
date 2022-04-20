export default [
    {
        name: "surrounding",
        displayName: "Surrounding",
        type: "icon",
        // requiresAnswer: [],
        questionText: "Do your surroundings",
        questionSecondText: "increase infection risk?",
        answerDirectTo: {
            9: {
                next: "risk"
            },
            10: {
                next: "risk"
            },
            11: {
                next: "crowded"
            },
        },
        iconText: ["Not at all", "A lot", "A little"],
        iconColors: ["#f9af36", "#f9af36", "#f9af36"],
        iconImages: [
            "images/icons/onith/shield.png",
            "images/icons/onith/1_virus.png",
            "images/icons/onith/3_virus.png",
        ],
    },
    {
        name: "risk",
        displayName: "Risk causes",
        type: "icon",
        requiresAnswer: [],
        questionText: "What causes more risk?",
        questionSecondText: "",
        answerDirectTo: {
            9: {
                next: "crowded"
            },
            10: {
                next: "crowded"
            },
            11: {
                next: "concern"
            },
        },
        iconText: ["People", "Surface", "Ventilation"],
        iconColors: ["#f9af36", "#f9af36", "#f9af36"],
        iconImages: [
            "images/icons/onith/People.png",
            "images/icons/onith/Surface.png",
            "images/icons/onith/Ventilation.png",
        ],
    },
    {
        name: "concern",
        displayName: "Concern",
        type: "icon",
        requiresAnswer: [{ question: "risk", value: 11 }],
        questionText: "Specifically, what",
        questionSecondText: "concerns you?",
        answerDirectTo: {
            9: {
                next: "crowded"
            },
            10: {
                next: "crowded"
            },
            11: {
                next: "crowded"
            },
        },
        iconText: ["Density", "Proximity", "Both"],
        iconColors: ["#f9af36", "#f9af36", "#f9af36"],
        iconImages: [
            "images/icons/onith/Density.png",
            "images/icons/onith/Proximity.png",
            "images/icons/onith/Both.png",
        ],
    },
    {
        name: "crowded",
        displayName: "Crowded surroundings",
        type: "icon",
        requiresAnswer: [],
        questionText: "Are your surroundings",
        questionSecondText: "crowded?",
        answerDirectTo: {
            9: {
                next: "numberPeople"
            },
            10: {
                next: "numberPeople"
            },
            11: {
                next: "numberPeople"
            },
        },
        iconText: ["No", "Yes"],
        iconColors: ["#f9af36", "#f9af36"],
        iconImages: [
            "images/icons/onith/No_onith.png",
            "images/icons/onith/Yes_onith.png",
        ],
    },
    {
        name: "numberPeople",
        displayName: "Number people",
        type: "icon",
        requiresAnswer: [],
        questionText: "Currently, how many",
        questionSecondText: "people within 5m?",
        answerDirectTo: {
            9: {
                next: "end"
            },
            10: {
                next: "end"
            },
            11: {
                next: "end"
            },
        },
        iconText: ["0 pax", "1-4 pax", "5+ pax"],
        iconColors: ["#f9af36", "#f9af36", "#f9af36"],
        iconImages: [
            "images/icons/onith/0pax.png",
            "images/icons/onith/1-4pax.png",
            "images/icons/onith/5pax.png",
        ],
    },
];