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
import { handleUserInvite } from '../ChatContainer/chatUtils';

const InviteUserModal = ({
  visible,
  onClose,
  inviterHandle,
  approverHandle,
}) => {
  const { colors } = useTheme();
  const [userHandle, setUserHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  const handleInvitePress = async () => {
    if (!userHandle.trim()) {
      setError('Please enter a username');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    const { success, message } = await handleUserInvite({
      inviteeHandle: userHandle,
      inviterHandle,
      approverHandle,
    });

    setLoading(false);

    if (success) {
      setMessage(message); // ✅ Show success message
      setUserHandle(''); // ✅ Clear input field
    } else {
      setError(message); // ❌ Show error message
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {/* Header */}
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
                borderColor: error ? colors.error : colors.border,
                color: colors.primaryText,
                backgroundColor: colors.backgroundSecondary,
              },
            ]}
            placeholder="Enter @username"
            placeholderTextColor={colors.secondaryText}
            value={userHandle}
            onChangeText={(text) => {
              setUserHandle(text);
              setError('');
              setMessage('');
            }}
            editable={!loading}
          />

          {/* Error or Success Message */}
          {error ? (
            <View style={styles.messageContainer}>
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={colors.error}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {message ? (
            <View style={styles.messageContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={colors.success}
              />
              <Text style={styles.successText}>{message}</Text>
            </View>
          ) : null}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleInvitePress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} />
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
              disabled={loading}
            >
              <Ionicons
                name="close-outline"
                size={20}
                color={colors.onSecondary}
              />
              <Text style={[styles.buttonText, { color: colors.onSecondary }]}>
                Close
              </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '85%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
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
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginLeft: 5,
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
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
});

export default InviteUserModal;
