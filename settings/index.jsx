import thermal from '../resources/images/icons/prefer_warmer.png';
import light from '../resources/images/icons/prefer_brighter.png';
import noise from '../resources/images/icons/prefer_louder.png';
import indoorOutdoor from '../resources/images/icons/out_in.png';
import inofficeOutoffice from '../resources/images/icons/indoor.png';
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
                            name: "Location",
                            value: "showIndoor",
                            subLabel: "Indoor, Outdoor",
                            img: indoorOutdoor
                        },
                        {
                            name: "Are you working?",
                            value: "showInOffice",
                            subLabel: "Yes, No",
                            img: inofficeOutoffice
                        },
                        {
                            name: "Mood",
                            value: "showMood",
                            subLabel: "Not so good, Neutral, Good",
                            img: mood
                        },
                        {
                            name: "Clothing",
                            value: "showClothing",
                            subLabel: "Light, Medium, Heavy",
                            img: clothing
                        },
                        {
                            name: "Air Speed",
                            value: "showVelocity",
                            subLabel: "Low, Medium, High",
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
                            subLabel: "Buzz every hour between 9:00 - 17:00",
                            img: sound
                        },
                        {
                            name: "Every 2 hours",
                            value: "2",
                            subLabel: "Buzz every 2 hours between 9:00 - 17:00",
                            img: sound
                        },
                        {
                            name: "Every 3 hours",
                            value: "3",
                            subLabel: "Buzz every 3 hours between 9:00 - 17:00",
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
