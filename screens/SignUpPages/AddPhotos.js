import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import {
  fetchGalleryPermission,
  fetchCameraPermission,
} from '../../utils/permissionsHelper';
import { generatePresignedUrlAPI, uploadImageToS3API } from '../../api';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons

const AddPhotos = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();
  const [photos, setPhotos] = useState(Array(6).fill(null)); // Array to store photos
  const [permissionsGranted, setPermissionsGranted] = useState({
    gallery: false,
    camera: false,
  });
  const [isUploading, setIsUploading] = useState(false); // Upload state

  useEffect(() => {
    // Request permissions on component mount
    const requestPermissions = async () => {
      const galleryPermission = await fetchGalleryPermission();
      const cameraPermission = await fetchCameraPermission();
      setPermissionsGranted({
        gallery: galleryPermission,
        camera: cameraPermission,
      });
    };

    requestPermissions();
  }, []);

  const handleAddPhoto = async (index) => {
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
              aspect: [1, 1],
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
              aspect: [1, 1],
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

  const uploadImage = async (uri) => {
    try {
      const fileName = uri.split('/').pop();
      const fileType = 'image/jpeg';

      const { url, fileName: s3Key } = await generatePresignedUrlAPI(
        fileName,
        fileType
      );

      await uploadImageToS3API(url, uri);

      return s3Key;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }
  };

  const handleNext = async () => {
    try {
      const filteredImages = photos.filter(Boolean); // Remove null entries
      // if (filteredImages.length < 2) {
      //   Alert.alert('Error', 'Please add at least 2 photos to proceed.');
      //   return;
      // }

      setIsUploading(true);

      const uploadedImageKeys = await Promise.all(
        filteredImages.map((uri) => uploadImage(uri))
      );

      updateUser('photos', uploadedImageKeys); // Save photo keys globally
      console.log('Uploaded Photos:', uploadedImageKeys);

      navigation.navigate('Permissions'); // Navigate to the next step
    } catch (error) {
      console.error('Error uploading photos:', error.message);
      Alert.alert('Error', 'Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="Add photos"
        subtitle="Add at least two photos to proceed."
        currentStep={9}
      />
      <View style={styles.content}>
        <View style={styles.photoGrid}>
          {photos.map((photo, index) => (
            <View
              key={index}
              style={[
                styles.photoBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {photo ? (
                <>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.crossIconContainer}
                    onPress={() => {
                      const updatedPhotos = [...photos];
                      updatedPhotos[index] = null;
                      setPhotos(updatedPhotos);
                    }}
                  >
                    <MaterialIcons
                      name="close"
                      size={10}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => handleAddPhoto(index)}>
                  <MaterialIcons
                    name="add"
                    size={30}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        <Text style={[styles.helperText, { color: colors.secondaryText }]}>
          Show off your best sides. Tip: Members with at least three clear,
          well-lit, and recent photos receive 5x more Likes than members with
          just one photo.
        </Text>
      </View>
      {isUploading && <ActivityIndicator size="large" color={colors.primary} />}
      <Footer
        buttonText="Next"
        onPress={handleNext}
        // disabled={photos.filter((p) => p !== null).length < 2 || isUploading} // Ensure at least two photos
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  photoBox: {
    width: '30%',
    aspectRatio: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative', // To allow absolutely positioned elements
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  crossIconContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Background for better visibility
    borderRadius: 12,
    padding: 2,
  },
  helperText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});
export default AddPhotos;
