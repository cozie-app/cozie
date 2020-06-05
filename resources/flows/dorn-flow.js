export default [
	{
		name: "thermal",
		type: "icon",
		requiresAnswer: [],
		questionText: "Would you prefer to be?",
		questionSecondText: "",
		iconText: ["Cooler", "Warmer", "No change"],
		iconColors: ["fb-cyan", "fb-orange", "fb-green"],
		iconImages: [
			"images/icons/prefer_cold.png",
			"images/icons/prefer_warmer.png",
			"images/icons/comfy.png",
		],
	},
	{
		name: "indoorOutdoor",
		type: "icon",
		requiresAnswer: [],
		questionText: "Are you?",
		questionSecondText: "",
		iconText: ["Indoor", "Outdoor"],
		iconColors: ["fb-peach", "fb-peach"],
		iconImages: [
			"images/icons/outdoor.png",
			"images/icons/indoor.png",
		],
	},
];
