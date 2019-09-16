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
          label="User ID"
          settingsKey="user_id"
          oninput={selection =>
            props.settingsStorage.setItem("user_id", selection)
          }
        />
      </Section>

      <Section>
        <TextInput
          label="Unique Experiment ID"
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
          //  onSelection={(selection) => {
          //    props.settingsStorage.setItem('flow_index', JSON.stringify(selection))
          //  }}
        />
      </Section>

      <Section>
        <Select
          label={`Select Buzz Time`}
          settingsKey="buzz_time"
          options={[
            {
              name: "Off",
              value: "h0",
              subLabel: "No Buzzing",
            },
            {
              name: "Every Hour",
              value: "h1",
              subLabel: "Buzz every hour between 9:00 - 18:00",
            },            
            {
              name: "Every 2 Hours",
              value: "h2",
              subLabel: "Buzz every 2 hours between 9:00 - 18:00",
            },
            {
              name: "Every 3 Hours",
              value: "h3",
              subLabel: "Buzz every 3 hours between 9:00 - 16:00",
            }
          ]}
          renderItem={option => (
            <TextImageRow
              label={option.name}
              sublabel={option.subLabel}
            />
          )}
          //  onSelection={(selection) => {
          //    props.settingsStorage.setItem('flow_index', JSON.stringify(selection))
          //  }}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
