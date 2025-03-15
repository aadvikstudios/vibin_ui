import {
  fetchMessagesAPI,
  markMessagesReadAPI,
  likeMessageAPI,
  generatePresignedUrlAPI,
  uploadImageToS3API,
  sendMessageAPI,
  checkUserHandleAPI,
} from '../../../api';
import { debounce } from 'lodash';

import axios from 'axios'; // ✅ Integrate backend API calls
import { API_BASE_URL } from '../../../config';

import * as ImagePicker from 'expo-image-picker';

/** Fetch Messages */
export const fetchMessages = async (
  matchId,
  setMessages,
  setLoading,
  setRefreshing,
  messageIds
) => {
  try {
    if (!setRefreshing) setLoading(true);
    const data = await fetchMessagesAPI(matchId, 50);
    console.log('data is ', data);
    setMessages(data);
    data.forEach((msg) => messageIds.current.add(msg.messageId));
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

/** Mark Messages as Read */
export const markMessagesRead = async (matchId, userhandle) => {
  try {
    await markMessagesReadAPI(matchId, userhandle);
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
  }
};
export const handleSendMessage = (
  inputText,
  matchId,
  userData,
  sendMessage,
  setInputText
) => {
  if (!inputText.trim()) return;
  const generateUniqueId = () =>
    `${matchId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const message = {
    messageId: generateUniqueId(), // Unique message ID
    matchId, // Match ID
    senderId: userData.emailId, // Sender's handle (User's email ID)
    content: inputText.trim(), // Message content
    createdAt: new Date().toISOString(), // Timestamp in ISO format
    isUnread: 'true', // Ensure it's stored as a string ("true" or "false")
    liked: false, // Default message is not liked
    imageUrl: null,
  };

  // ✅ Send message with debounce to prevent spam clicks
  debouncedSendMessage(sendMessage, message);

  // ✅ Clear input field
  setInputText('');
};

const sentMessageIds = new Set(); // Prevent duplicate messages

const debouncedSendMessage = debounce((sendMessage, message) => {
  if (!sentMessageIds.has(message.messageId)) {
    sentMessageIds.add(message.messageId);
    sendMessage(message);
  }
}, 500);

export const pickImageAndUpload = async (
  matchId,
  sendMessage,
  userData,
  path = 'chat-images/'
) => {
  // ✅ Request permission to access the media library
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert('You need to allow permission to access the gallery.');
    return;
  }

  // ✅ Launch image picker
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    try {
      const imageUri = result.assets[0].uri;
      const fileName = `${matchId}-${Date.now()}.jpg`;
      const fileType = 'image/jpeg';

      console.log('📂 Upload path:', path);

      // ✅ 1️⃣ Generate Pre-Signed URL for S3 upload
      const { url: uploadUrl, fileName: s3Key } = await generatePresignedUrlAPI(
        fileName,
        fileType,
        path
      );

      // ✅ 2️⃣ Upload Image to S3
      await uploadImageToS3API(uploadUrl, imageUri, path);

      // ✅ 3️⃣ Store only the relative path in DB
      const storedFilePath = `${path}${fileName}`;
      console.log('✅ Stored file path:', storedFilePath);

      // ✅ 4️⃣ Create message payload
      const message = {
        messageId: `${matchId}-${Date.now()}-${Math.random()}`, // Unique ID
        matchId: String(matchId), // Ensure matchId is a string
        senderId: userData.emailId, // Sender's ID
        content: '[ Image ]', // Placeholder text for image messages
        imageUrl: storedFilePath, // Store relative image path
        createdAt: new Date().toISOString(), // Timestamp
        isUnread: 'true', // Stored as a string in DB
        liked: false, // Default liked status
      };

      // ✅ 5️⃣ Send message to local state and backend
      sendMessage(message); // Update UI instantly
      sendMessageAPI(message); // Send to backend
    } catch (error) {
      console.error('❌ Image upload failed:', error);
    }
  }
};

export const likeMessage = async (
  socket,
  matchId,
  createdAt, // ✅ Use createdAt instead of messageId
  liked,
  setMessages
) => {
  if (!socket) {
    console.error('❌ Socket not available');
    return;
  }

  try {
    // ✅ 1️⃣ Optimistically update UI before backend confirmation
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.createdAt === createdAt ? { ...msg, liked } : msg
      )
    );

    // ✅ 2️⃣ Emit event to the WebSocket server (Real-time update)
    socket.emit('likeMessage', { matchId, createdAt, liked });

    console.log(`👍 Like event sent: Message at ${createdAt}, Liked: ${liked}`);

    // ✅ 3️⃣ Send like status update to the backend
    await likeMessageAPI(matchId, createdAt, liked);

    console.log(
      `✅ Like status updated in backend for message at ${createdAt}`
    );
  } catch (error) {
    console.error('❌ Failed to like message:', error);

    // ❌ 4️⃣ Rollback UI update if an error occurs
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.createdAt === createdAt ? { ...msg, liked: !liked } : msg
      )
    );
  }
};

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

export const handleUserInvite = async ({
  inviteeHandle,
  groupName,
  inviterHandle,
  approverHandle,
}) => {
  console.log('🚀 handleUserInvite called');

  if (!inviteeHandle.trim()) {
    return { success: false, message: 'Please enter a valid user handle.' };
  }

  try {
    // ✅ Ensure all handles are lowercase before sending the request
    const payload = {
      inviterHandle: inviterHandle.toLowerCase(),
      groupName,
      inviteeHandle: inviteeHandle.toLowerCase(),
      approverHandle: approverHandle.toLowerCase(),
    };

    console.log('📨 Payload being sent to API:', payload);

    const response = await axios.post(
      `${API_BASE_URL}/api/groupinteractions/invite`,
      payload
    );

    console.log('✅ Invite sent successfully:', response.data);

    return {
      success: true,
      message: `Hey! We've sent the invitation approval request to @${approverHandle.toLowerCase()} (Approval ID: ${approverHandle}). As soon as they give the go-ahead, @${inviteeHandle.toLowerCase()} will get the invite, and we'll get the group rolling! 🎉`,
    };
  } catch (error) {
    console.error('❌ Error sending invite:', error?.response?.data || error);

    if (error?.response?.status === 404) {
      return { success: false, message: 'The entered user does not exist.' };
    } else if (error?.response?.status === 400) {
      return {
        success: false,
        message: 'Invalid request. Please check details.',
      };
    } else {
      return {
        success: false,
        message: 'Failed to send the invite. Please try again.',
      };
    }
  }
};
