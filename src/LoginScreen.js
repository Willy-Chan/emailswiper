import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { useNavigation } from '@react-navigation/native';

// Azure AD / Microsoft Graph OAuth via expo-auth-session
const CLIENT_ID = '6090dc45-e40b-40a2-8a7f-a79c74ab6594';
const TENANT_ID = 'common';
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });
console.log('Redirect URI:', REDIRECT_URI);
const SCOPES = ['openid', 'profile', 'Mail.Read'];

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
};

export default function LoginScreen() {

  const navigation = useNavigation();
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri: REDIRECT_URI,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  useEffect(() => {
    console.log('Auth response:', response);
    if (response?.type === 'success') {
      const token = response.params.access_token;
      console.log('Access token:', token);
      fetch('https://graph.microsoft.com/v1.0/me/messages?$top=5', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(json => {
          console.log('Fetched mails:', json.value);
          navigation.replace('Main');
        })
        .catch(err => console.log('Fetch error:', err));
    } else if (response?.type === 'error') {
      console.log('Auth error:', response.error);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Outlook</Text>
      <Button
        title="Sign In"
        disabled={!request}
        onPress={() => {
          console.log('Prompting auth...');
          promptAsync({ useProxy: true });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
