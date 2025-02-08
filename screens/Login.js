import React, { useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Alert } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../firebaseConfig'; // Import from the new file
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
  const { colors } = useTheme();
  const handleJoin = () => {
    navigation.navigate('Email');
  };
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          Alert.alert(
            'Login Successful',
            `Welcome ${userCredential.user.displayName}`
          );
          navigation.navigate('MainPage');
        })
        .catch((error) => {
          Alert.alert('Login Failed', error.message);
        });
    }
  }, [response]);

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: colors.overlay || 'rgba(0, 0, 0, 0.3)' },
        ]}
      >
        <Text style={[styles.title, { color: colors.primary }]}>VIBIN</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          A dating app for the curious
        </Text>
        <Button
          mode="contained"
          onPress={handleJoin}
          style={[styles.button, { backgroundColor: colors.primary }]}
          labelStyle={{ color: colors.onPrimary }}
        >
          Join Vibin
        </Button>
        <Button
          mode="contained"
          onPress={() => promptAsync()}
          disabled={!request}
          style={[styles.googleButton, { backgroundColor: '#4285F4' }]}
          labelStyle={{ color: '#fff' }}
        >
          Sign in with Google
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 36, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 40, textAlign: 'center' },
  googleButton: {
    marginTop: 16,
    paddingVertical: 10,
    width: '80%',
    borderRadius: 24,
  },
});

export default Login;
