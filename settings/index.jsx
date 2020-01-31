import thermal from '../resources/images/icons/prefer_warmer.png';
import light from '../resources/images/icons/prefer_brighter.png';
import noise from '../resources/images/icons/prefer_louder.png';
import indoorOutdoor from '../resources/images/icons/out_in.png';
import location from '../resources/images/icons/home.png';
import mood from '../resources/images/icons/not-comfy.png';
import clothing from '../resources/images/icons/light_clothes.png';
import icon_velocity from '../resources/images/icons/air_vel_high.png';
import icon_met from '../resources/images/icons/met_exercising.png';
import icon_change from '../resources/images/icons/outdoor.png';
import noSound from '../resources/images/icons/prefer_quieter.png';
import sound from '../resources/images/icons/prefer_louder.png';

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
                <Select
                    label={`Select Questions`}
                    multiple
                    settingsKey="flow_index"
                    options={[
                        {
                            name: "Thermal preference",
                            value: "showThermal",
                            subLabel: "Cooler, No change, Warmer",
                            img: thermal
                        },
                        {
                            name: "Light preference",
                            value: "showLight",
                            subLabel: "Dimmer, No change, Brighter",
                            img: light
                        },
                        {
                            name: "Noise preference",
                            value: "showNoise",
                            subLabel: "Quieter, No change, Louder",
                            img: noise
                        },
                        {
                            name: "Indoor or outdoor",
                            value: "showIndoor",
                            subLabel: "Indoor, Outdoor",
                            img: indoorOutdoor
                        },
                        {
                            name: "Where are you?",
                            value: "showInOffice",
                            subLabel: "Home, Office, Other",
                            img: location
                        },
                        {
                            name: "Mood",
                            value: "showMood",
                            subLabel: "Good, Bad or Neither",
                            img: mood
                        },
                        {
                            name: "Clothing",
                            value: "showClothing",
                            subLabel: "Very light, Light, Medium, Heavy",
                            img: clothing
                        },
                        {
                            name: "Perceived air movement",
                            value: "showVelocity",
                            subLabel: "Perceived, Not perceived",
                            img: icon_velocity
                        },
                        {
                            name: "Activity previous 10 minutes",
                            value: "showMet",
                            subLabel: "Resting, Sitting, Standing, Exercising",
                            img: icon_met
                        },
                        {
                            name: "Any changes location/activity",
                            value: "showMet",
                            subLabel: "No, Yes",
                            img: icon_change
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
