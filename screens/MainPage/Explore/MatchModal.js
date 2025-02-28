import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { getPresignedReadUrlAPI } from '../../../api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MatchModal = ({ visible, profile, onSendMessage, onLater }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  console.log('profile', profile);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (profile?.photo) {
        try {
          const url = await getPresignedReadUrlAPI(profile.photo);
          setPhotoUrl(url);
        } catch (error) {
          console.error('Error fetching pre-signed URL:', error);
        }
      }
    };

    fetchPhotoUrl();
  }, [profile]);

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
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
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onSendMessage}
            >
              <Text style={styles.primaryButtonText}>Send a message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onLater}>
              <Text style={styles.secondaryButtonText}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dimmed background
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: screenWidth * 0.9,
    backgroundColor: '#ff4500', // Match background color
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: screenHeight * 0.45,
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
    paddingVertical: 20,
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
    marginBottom: 20,
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

export default MatchModal;
