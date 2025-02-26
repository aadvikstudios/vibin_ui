import {
  fetchMessagesAPI,
  markMessagesReadAPI,
  likeMessageAPI,
  generatePresignedUrlAPI,
  uploadImageToS3API,
  sendMessageAPI,
} from '../../../api';
import { debounce } from 'lodash';

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

  const message = {
    messageId: `${matchId}-${Date.now()}-${Math.random()}`, // Unique message ID
    matchId, // Match ID
    senderId: userData.emailId, // Sender's handle (User's email ID)
    content: inputText.trim(), // Message content
    createdAt: new Date().toISOString(), // Timestamp in ISO format
    isUnread: 'true', // Ensure it's stored as a string ("true" or "false")
    liked: false, // Default message is not liked
  };

  // ✅ Send message with debounce to prevent spam clicks
  debouncedSendMessage(sendMessage, message);

  // ✅ Clear input field
  setInputText('');
};

// ✅ Debounced function to prevent multiple rapid message sends
const debouncedSendMessage = debounce((sendMessage, message) => {
  sendMessage(message);
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
