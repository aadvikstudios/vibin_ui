import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

/**
 * Requests location permissions and fetches the user's current location.
 * @returns {Promise<{latitude: number, longitude: number} | null>} The user's location or null if not granted.
 */
export const fetchPermissionAndLocation = async () => {
  try {
    const { status: locationStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (locationStatus === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log(
        'Location Access Granted\n',
        `Your location is:\nLatitude: ${latitude}\nLongitude: ${longitude}`
      );
      return { latitude, longitude };
    } else {
      Alert.alert(
        'Permission Required',
        'Location permission is needed to personalize your experience.'
      );
      return null;
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return null;
  }
};

/**
 * Requests camera permissions.
 * @returns {Promise<boolean>} True if granted, false otherwise.
 */
export const fetchCameraPermission = async () => {
  try {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus === 'granted') {
      return true;
    } else {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed for capturing photos.'
      );
      return false;
    }
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

/**
 * Requests media library (gallery) permissions.
 * @returns {Promise<boolean>} True if granted, false otherwise.
 */
export const fetchGalleryPermission = async () => {
  try {
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryStatus === 'granted') {
      return true;
    } else {
      Alert.alert(
        'Permission Required',
        'Gallery permission is needed to upload photos.'
      );
      return false;
    }
  } catch (error) {
    console.error('Error requesting gallery permission:', error);
    return false;
  }
};

/**
 * Requests notification permissions.
 * @returns {Promise<boolean>} True if granted, false otherwise.
 */
export const fetchNotificationPermission = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      console.log('Notification permission granted.');
      return true;
    } else {
      Alert.alert(
        'Permission Required',
        'Notification permission is needed to stay updated.'
      );
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};
