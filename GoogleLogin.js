import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import Firebase auth

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          Alert.alert('Success', `Welcome ${userCredential.user.displayName}`);
          console.log('User Info:', userCredential.user);
        })
        .catch((error) => {
          Alert.alert('Login Failed', error.message);
          console.error('Google Sign-In Error:', error);
        });
    }
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}
