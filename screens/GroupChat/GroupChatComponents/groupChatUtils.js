import {
  fetchGroupMessagesAPI,
  markGroupMessagesReadAPI,
  likeGroupMessageAPI,
} from '../../../api';

/** Fetch Group Messages */
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
    console.log('Group Messages:', data);
    setMessages(data);
    data.forEach((msg) => messageIds.current.add(msg.messageId));
  } catch (error) {
    console.error('Failed to fetch group messages:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

/** Mark Group Messages as Read */
export const markGroupMessagesRead = async (groupId, userhandle) => {
  try {
    await markGroupMessagesReadAPI(groupId, userhandle);
  } catch (error) {
    console.error('Failed to mark group messages as read:', error);
  }
};

/** Like a Group Message */
export const likeGroupMessage = async (
  socket,
  groupId,
  createdAt,
  liked,
  setMessages
) => {
  if (!socket) {
    console.error('❌ Socket not available');
    return;
  }

  try {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.createdAt === createdAt ? { ...msg, liked } : msg
      )
    );

    socket.emit('likeGroupMessage', { groupId, createdAt, liked });

    console.log(
      `👍 Group Like event sent: Message at ${createdAt}, Liked: ${liked}`
    );

    await likeGroupMessageAPI(groupId, createdAt, liked);

    console.log(
      `✅ Group Like status updated in backend for message at ${createdAt}`
    );
  } catch (error) {
    console.error('❌ Failed to like group message:', error);

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.createdAt === createdAt ? { ...msg, liked: !liked } : msg
      )
    );
  }
};
