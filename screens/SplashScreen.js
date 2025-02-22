import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserProfileUsingEmailAPI } from '../api';
import { useUser } from '../context/UserContext';

const SplashScreen = ({ navigation }) => {
  const { updateUser } = useUser();
  const { colors } = useTheme(); // 🎨 Get colors from theme

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        console.log('🔍 Checking AsyncStorage for user profile...');
        const userProfileData = await AsyncStorage.getItem('userProfile');

        if (userProfileData) {
          const userProfile = JSON.parse(userProfileData);
          console.log('✅ User profile found:', userProfile);

          if (userProfile.emailId) {
            console.log('📡 Fetching latest profile for:', userProfile.emailId);
            const updatedProfile = await fetchUserProfileUsingEmailAPI(
              userProfile.emailId
            );

            if (updatedProfile) {
              console.log('✅ Latest profile fetched:', updatedProfile);
              updateUser(updatedProfile);
              await AsyncStorage.setItem(
                'userProfile',
                JSON.stringify(updatedProfile)
              );
              console.log('✅ User profile updated and stored locally.');
            }
          }

          // Navigate to MainPage after profile update
          navigation.replace('MainPage');
        } else {
          console.log('❌ No user profile found, navigating to Login...');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('⚠️ Error checking/updating user session:', error);
        navigation.replace('Login');
      }
    };

    setTimeout(() => {
      checkUserSession();
    }, 2000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* App Logo */}
      <Image source={require('../assets/icon.png')} style={styles.logo} />

      {/* App Name */}
      <Text style={[styles.logoText, { color: colors.primary }]}>
        VibinConnect
      </Text>

      {/* Loading Indicator */}
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
});

export default SplashScreen;
