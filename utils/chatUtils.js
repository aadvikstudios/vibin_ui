import { Alert } from 'react-native';
import axios from 'axios'; // ✅ Integrate backend API calls
import { API_BASE_URL } from '../config';

/**
 * Handles user invitation within the chat.
 * @param {Object} params - The parameters for invite.
 */
export const handleUserInvite = async ({
  userHandle,
  userData,
  setModalVisible,
  sendMessage,
  secondUserEmail,
}) => {
  Alert.alert(
    'Invite User',
    `Do you want to invite @${userHandle} to this chat?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Invite',
        onPress: async () => {
          try {
            // ✅ Send WebSocket Message
            sendMessage({
              type: 'invite_request',
              from: userData.userHandle,
              invitedUser: userHandle,
            });

            // ✅ Send API request to backend
            const payload = {
              inviterId: userData.emailId, // ✅ User A (Initiator)
              invitedUserId: userHandle, // ✅ User C (New user to be added)
              approverId: secondUserEmail, // ✅ User B (Existing chat partner who approves)
            };

            const response = await axios.post(
              `${API_BASE_URL}/api/invites`,
              payload
            );

            if (response.status === 200) {
              Alert.alert('Success', 'Invitation sent successfully!');
            } else {
              Alert.alert('Error', 'Something went wrong.');
            }
          } catch (error) {
            console.error('Error sending invite:', error);
            Alert.alert('Error', 'Failed to send invitation.');
          }

          setModalVisible(false);
        },
      },
    ]
  );
};
