import {
  fetchGroupMessagesAPI,
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
