import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getPresignedReadUrlAPI } from '../../../api'; // Import the API function

const PhotoSlider = ({ photos }) => {
  const { colors } = useTheme();
  const [photoUrls, setPhotoUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotoUrls = async () => {
      try {
        const urls = await Promise.all(
          photos.map((photoKey) => getPresignedReadUrlAPI(photoKey))
        );
        setPhotoUrls(urls);
      } catch (error) {
        console.error('Error fetching photo URLs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoUrls();
  }, [photos]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.photoSliderContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={photoUrls}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.profilePhoto} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  photoSliderContainer: {
    height: 200,
    marginTop: 20,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoSlider;
