function mySettings(props) {
  return (
    <Page>

      <Section>
      <TextInput
    label="User ID"
    settingsKey="user_id"
    oninput={(selection) => props.settingsStorage.setItem('user_id', selection)}
  />

      </Section>

            <Section>
      <TextInput
    label="Unique Experiment ID"
    settingsKey="experiment_id"
    oninput={(selection) => props.settingsStorage.setItem('experiment_id', selection)}
  />

      </Section>


      <Section>
        <Select
  label={`Select Questions`}
  multiple
  settingsKey="flow_index"
  options={[
    {name:"Thermal",   value: "showThermal", subLabel: "Prefer Warmer, Prefer Cooler, Comfy"},
    {name:"Light",   value:"showLight", subLabel: "Prefer Brighter, Prefer Dimmer, Comfy"},
    {name:"Noise", value:"showNoise", subLabel: "Prefer Louder, Prefer Quieter, Comfy"},
    {name:"Indoor / Outdoor", value:"showIndoor", subLabel: "Indoor, Outdoor"},
    {name:"In Office", value:"showInOffice", subLabel: "In Office, Out of Office"},
    {name:"Mood", value:"showMood", subLabel: "Good, Not So Good"},
  ]}
  renderItem={
    (option) =>
      <TextImageRow
        label={option.name}
        sublabel={option.subLabel}
        icon="https://tinyurl.com/ybbmpxxq"
      />
  }
//  onSelection={(selection) => { 
//    props.settingsStorage.setItem('flow_index', JSON.stringify(selection))
//  }} 
/>

      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);