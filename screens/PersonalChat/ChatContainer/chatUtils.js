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
export const markMessagesRead = async (matchId) => {
  try {
    await markMessagesReadAPI(matchId);
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
    messageId: `${matchId}-${Date.now()}-${Math.random()}`,
    matchId,
    senderId: userData.emailId,
    content: inputText.trim(),
    createdAt: new Date().toISOString(),
  };

  debouncedSendMessage(sendMessage, message);
  setInputText('');
};

const debouncedSendMessage = debounce((sendMessage, message) => {
  sendMessage(message);
}, 500);

/** Pick Image & Upload to S3 */
export const pickImageAndUpload = async (
  matchId,
  sendMessage,
  userData,
  path = 'chat-images/'
) => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert('You need to allow permission to access the gallery.');
    return;
  }

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
      console.log('path is ', path);
      // 1️⃣ Generate Pre-Signed URL for chat-images/
      const { url: uploadUrl, fileName: s3Key } = await generatePresignedUrlAPI(
        fileName,
        fileType,
        path
      );

      // 2️⃣ Upload Image to S3
      await uploadImageToS3API(uploadUrl, imageUri, path);

      // 3️⃣ Store only the relative path
      const storedFilePath = `${path}${fileName}`;
      console.log('stored file path is ', storedFilePath);
      // 4️⃣ Send message with the image URL
      const message = {
        messageId: `${matchId}-${Date.now()}-${Math.random()}`,
        matchId: String(matchId),
        senderId: userData.emailId,
        content: '',
        imageUrl: storedFilePath, // Store relative path
        createdAt: new Date().toISOString(),
      };

      sendMessage(message);
      sendMessageAPI(message);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }
};

/** Like Message */
// export const likeMessage = async (
//   matchId,
//   createdAt,
//   messageId,
//   liked,
//   setMessages
// ) => {
//   try {
//     setMessages((prevMessages) =>
//       prevMessages.map((msg) =>
//         msg.messageId === messageId ? { ...msg, liked } : msg
//       )
//     );

//     await likeMessageAPI(matchId, createdAt, messageId, liked);
//   } catch (error) {
//     console.error('Failed to like message:', error);
//   }
// };
export const likeMessage = async (
  socket,
  matchId,
  createdAt,
  messageId,
  liked,
  setMessages
) => {
  if (!socket) {
    console.error("❌ Socket not available");
    return;
  }

  try {
    // Optimistically update UI before backend confirmation
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.messageId === messageId ? { ...msg, liked } : msg
      )
    );

    // Emit event to the server
    socket.emit("likeMessage", { matchId, createdAt, messageId, liked });

    console.log(`👍 Like event sent: Message ${messageId}, Liked: ${liked}`);
  } catch (error) {
    console.error("❌ Failed to like message:", error);

    // Rollback UI update if an error occurs
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.messageId === messageId ? { ...msg, liked: !liked } : msg
      )
    );
  }
};
