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
          clientId="22D947"
          clientSecret="XXXXX"
          scope="XXXXX"
          onAccessToken={async (data) => {
            props.settingsStorage.setItem('user_id', data['user_id'])
          }}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);