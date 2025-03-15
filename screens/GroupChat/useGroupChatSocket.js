import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { sendGroupMessageAPI } from '../../api';

const SOCKET_URL = 'https://socket.vibinconnect.com';

export const useGroupChatSocket = (
  groupId,
  setMessages,
  messageIds,
  userData
) => {
  const [socket, setSocket] = useState(null);
  const pendingMessages = useRef(new Set()); // ✅ Track messages sent via WebSocket

  useEffect(() => {
    if (!groupId) return;

    const newSocket = io(SOCKET_URL, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket Connected:', newSocket.id);
      newSocket.emit('joinGroup', { groupId });
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.warn('❌ WebSocket Disconnected');
    });

    // ✅ Listen for real-time group messages (Avoid duplicates)
    newSocket.on('newGroupMessage', (message) => {
      console.log('📩 New group message received:', message);

      if (messageIds.current.has(message.messageId)) {
        console.warn('⚠️ Duplicate group message detected:', message.messageId);
        return;
      }

      messageIds.current.add(message.messageId);
      pendingMessages.current.delete(message.messageId); // ✅ Remove from pending if received via WebSocket

      setMessages((prev) => [...prev, message]); // ✅ Append at the bottom
    });

    return () => {
      console.log('❌ Disconnecting WebSocket...');
      newSocket.disconnect();
    };
  }, [groupId]);

  const sendGroupMessage = async (content, imageUrl = null) => {
    if (!socket || !socket.connected) {
      console.error('❌ WebSocket is NOT connected. Falling back to API.');
      await sendGroupMessageAPI(
        groupId,
        userData.userhandle,
        content,
        imageUrl
      );
      return;
    } else {
      console.log('✅ WebSocket is connected. Sending message via WebSocket.');
    }

    if (!userData?.userhandle) {
      console.error('❌ Missing senderId! userData:', userData);
      return;
    }

    const message = {
      groupId,
      senderId: userData.userhandle,
      content: content ? content.trim() : null,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
      messageId: `${groupId}-${Date.now()}-${Math.random()}`, // Ensure uniqueness
    };

    console.log('📤 Sending group message:', message);

    // ✅ Emit message to WebSocket first
    socket.emit('sendGroupMessage', message);
    pendingMessages.current.add(message.messageId);

    if (!messageIds.current.has(message.messageId)) {
      messageIds.current.add(message.messageId);
      setMessages((prev) => [...prev, message]); // ✅ Append at the bottom
    }

    try {
      // ✅ Wait before calling API (to prevent double insertion)
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!pendingMessages.current.has(message.messageId)) {
        console.log(
          '⚠️ Message already received via WebSocket. Skipping API call.'
        );
        return;
      }

      // ✅ Store message in backend only if WebSocket didn't handle it
      await sendGroupMessageAPI(
        groupId,
        userData.userhandle,
        message.content,
        message.imageUrl
      );
      console.log('✅ Group message successfully stored in backend');
    } catch (error) {
      console.error('❌ Failed to send group message:', error);
    } finally {
      pendingMessages.current.delete(message.messageId);
    }
  };

  return { socket, sendGroupMessage };
};
