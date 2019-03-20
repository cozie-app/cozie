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
  label={`Selection`}
  settingsKey="selection"
  options={[
    {name:"Vivid Vervet",   value:"6ZNXYW"},
    {name:"Zesty Zapus",   value:"6M8KD2"},
    {name:"Yakkety Yak", value:"72HKX6"},
    {name:"Wily Werewolf", value:"6TMF75"},
    {name:"Utopic Unicorn", value:"66NZJD"},
    {name:"Saucy Salamander", value:"6WPGSS"},
  ]}

  onSelection={(option) => props.settingsStorage.setItem('user_id', option.values[0].value)}
/>

      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);