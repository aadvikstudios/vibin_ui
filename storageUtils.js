import AsyncStorage from '@react-native-async-storage/async-storage';

// Save user profile
export const saveUserProfile = async (userProfile) => {
  try {
    await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const profile = await AsyncStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

// Remove user profile (Logout)
export const removeUserProfile = async () => {
  try {
    await AsyncStorage.removeItem('userProfile');
  } catch (error) {
    console.error('Error removing user profile:', error);
  }
};
