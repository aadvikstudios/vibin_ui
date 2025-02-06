import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserProfileUsingEmailAPI } from '../api'; // Import API function
import { useUser } from '../context/UserContext'; // Import User Context

const SplashScreen = ({ navigation }) => {
  const { updateUser } = useUser(); // Access updateUser from UserContext

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

            // Fetch the latest user profile from API
            const updatedProfile = await fetchUserProfileUsingEmailAPI(
              userProfile.emailId
            );

            if (updatedProfile) {
              console.log('✅ Latest profile fetched:', updatedProfile);

              // Update user context
              updateUser(updatedProfile);

              // Store the updated profile locally in AsyncStorage
              await AsyncStorage.setItem(
                'userProfile',
                JSON.stringify(updatedProfile)
              );

              console.log('✅ User profile updated and stored locally.');
            }
          } else {
            console.log(
              '⚠️ Email ID missing in stored profile. Skipping profile update.'
            );
          }

          // Navigate to MainPage after profile update
          navigation.replace('MainPage');
        } else {
          console.log('❌ No user profile found, navigating to Login...');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('⚠️ Error checking/updating user session:', error);
        navigation.replace('Login'); // Fallback to login
      }
    };

    setTimeout(() => {
      checkUserSession();
    }, 2000); // Simulate loading time
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>VibinConnect</Text>
      <ActivityIndicator size="large" color="#ff6f61" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6f61',
    marginBottom: 20,
  },
});

export default SplashScreen;
