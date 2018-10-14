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
            console.log(data['user_id'])
            props.settingsStorage.setItem('user_id', data['user_id'])
          }}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);