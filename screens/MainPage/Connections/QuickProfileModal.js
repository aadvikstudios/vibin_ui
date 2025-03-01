import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';

const QuickProfileModal = ({ isVisible, onClose, profile }) => {
  const { colors, roundness, fonts } = useTheme();

  if (!profile) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.surface, borderRadius: roundness },
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={28} color={colors.danger} />
          </TouchableOpacity>

          {/* Profile Picture */}
          <Image source={{ uri: profile.photo }} style={styles.profileImage} />

          {/* Invitee Name */}
          <Text
            style={[
              styles.profileName,
              {
                color: colors.primaryText,
                fontFamily: fonts.displayMedium.fontFamily,
              },
            ]}
          >
            {profile.name}
          </Text>

          {/* Invitee Details */}
          <View style={styles.profileDetails}>
            {profile.bio && (
              <Text
                style={[styles.profileText, { color: colors.secondaryText }]}
              >
                💬 {profile.bio}
              </Text>
            )}
            <Text style={[styles.profileText, { color: colors.primary }]}>
              💖 Looking for: {profile.lookingFor}
            </Text>
            <Text style={[styles.profileText, { color: colors.secondary }]}>
              👀 Gender: {profile.gender}
            </Text>
            <Text style={[styles.profileText, { color: colors.secondaryText }]}>
              🏳️ Orientation: {profile.orientation}
            </Text>
            {profile.interests?.length > 0 && (
              <Text style={[styles.profileText, { color: colors.success }]}>
                🔥 Interests: {profile.interests.join(', ')}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 320,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Adds depth
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  profileDetails: {
    alignItems: 'center',
    width: '100%',
  },
  profileText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 4,
    fontWeight: '500',
  },
});

export default QuickProfileModal;
