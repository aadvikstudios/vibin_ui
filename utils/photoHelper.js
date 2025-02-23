import { Alert, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { generatePresignedUrlAPI, uploadImageToS3API } from '../api';

/**
 * Handles adding a photo from the camera or gallery.
 * @param {number} index - Index of the photo in the array.
 * @param {Function} setPhotos - Function to update photo state.
 * @param {Object} permissionsGranted - Object containing camera/gallery permissions.
 */
export const handleAddPhoto = async (
  index,
  setPhotos,
  photos,
  permissionsGranted
) => {
  if (!permissionsGranted.gallery && !permissionsGranted.camera) {
    Alert.alert(
      'Permissions Required',
      'Please allow camera and gallery permissions to add photos.'
    );
    return;
  }

  Alert.alert(
    'Choose Action',
    'Do you want to capture a photo or pick from the gallery?',
    [
      {
        text: 'Capture Photo',
        onPress: async () => {
          if (!permissionsGranted.camera) {
            Alert.alert(
              'Permission Denied',
              'Camera access is required to capture photos.'
            );
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [3, 4], // Rectangle aspect ratio
            quality: 1,
          });
          if (!result.canceled) {
            const updatedPhotos = [...photos];
            updatedPhotos[index] = result.assets[0].uri;
            setPhotos(updatedPhotos);
          }
        },
      },
      {
        text: 'Pick from Gallery',
        onPress: async () => {
          if (!permissionsGranted.gallery) {
            Alert.alert(
              'Permission Denied',
              'Gallery access is required to pick photos.'
            );
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4], // Rectangle aspect ratio
            quality: 1,
          });
          if (!result.canceled) {
            const updatedPhotos = [...photos];
            updatedPhotos[index] = result.assets[0].uri;
            setPhotos(updatedPhotos);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};

/**
 * Uploads an image to S3 via a pre-signed URL.
 * @param {string} uri - Local file URI.
 * @param {string} path - S3 folder path (default: "profile-pics/").
 * @returns {Promise<string>} - Returns uploaded file path.
 */
export const uploadImage = async (uri, path = 'profile-pics/') => {
  try {
    const fileName = `${Date.now()}-${uri.split('/').pop()}`;
    const fileType = 'image/jpeg';

    console.log('🚀 Generating Pre-Signed URL...');
    const { url: uploadUrl, fileName: s3Key } = await generatePresignedUrlAPI(
      fileName,
      fileType,
      path
    );

    console.log('✅ Pre-Signed URL Generated: ', uploadUrl);

    console.log('🚀 Uploading image to S3...');
    await uploadImageToS3API(uploadUrl, uri, path);

    console.log('✅ Upload Successful. File Stored as:', s3Key);

    return `${path}${fileName}`;
  } catch (error) {
    console.error('❌ Error uploading image:', error.message);
    throw error;
  }
};

/**
 * Adds a simple animation when pressing a photo frame.
 * @param {Animated.Value} animatedScale - Animated scale value.
 */
export const startAnimation = (animatedScale) => {
  Animated.sequence([
    Animated.timing(animatedScale, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedScale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};
