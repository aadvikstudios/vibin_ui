import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  sendGroupMessageAPI,
  markGroupMessagesReadAPI,
  likeGroupMessageAPI,
} from '../../api';

const SOCKET_URL = 'https://socket.vibinconnect.com';

export const useGroupChatSocket = (
  groupId,
  setMessages,
  messageIds,
  userData
) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!groupId) return;

    const newSocket = io(SOCKET_URL, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log('✅ Group Socket connected:', newSocket.id);
      newSocket.emit('joinGroup', { groupId });
      setSocket(newSocket);
    });

    // ✅ Listen for real-time group messages
    newSocket.on('newGroupMessage', (message) => {
      console.log('📩 New group message received:', message);

      if (messageIds.current.has(message.messageId)) {
        console.warn('⚠️ Duplicate group message received:', message.messageId);
        return;
      }

      messageIds.current.add(message.messageId);
      setMessages((prev) => [message, ...prev]);
    });

    // ✅ Handle real-time message likes
    newSocket.on('groupMessageLiked', ({ messageId, liked }) => {
      console.log(`💖 Group Message ${messageId} liked: ${liked}`);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId === messageId ? { ...msg, liked } : msg
        )
      );
    });

    return () => {
      console.log('❌ Disconnecting group socket...');
      newSocket.disconnect();
    };
  }, [groupId]);

  const sendGroupMessage = async (content, imageUrl = null) => {
    if (!socket) {
      console.error('❌ Group Socket is not connected!');
      return;
    }

    if (!userData?.userhandle) {
      console.error('❌ Missing senderId! userData:', userData);
      return;
    }

    const message = {
      groupId,
      senderId: userData.userhandle, // ✅ Ensure senderId is assigned
      content: content ? content.trim() : null, // ✅ Avoid empty strings
      imageUrl: imageUrl ? imageUrl : null,
      createdAt: new Date().toISOString(),
      messageId: `${groupId}-${Date.now()}-${Math.random()}`,
    };

    console.log('📤 Sending group message:', message);

    // ✅ Emit message to WebSocket server
    socket.emit('sendGroupMessage', message);

    // ✅ Optimistically update UI
    if (!messageIds.current.has(message.messageId)) {
      messageIds.current.add(message.messageId);
      setMessages((prev) => [message, ...prev]);
    }

    try {
      await sendGroupMessageAPI(
        groupId,
        userData.userhandle, // ✅ Ensure correct senderId is passed to the API
        message.content,
        message.imageUrl
      );
      console.log('✅ Group message successfully stored in backend');
    } catch (error) {
      console.error('❌ Failed to send group message:', error);
    }
  };

  /** ✅ Like a Group Message */
  const likeGroupMessage = async (messageId, liked) => {
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

      socket.emit('likeGroupMessage', { groupId, messageId, liked });

      console.log(
        `👍 Group Like event sent: Message ${messageId}, Liked: ${liked}`
      );

      await likeGroupMessageAPI(groupId, messageId, liked);
      console.log(
        `✅ Group Like status updated in backend for message ${messageId}`
      );
    } catch (error) {
      console.error('❌ Failed to like group message:', error);
    }
  };

  return {
    socket,
    sendGroupMessage,
    likeGroupMessage,
  };
};
