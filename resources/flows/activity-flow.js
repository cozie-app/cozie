export default [
	{
		name: "thermal",
		type: "icon",
		requiresAnswer: [],
		questionText: "Would you prefer to be?",
		questionSecondText: "",
		answerDirectTo: {
			9: {
				next: "air"
			},
			10: {
				next: "air"
			},
			11: {
				next: "air"
			}
		},
		iconText: ["Cooler", "Warmer", "No change"],
		iconColors: ["fb-cyan", "fb-orange", "fb-green"],
		iconImages: [
			"images/icons/prefer_cold.png",
			"images/icons/prefer_warmer.png",
			"images/icons/comfy.png",
		],
	},
	{
		name: "air",
		type: "icon",
		requiresAnswer: [],
		questionText: "Would you prefer to be?",
		questionSecondText: "",
		answerDirectTo: {
			9: {
				next: "freshair"
			},
			10: {
				next: "freshair"
			},
			11: {
				next: "freshair"
			}
		},
		iconText: ["More air", "Less air", "No change"],
		iconColors: ["fb-cyan", "fb-orange", "fb-green"],
		iconImages: [
			"images/icons/air/air_less_air.png",
			"images/icons/air/air_more_air.png",
			"images/icons/comfy.png",
		],
	},
	{
		name: "freshair",
		type: "icon",
		requiresAnswer: [],
		questionText: "Would you prefer to be?",
		questionSecondText: "",
		answerDirectTo: {
			10: {
				next: "light"
			},
			11: {
				next: "light"
			}
		},
		iconText: ["Fresh air", "No change", " "],
		iconColors: ["fb-cyan", "fb-green", "fb-black"],
		iconImages: [
			"images/icons/air/air_less_air.png",
			"images/icons/comfy.png",
			"images/icons/comfy.png",
		],
	},
	{
		name: "light",
		type: "icon",
		requiresAnswer: [],
		questionText: "Light preference",
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
		iconText: ["Dimmer", "Brighter", "No Change"],
		iconColors: ["fb-blue", "fb-peach", "fb-green"],
		iconImages: [
			"images/icons/prefer_dimmer.png",
			"images/icons/prefer_brighter.png",
			"images/icons/neutral.png",
		],
	},
	{
		name: "noise",
		type: "icon",
		requiresAnswer: [],
		questionText: "Sound preference",
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
		questionSecondText: "",
		iconText: ["Quiter", "Louder", "No Change"],
		iconColors: ["fb-orange", "fb-purple", "fb-green"],
		iconImages: [
			"images/icons/prefer_quieter.png",
			"images/icons/prefer_louder.png",
			"images/icons/neutral.png",
		],
	},
	{
		name: "clothing",
		type: "icon",
		requiresAnswer: [],
		questionText: "What are you wearing?",
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
			}
		},
		iconText: ["Medium", "Heavy", "Light"],
		iconColors: ["fb-peach", "fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/clothing/medium.png",
			"images/icons/clothing/heavy.png",
			"images/icons/clothing/light.png",
		],
	},
	{
		name: "indoorOutdoor",
		type: "icon",
		requiresAnswer: [],
		questionText: "Are you?",
		questionSecondText: "",
		answerDirectTo: {
			10: {
				next: "location"
			},
			11: {
				next: "posture"
			}
		},
		iconText: ["Outdoor", "Indoor"],
		iconColors: ["fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/outdoor.png",
			"images/icons/indoor.png",
		],
	},
	{
		name: "location",
		type: "icon",
		requiresAnswer: [],
		questionText: "Where are you?",
		questionSecondText: "",
		answerDirectTo: {
			9: {
				next: "activityType"
			},
			10: {
				next: "activityType"
			},
			11: {
				next: "activityType"
			}
		},
		iconText: ["MeetingR", "Office", "Cafeteria"],
		iconColors: ["fb-peach", "fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/room/meeting.png",
			"images/icons/room/office.png",
			"images/icons/room/lunch.png",
		],
	},
	{
		name: "activityType",
		type: "icon",
		requiresAnswer: [],
		questionText: "Which activity are you doing?",
		questionSecondText: "",
		answerDirectTo: {
			9: {
				next: "posture"
			},
			10: {
				next: "posture"
			},
			11: {
				next: "posture"
			}
		},
		iconText: ["Call", "Work(focus)", "Coffee/Lunch"],
		iconColors: ["fb-peach", "fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/activitytype/call.png",
			"images/icons/activitytype/workfocus.png",
			"images/icons/activitytype/eating.png",
		],
	},
	{
		name: "posture",
		type: "icon",
		requiresAnswer: [],
		questionText: "Are you?",
		questionSecondText: "",
		answerDirectTo: {
			10: {
				next: "activityIntensity"
			},
			11: {
				next: "activityIntensity"
			}
		},
		iconText: ["Standing", "Sitting"],
		iconColors: ["fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/posture/standing.png",
			"images/icons/posture/sitting.png",
		],
	},
	{
		name: "activityIntensity",
		type: "icon",
		requiresAnswer: [],
		questionText: "Which activity intensity?",
		questionSecondText: "",
		answerDirectTo: {
			9: {
				next: "numberPeople"
			},
			10: {
				next: "numberPeople"
			},
			11: {
				next: "numberPeople"
			}
		},
		iconText: ["Middle", "High", "Low"],
		iconColors: ["fb-peach", "fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/activityintensity/middle.png",
			"images/icons/activityintensity/high.png",
			"images/icons/activityintensity/resting.png",
		],
	},
	{
		name: "numberPeople",
		type: "icon",
		requiresAnswer: [],
		questionText: "Currently, you are (with)",
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
		iconText: ["<=3 people", ">3 people", "Alone"],
		iconColors: ["fb-peach", "fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/howmanyaround/group-less_3.png",
			"images/icons/howmanyaround/group_more_3.png",
			"images/icons/howmanyaround/alone.png",
		],
	},
	{
		name: "anyChange",
		type: "icon",
		requiresAnswer: [],
		questionText: "Any changes in activity,",
		questionSecondText: "clo, loc in past 10m?",
		answerDirectTo: {
			10: {
				next: "end"
			},
			11: {
				next: "end"
			}
		},
		iconText: ["Yes", "No"],
		iconColors: ["fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/anychanges/yes.png",
			"images/icons/anychanges/no.png",
		],
	},

];
