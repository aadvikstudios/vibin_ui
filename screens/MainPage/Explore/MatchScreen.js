import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getPresignedReadUrlAPI } from '../../../api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MatchScreen = ({ profile, onSendMessage, onLater }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (profile?.photos && profile.photos[0]) {
        try {
          const url = await getPresignedReadUrlAPI(profile.photos[0]);
          setPhotoUrl(url);
        } catch (error) {
          console.error('Error fetching pre-signed URL:', error);
        }
      }
    };

    fetchPhotoUrl();
  }, [profile]);

  return (
    <View style={styles.container}>
      {/* Image section */}
      <View style={styles.imageContainer}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Loading photo...</Text>
          </View>
        )}
      </View>

      {/* Text and buttons section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          You connected with {profile?.name || 'Unknown'}
        </Text>
        <Text style={styles.subtitle}>
          Feelings are mutual. Be bold and play nice.
        </Text>

        {/* Action buttons */}
        <TouchableOpacity style={styles.primaryButton} onPress={onSendMessage}>
          <Text style={styles.primaryButtonText}>Send a message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onLater}>
          <Text style={styles.secondaryButtonText}>Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4500', // Match background color
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    width: screenWidth,
    height: screenHeight * 0.5,
    borderBottomLeftRadius: screenWidth / 2,
    borderBottomRightRadius: screenWidth / 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 15,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4500',
  },
  secondaryButton: {
    backgroundColor: '#a63c00',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MatchScreen;
