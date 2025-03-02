import {
  fetchGroupMessagesAPI,
  sendGroupMessageAPI,
  markGroupMessagesReadAPI,
  likeGroupMessageAPI,
} from '../../../api';

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

    // ✅ Ensure messageIds stays updated to prevent duplicates
    data.forEach((msg) => messageIds.current.add(msg.messageId));

    setMessages(data);
  } catch (error) {
    console.error('❌ Failed to fetch group messages:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

/** ✅ Send Group Message with Real-Time Sync */
export const sendGroupMessage = async (
  socket,
  groupId,
  senderId,
  content,
  imageUrl,
  members,
  setMessages
) => {
  if (!socket) {
    console.error('❌ Socket not available');
    return;
  }

  try {
    const newMessage = {
      groupId,
      senderId,
      content: imageUrl ? '' : content, // ✅ Ensure content is empty if image is present
      imageUrl,
      members,
      createdAt: new Date().toISOString(),
      messageId: `${groupId}-${Date.now()}-${Math.random()}`,
    };

    // ✅ Optimistically update UI
    setMessages((prevMessages) => [newMessage, ...prevMessages]);

    // ✅ Emit message via WebSocket
    socket.emit('sendGroupMessage', newMessage);
    console.log('📤 Sent Group Message via Socket:', newMessage);

    // ✅ Store message in backend
    await sendGroupMessageAPI(
      groupId,
      senderId,
      newMessage.content,
      newMessage.imageUrl,
      members
    );
    console.log('✅ Group message stored in backend');
  } catch (error) {
    console.error('❌ Failed to send group message:', error);

    // ❌ Rollback UI update if an error occurs
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.messageId !== newMessage.messageId)
    );
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
