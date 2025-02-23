import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import {
  fetchGalleryPermission,
  fetchCameraPermission,
} from '../../utils/permissionsHelper';
import {
  handleAddPhoto,
  uploadImage,
  startAnimation,
} from '../../utils/photoHelper';
import { MaterialIcons } from '@expo/vector-icons';

const AddPhotos = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();
  const [photos, setPhotos] = useState(Array(6).fill(null)); // Array to store photos
  const [permissionsGranted, setPermissionsGranted] = useState({
    gallery: false,
    camera: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const animatedScale = useState(new Animated.Value(1))[0];

  useEffect(() => {
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

  const handleNext = async () => {
    try {
      const filteredImages = photos.filter(Boolean);

      if (filteredImages.length < 1) {
        Alert.alert('Error', 'Please add at least one photo to proceed.');
        return;
      }

      setIsUploading(true);

      const uploadedImageKeys = await Promise.all(
        filteredImages.map((uri) => uploadImage(uri))
      );

      updateUser('photos', uploadedImageKeys);
      console.log('Uploaded Photos:', uploadedImageKeys);

      navigation.navigate('Permissions');
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
        title="Add Photos"
        subtitle="Add at least one photo to proceed."
        currentStep={9}
      />
      <View style={styles.content}>
        <View style={styles.photoGrid}>
          {photos.map((photo, index) => (
            <Animated.View
              key={index}
              style={[
                styles.photoBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  transform: [{ scale: animatedScale }],
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
                      size={14}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    startAnimation(animatedScale);
                    handleAddPhoto(
                      index,
                      setPhotos,
                      photos,
                      permissionsGranted
                    );
                  }}
                >
                  <MaterialIcons
                    name="add"
                    size={35}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
              )}
            </Animated.View>
          ))}
        </View>
        <Text style={[styles.helperText, { color: colors.secondaryText }]}>
          Show off your best sides. Members with at least three recent photos
          receive 5x more Likes!
        </Text>
      </View>
      {isUploading && <ActivityIndicator size="large" color={colors.primary} />}
      <Footer buttonText="Next" onPress={handleNext} />
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
