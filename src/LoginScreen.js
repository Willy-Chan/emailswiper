import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { useNavigation } from '@react-navigation/native';

// Google OAuth2 settings
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // TODO: Replace with your client id
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });

console.log('Redirect URI:', REDIRECT_URI);
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'email', 'profile', 'openid'];

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
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
    if (response?.type === 'success') {
      const token = response.params.access_token;
      fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(async json => {
          if (json.messages && json.messages.length > 0) {
            // Fetch the details for each message
            const details = await Promise.all(json.messages.map(msg =>
              fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`, {
                headers: { Authorization: `Bearer ${token}` },
              }).then(r => r.json())
            ));
            console.log('First 5 emails:', details);
          } else {
            console.log('No emails found.');
          }
          navigation.replace('Main');
        })
        .catch(err => console.log('Fetch error:', err));
    } else if (response?.type === 'error') {
      console.log('Auth error:', response.error);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Gmail</Text>
      <Button
        title="Sign In with Google"
        disabled={!request}
        onPress={() => {
          console.log('Prompting Google OAuth...');
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
