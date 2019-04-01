function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Fitbit Account</Text>}>
        <Oauth
          settingsKey="oauth"
          title="Fitbit Login"
          label="Fitbit"
          status="Login"
          authorizeUrl="https://www.fitbit.com/oauth2/authorize"
          requestTokenUrl="https://api.fitbit.com/oauth2/token"
          clientId="XXXXX"
          clientSecret="XXXXX"
          scope="profile"
          onAccessToken={async (data) => {
            props.settingsStorage.setItem('user_id', data['user_id'])
          }}
        />
      </Section>
      <Section>
          <Select
  label={`User ID`}
  settingsKey="selection"
  options={[
    {name:"Vivid Vervet",   value:"6ZNXYW"},
    {name:"Zesty Zapus",   value:"6M8KD2"},
    {name:"Yakkety Yak", value:"72HKX6"},
    {name:"Wily Werewolf", value:"6TMF75"},
    {name:"Utopic Unicorn", value:"6GNZJD"},
    {name:"Saucy Salamander", value:"6WPGSS"},
           {name: "aurek1", value: "aurek1"},
           {name: "aurek2", value: "aurek2"},
           {name: "aurek3", value: "aurek3"},
           {name: "aurek4", value: "aurek4"},
           {name: "aurek5", value: "aurek5"},
           {name: "aurek6", value: "aurek6"},
           {name: "aurek7", value: "aurek7"},
           {name: "aurek8", value: "aurek8"},
           {name: "aurek9", value: "aurek9"},
           {name: "aurek10", value: "aurek10"},
           {name: "aurek11", value: "aurek11"},
           {name: "aurek12", value: "aurek12"},
           {name: "aurek13", value: "aurek13"},
           {name: "aurek14", value: "aurek14"},
           {name: "aurek15", value: "aurek15"},
           {name: "aurek16", value: "aurek16"},
           {name: "aurek17", value: "aurek17"},
           {name: "aurek18", value: "aurek18"},
           {name: "aurek19", value: "aurek19"},
           {name: "aurek20", value: "aurek20"},
           {name: "aurek21", value: "aurek21"},
           {name: "aurek22", value: "aurek22"},
           {name: "aurek23", value: "aurek23"},
           {name: "aurek24", value: "aurek24"},
           {name: "aurek25", value: "aurek25"}
  ]}

  onSelection={(option) => props.settingsStorage.setItem('user_id', option.values[0].value)}
/>

      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);