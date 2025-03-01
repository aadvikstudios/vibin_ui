import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { getPresignedReadUrlAPI } from '../../../api';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MatchModal = ({ visible, profile, onSendMessage, onLater }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [message, setMessage] = useState('');
  const { colors } = useTheme();

  useEffect(() => {
    if (profile?.photo) {
      getPresignedReadUrlAPI(profile.photo)
        .then(setPhotoUrl)
        .catch((error) => console.error('Error fetching photo:', error));
    }
  }, [profile]);
  useEffect(() => {
    console.log('🚀 MatchModal Visibility Updated:', visible);
    console.log('🚀 Profile Data:', profile);
  }, [visible, profile]);

  if (!visible) {
    console.log('🚫 Modal is not visible, returning null.');
    return null;
  }

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
          <View style={styles.imageContainer}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.image} />
            ) : (
              <Text
                style={[styles.placeholderText, { color: colors.onSurface }]}
              >
                Loading photo...
              </Text>
            )}
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.onPrimary }]}>
              You connected with {profile?.name || 'Unknown'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.onPrimary }]}>
              Be bold and say hi!
            </Text>

            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.onSurface }]}
                placeholder="Send a message..."
                placeholderTextColor={colors.placeholder}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity
                onPress={() => {
                  if (message.trim()) {
                    onSendMessage(message);
                    setMessage('');
                  }
                }}
                style={styles.sendButton}
              >
                <Ionicons name="send" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={onLater}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: colors.onSecondary },
                ]}
              >
                Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ✅ Updated Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 0.3 for 70% transparency
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: screenWidth * 0.9,
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
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
  },
  secondaryButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MatchModal;
