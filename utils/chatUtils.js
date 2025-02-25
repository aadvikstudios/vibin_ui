import { Alert } from 'react-native';
import axios from 'axios'; // ✅ Integrate backend API calls
import { API_BASE_URL } from '../config';

export const checkPendingInvites = async (approverId) => {
  console.log('🚀 checkPendingInvites called');
  console.log('📌 Approver ID received:', approverId);

  try {
    console.log('⏳ Fetching pending invites from API...');
    const response = await axios.get(
      `${API_BASE_URL}/api/invites/pending/${approverId}`
    );

    console.log('📨 API Response:', response.data);

    if (response.status === 200) {
      console.log(`✅ Found ${response.data.length} pending invites`);
      return response.data; // Returns the list of pending invites
    }

    console.log('❌ No pending invites found.');
    return [];
  } catch (error) {
    console.error(
      '❌ Error checking pending invites:',
      error?.response?.data || error
    );
    return [];
  }
};

/**
 * Handles user invitation within the chat.
 * @param {Object} params - The parameters for invite.
 */
export const handleUserInvite = async ({
  invitedUserHandle,
  initiatorUserEmail,
  setModalVisible,
  sendMessage,
  secondUserEmail,
  setLoading, // ✅ New parameter to handle loading state
}) => {
  console.log('🚀 handleUserInvite called');
  console.log('📌 Params received:', {
    invitedUserHandle,
    initiatorUserEmail,
    secondUserEmail,
  });

  try {
    setLoading(true); // ✅ Show loading while sending invite
    console.log('⏳ Sending invite...');

    const payload = {
      inviterId: initiatorUserEmail, // ✅ User A (Initiator)
      invitedUserId: invitedUserHandle, // ✅ User C (New user to be added)
      approverId: secondUserEmail, // ✅ User B (Existing chat partner who approves)
      inviteType: 'group',
    };

    console.log('📨 Payload being sent to API:', payload);

    const response = await axios.post(`${API_BASE_URL}/api/invites`, payload);

    console.log('✅ Invite sent successfully, response:', response.data);
  } catch (error) {
    console.error('❌ Error sending invite:', error?.response?.data || error);
  } finally {
    setLoading(false); // ✅ Hide loading state
    console.log('🔄 Resetting modal visibility...');
    setModalVisible(false); // ✅ Close modal after request completes
  }
};
