import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  sendGroupMessageAPI,
  markGroupMessagesReadAPI,
  likeGroupMessageAPI,
} from '../../api'; // ✅ Ensure backend storage

const SOCKET_URL = 'https://socket.vibinconnect.com';

export const useGroupChatSocket = (groupId, setMessages, messageIds) => {
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

      // ✅ Ignore self-sent messages already added
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

    // ✅ Handle read receipts (group messages marked as read)
    newSocket.on('groupMessagesRead', ({ groupId, readerId }) => {
      console.log(
        `👀 Group Messages marked as read by ${readerId} in group ${groupId}`
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.senderId !== readerId ? { ...msg, isUnread: false } : msg
        )
      );
    });

    return () => {
      console.log('❌ Disconnecting group socket...');
      newSocket.disconnect();
    };
  }, [groupId]);

  /** ✅ Send Group Message */
  const sendGroupMessage = async (content, imageUrl = null, senderId) => {
    if (!socket) {
      console.error('❌ Group Socket is not connected!');
      return;
    }

    const message = {
      groupId,
      senderId,
      content: imageUrl ? '' : content, // ✅ Ensure text is empty if image is present
      imageUrl,
      createdAt: new Date().toISOString(),
      messageId: `${groupId}-${Date.now()}-${Math.random()}`,
    };

    // ✅ Emit message to the WebSocket server
    socket.emit('sendGroupMessage', message);

    // ✅ Optimistically update UI
    if (!messageIds.current.has(message.messageId)) {
      messageIds.current.add(message.messageId);
      setMessages((prev) => [message, ...prev]);
    }

    try {
      await sendGroupMessageAPI(groupId, senderId, content, imageUrl, []);
      console.log('✅ Group message successfully stored in backend');
    } catch (error) {
      console.error('❌ Failed to send group message:', error);
    }
  };

  /** ✅ Mark Group Messages as Read */
  const markGroupMessagesAsRead = async (userHandle) => {
    if (!socket) return;

    console.log(`🔄 Marking group messages as read for ${userHandle}`);
    socket.emit('markGroupMessagesAsRead', { groupId, userHandle });

    try {
      await markGroupMessagesReadAPI(groupId, userHandle);
    } catch (error) {
      console.error('❌ Failed to mark group messages as read:', error);
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

      // ✅ Emit event to the WebSocket server
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

  return {
    socket,
    sendGroupMessage,
    markGroupMessagesAsRead,
    likeGroupMessage,
  };
};
