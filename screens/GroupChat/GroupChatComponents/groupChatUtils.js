import {
  fetchGroupMessagesAPI,
  markGroupMessagesReadAPI,
  likeGroupMessageAPI,
  uploadImageToS3API,
  generatePresignedUrlAPI,
} from '../../../api';
import * as ImagePicker from 'expo-image-picker';

/** ✅ Fetch Group Messages */
export const fetchGroupMessages = async (
  groupId,
  setMessages,
  setLoading,
  setRefreshing,
  messageIds
) => {
  try {
    if (!setRefreshing) setLoading(true);
    const data = await fetchGroupMessagesAPI(groupId, 50);

    console.log('📩 Group Messages Fetched:', data);

    // ✅ Clear existing messages on refresh
    messageIds.current.clear();

    // ✅ Ensure only unique messages are stored
    const uniqueMessages = data.filter(
      (msg) => !messageIds.current.has(msg.messageId)
    );

    // ✅ Add fetched message IDs to prevent duplicates
    uniqueMessages.forEach((msg) => messageIds.current.add(msg.messageId));

    // ✅ Replace messages instead of appending
    setMessages(uniqueMessages);
  } catch (error) {
    console.error('❌ Failed to fetch group messages:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

/** ✅ Mark Group Messages as Read */
export const markGroupMessagesRead = async (socket, groupId, userHandle) => {
  try {
    if (socket) {
      socket.emit('markGroupMessagesAsRead', { groupId, userHandle });
      console.log(
        `👀 Marking messages as read for ${userHandle} in group ${groupId}`
      );
    }

    await markGroupMessagesReadAPI(groupId, userHandle);
  } catch (error) {
    console.error('❌ Failed to mark group messages as read:', error);
  }
};

/** ✅ Like a Group Message */
export const likeGroupMessage = async (
  socket,
  groupId,
  messageId,
  liked,
  setMessages
) => {
  if (!socket) {
    console.error('❌ Socket not available');
    return;
  }

  try {
    // ✅ Optimistically update UI
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.messageId === messageId ? { ...msg, liked } : msg
      )
    );

    // ✅ Emit like event via WebSocket
    socket.emit('likeGroupMessage', { groupId, messageId, liked });

    console.log(
      `👍 Group Like event sent: Message ${messageId}, Liked: ${liked}`
    );

    // ✅ Update like status in backend
    await likeGroupMessageAPI(groupId, messageId, liked);
    console.log(
      `✅ Group Like status updated in backend for message ${messageId}`
    );
  } catch (error) {
    console.error('❌ Failed to like group message:', error);

    // ❌ Rollback UI update if an error occurs
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.messageId === messageId ? { ...msg, liked: !liked } : msg
      )
    );
  }
};

export const pickImageAndUpload = async (
  groupId,
  sendMessage,
  userData,
  path = 'group-chat-images/'
) => {
  try {
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
        const fileName = `${groupId}-${Date.now()}.jpg`;
        const fileType = 'image/jpeg';

        console.log('📂 Upload path:', path);

        // ✅ 1️⃣ Generate Pre-Signed URL for S3 upload
        const { url: uploadUrl, fileName: s3Key } =
          await generatePresignedUrlAPI(fileName, fileType, path);

        if (!uploadUrl) {
          console.error('❌ Failed to get pre-signed URL');
          return;
        }

        // ✅ 2️⃣ Upload Image to S3
        await uploadImageToS3API(uploadUrl, imageUri, path);

        // ✅ 3️⃣ Store only the relative path in DB
        const storedFilePath = `${path}${fileName}`;
        console.log('✅ Stored file path:', storedFilePath);

        // ✅ 4️⃣ Send the image message immediately so UI updates instantly
        await sendMessage(null, storedFilePath);
        console.log('✅ Image message sent successfully!');

        return storedFilePath; // Return the image URL if needed
      } catch (error) {
        console.error('❌ Image upload failed from chat utils:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error picking/uploading image:', error);
  }
};
