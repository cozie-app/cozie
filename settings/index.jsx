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
                <TextInput
                    label="API key (required)"
                    settingsKey="api_key"
                    oninput={selection =>
                        props.settingsStorage.setItem("api_key", selection)
                    }
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
