import thermal from '../resources/images/icons/prefer_warmer.png';
import light from '../resources/images/icons/prefer_brighter.png';
import noise from '../resources/images/icons/prefer_louder.png';
import indoorOutdoor from '../resources/images/icons/indoor.png';
import inofficeOutoffice from '../resources/images/icons/indoor.png';
import mood from '../resources/images/icons/not-comfy.png';
import clothing from '../resources/images/icons/light_clothes.png';

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
              name: "Thermal",
              value: "showThermal",
              subLabel: "Prefer Warmer, Prefer Cooler, Comfy",
              img: thermal
            },
            {
              name: "Light",
              value: "showLight",
              subLabel: "Prefer Brighter, Prefer Dimmer, Comfy",
              img: light
            },
            {
              name: "Noise",
              value: "showNoise",
              subLabel: "Prefer Louder, Prefer Quieter, Comfy",
              img: noise
            },
            {
              name: "Indoor / Outdoor",
              value: "showIndoor",
              subLabel: "Indoor, Outdoor",
              img: indoorOutdoor
            },
            {
              name: "In Office",
              value: "showInOffice",
              subLabel: "In Office, Out of Office",
              img: inofficeOutoffice
            },
            { 
              name: "Mood",
              value: "showMood",
              subLabel: "Good,Not So Good",
              img: mood
            },
            { 
              name: "Clothing",
              value: "showClothing",
              subLabel: "Light, Medium, Heavy",
              img: clothing
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
