import noSound from '../resources/images/icons/prefer_quieter.png';
import sound from '../resources/images/icons/prefer_louder.png';

import icon_thermal from '../resources/images/icons/prefer_warmer.png';
import icon_light from '../resources/images/icons/prefer_brighter.png';
import icon_noise from '../resources/images/icons/prefer_louder.png';
import icon_indoorOutdoor from '../resources/images/icons/outdoor.png';
import icon_location from '../resources/images/icons/home.png';
import icon_mood from '../resources/images/icons/not-comfy.png';
import icon_clothing from '../resources/images/icons/light_clothes.png';
import icon_velocity from '../resources/images/icons/air_vel_high.png';
import icon_met from '../resources/images/icons/met_exercising.png';
import icon_change from '../resources/images/icons/outdoor.png';

// map names of the json-flow to imported icons
// TODO: There is probably a better way to do this with the URL
const iconList = {
    thermal: icon_thermal,
    indoorOutdoor: icon_indoorOutdoor,
    location: icon_location,
    clothing: icon_clothing,
    airSpeed: icon_velocity,
    met: icon_met,
    anyChange: icon_change,
    mood: icon_mood,
    noise: icon_noise,
    light: icon_light,
}

function mySettings(props) {
    return (
        <Page>
            <Section>
                <TextInput
                    label="User ID (required)"
                    settingsKey="user_id"
                    oninput={selection =>
                        props.settingsStorage.setItem("user_id", selection)
                    }
                />
            </Section>

            <Section>
                <TextInput
                    label="Unique Experiment ID (required)"
                    settingsKey="experiment_id"
                    oninput={selection =>
                        props.settingsStorage.setItem("experiment_id", selection)
                    }
                />
            </Section>

            <Section>
                <TextInput
                    label="API key (required)"
                    settingsKey="api_key"
                    oninput={selection =>
                        props.settingsStorage.setItem("api_key", selection)
                    }
                />
            </Section>

            

            {/* -------------------------------------------------------------------------------------------------------------------------------------
            Description        :   optional section to allow users to select questions he wants to display
            Question flow type :   main question flow, or any question flow which does not use different "answersDirectTo" property per question.
            
            See documentation  :   https://cozie.app/docs/change-settings
            ------------------------------------------------------------------------------------------------------------------------------------- */}

            {/* <Section>
                <Select
                    label={`Select Questions`}
                    multiple
                    settingsKey="flow_index"
                    options={[
                        {
                            name: "Thermal preference",
                            value: "showThermal",
                            subLabel: "Cooler, No change, Warmer",
                            img: iconList.thermal
                        },
                        {
                            name: "Light preference",
                            value: "showLight",
                            subLabel: "Dimmer, No change, Brighter",
                            img: iconList.light
                        },
                        {
                            name: "Noise preference",
                            value: "showNoise",
                            subLabel: "Quieter, No change, Louder",
                            img: iconList.noise
                        },
                        {
                            name: "Indoor or outdoor",
                            value: "showIndoor",
                            subLabel: "Indoor, Outdoor",
                            img: iconList.indoorOutdoor
                        },
                        {
                            name: "Where are you?",
                            value: "showInOffice",
                            subLabel: "Home, Office, Other",
                            img: iconList.location
                        },
                        {
                            name: "Mood",
                            value: "showMood",
                            subLabel: "Good, Bad or Neither",
                            img: iconList.mood
                        },
                        {
                            name: "Clothing",
                            value: "showClothing",
                            subLabel: "Very light, Light, Medium, Heavy",
                            img: iconList.clothing
                        },
                        {
                            name: "Perceived air movement",
                            value: "showVelocity",
                            subLabel: "Perceived, Not perceived",
                            img: iconList.icon_velocity
                        },
                        {
                            name: "Activity previous 10 minutes",
                            value: "showMet",
                            subLabel: "Resting, Sitting, Standing, Exercising",
                            img: iconList.icon_met
                        },
                        {
                            name: "Any changes location/activity",
                            value: "showMet",
                            subLabel: "No, Yes",
                            img: iconList.icon_change
                        }
                    ]}
                    renderItem={option => (
                        <TextImageRow
                            label={option.name}
                            sublabel={option.subLabel}
                            icon={option.img}
                        />
                    )}
                />
            </Section> */}

            <Section>
                <Select
                    label={`Select Buzz Time`}
                    settingsKey="buzz_time"
                    options={[
                        {
                            name: "Never",
                            value: "0",
                            subLabel: "Never Buzz",
                            img: noSound
                        },
                        {
                            name: "Every Hour",
                            value: "1",
                            subLabel: "Between 9:00 - 21:00",
                            img: sound
                        },
                        {
                            name: "Every 2 hours",
                            value: "2",
                            subLabel: "Between 9:00 - 21:00",
                            img: sound
                        },
                        {
                            name: "Every 3 hours",
                            value: "3",
                            subLabel: "Between 9:00 - 21:00",
                            img: sound
                        }
                    ]}
                    renderItem={option => (
                        <TextImageRow
                            label={option.name}
                            sublabel={option.subLabel}
                            icon={option.img}
                        />
                    )}
                />
            </Section>
        </Page>
    );
}

registerSettingsPage(mySettings);
