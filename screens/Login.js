import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

const Login = ({ navigation }) => {
  const { colors } = useTheme(); // Access the theme colors

  const handleJoin = () => {
    navigation.navigate('Email');
  };

  const handleLogin = () => {
    navigation.navigate('MainPage');
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')} // Replace with your background image path
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
          mode="outlined"
          onPress={handleLogin}
          style={[
            styles.button,
            { borderColor: colors.primary, borderWidth: 1 },
          ]}
          labelStyle={{ color: colors.primary }}
        >
          Log in
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Default overlay will be overridden by theme's `overlay` color if available
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    width: '80%',
    borderRadius: 24,
  },
});

export default Login;
