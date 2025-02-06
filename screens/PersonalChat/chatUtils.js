import {
  fetchMessagesAPI,
  markMessagesReadAPI,
  likeMessageAPI,
  generatePresignedUrlAPI,
  uploadImageToS3API,
  sendMessageAPI,
} from '../../api';
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

/** Handle Sending Message */
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
    matchId: String(matchId),
    senderId: userData.emailId,
    content: inputText.trim(),
    imageUrl: null,
    createdAt: new Date().toISOString(),
  };

  sendMessage(message);
  sendMessageAPI(message); // Send to backend
  setInputText('');
};

/** Pick Image & Upload to S3 */
export const pickImageAndUpload = async (
  matchId,
  sendMessage,
  userData,
  path
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

      // 1️⃣ Get Pre-signed URL from Backend with Correct Path
      const { url: uploadUrl, fileName: s3Key } = await generatePresignedUrlAPI(
        `${fileName}`,
        fileType,
        path
      );

      // 2️⃣ Upload Image to S3
      await uploadImageToS3API(uploadUrl, imageUri, path);

      // 3️⃣ Store Only Relative Path (No Full S3 URL)
      const storedFilePath = `${path}${fileName}`;

      // 4️⃣ If it's a chat message, send it as a message
      if (path === 'chat-images/') {
        const message = {
          messageId: `${matchId}-${Date.now()}-${Math.random()}`,
          matchId: String(matchId),
          senderId: userData.emailId,
          content: '',
          imageUrl: storedFilePath, // Store relative path
          createdAt: new Date().toISOString(),
        };

        sendMessage(message);
        sendMessageAPI(message); // Send message to backend
      }

      return storedFilePath; // Return stored path for profile pictures
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }
};

/** Like Message */
export const likeMessage = async (
  matchId,
  createdAt,
  messageId,
  liked,
  setMessages
) => {
  try {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.messageId === messageId ? { ...msg, liked } : msg
      )
    );

    await likeMessageAPI(matchId, createdAt, messageId, liked);
  } catch (error) {
    console.error('Failed to like message:', error);
  }
};
