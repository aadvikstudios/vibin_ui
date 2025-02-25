import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const InviteUserModal = ({ visible, onClose, onInvite }) => {
  const { colors } = useTheme();
  const [userHandle, setUserHandle] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleInvitePress = () => {
    if (!userHandle.trim()) return;
    onInvite(userHandle, setLoading); // ✅ Pass setLoading to handleUserInvite
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {/* Modal Header with Icon */}
          <View style={styles.header}>
            <Ionicons
              name="people-circle-outline"
              size={50}
              color={colors.primary}
            />
            <Text style={[styles.title, { color: colors.primaryText }]}>
              Invite a Third Person
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: colors.secondaryText }]}>
            Want to spice things up? You and your match can add a third person
            to this chat! Enter their username below. Your match will need to
            approve this invite.
          </Text>

          {/* Input Field */}
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.primaryText,
                backgroundColor: colors.backgroundSecondary,
              },
            ]}
            placeholder="Enter @username"
            placeholderTextColor={colors.secondaryText}
            value={userHandle}
            onChangeText={setUserHandle}
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleInvitePress}
              disabled={loading} // ✅ Disable button when loading
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} /> // ✅ Show loader instead of button text
              ) : (
                <>
                  <Ionicons
                    name="send-outline"
                    size={20}
                    color={colors.onPrimary}
                  />
                  <Text
                    style={[styles.buttonText, { color: colors.onPrimary }]}
                  >
                    Send Invite
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.secondary }]}
              onPress={onClose}
              disabled={loading} // ✅ Disable cancel button when loading
            >
              <Ionicons
                name="close-outline"
                size={20}
                color={colors.onSecondary}
              />
              <Text style={[styles.buttonText, { color: colors.onSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          <Text style={[styles.footerNote, { color: colors.secondaryText }]}>
            Your match will be notified and must approve this invite before the
            chat expands.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ Dim background effect
  },
  modal: {
    width: '85%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5, // ✅ Subtle shadow
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  footerNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default InviteUserModal;
