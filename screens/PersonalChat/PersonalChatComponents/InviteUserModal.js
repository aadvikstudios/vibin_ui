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
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  const handleInvitePress = async () => {
    if (!userHandle.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);
    console.log('approverHandle', approverHandle);
    const { success, message } = await handleUserInvite({
      inviteeHandle: userHandle,
      groupName,
      inviterHandle,
      approverHandle,
    });

    setLoading(false);

    if (success) {
      setMessage(message); // ✅ Show success message
      setUserHandle(''); // ✅ Clear input field
      setGroupName(''); // ✅ Clear group name input
    } else {
      setError(message); // ❌ Show error message
    }
  };

  // ✅ Reset state when modal is closed
  const handleClose = () => {
    setUserHandle('');
    setGroupName('');
    setMessage(null);
    setError('');
    setLoading(false);
    onClose();
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

          {/* Show input fields and buttons only if no success message */}
          {!message ? (
            <>
              {/* Description */}
              <Text
                style={[styles.description, { color: colors.secondaryText }]}
              >
                Want to spice things up? You and your match can add a third
                person to this chat! Enter their username below along with a
                group name. Your match will need to approve this invite.
              </Text>

              {/* Input Field - Group Name */}
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: error ? colors.error : colors.border,
                    color: colors.primaryText,
                    backgroundColor: colors.backgroundSecondary,
                    marginBottom: 10, // Added spacing between inputs
                  },
                ]}
                placeholder="Give your trio a name!"
                placeholderTextColor={colors.secondaryText}
                value={groupName}
                onChangeText={(text) => {
                  setGroupName(text);
                  setError('');
                  setMessage('');
                }}
                editable={!loading}
              />

              {/* Input Field - Username */}
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

              {/* Error Message */}
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

              {/* Invite Button */}
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
            </>
          ) : (
            // ✅ Show success message and close button only
            <View style={styles.successContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={40}
                color={colors.success}
              />
              <Text
                style={[
                  styles.successText,
                  { fontSize: 16, textAlign: 'center' },
                ]}
              >
                {message}
              </Text>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.secondary, marginTop: 15 },
            ]}
            onPress={handleClose}
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
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default InviteUserModal;
