import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { sendGroupMessageAPI, fetchGroupMessagesAPI } from '../../api';

const SOCKET_URL = 'https://socket.vibinconnect.com';

export const useGroupChatSocket = (
  groupId,
  setMessages,
  messageIds,
  userData
) => {
  const [socket, setSocket] = useState(null);
  const pendingMessages = useRef(new Map()); // ✅ Track messages sent via WebSocket

  useEffect(() => {
    if (!groupId) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket Connected:', newSocket.id);
      newSocket.emit('joinGroup', { groupId });

      // ✅ Fetch last 10 messages when joining
      fetchGroupMessagesAPI(groupId).then((messages) => {
        console.log('📩 Last 10 messages fetched:', messages);
        setMessages(messages); // Display older messages first
      });

      setSocket(newSocket);
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('❌ WebSocket Disconnected:', reason);
    });

    // ✅ Handle New Messages from WebSocket
    newSocket.on('newGroupMessage', (message) => {
      console.log('📩 New group message received in real-time:', message);

      if (messageIds.current.has(message.messageId)) {
        console.warn(
          '⚠️ Duplicate group message detected, skipping:',
          message.messageId
        );
        return;
      }

      messageIds.current.add(message.messageId);

      setMessages((prevMessages) => {
        // ✅ Append new message and sort messages by `createdAt` (Oldest → Newest)
        const updatedMessages = [...prevMessages, message].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        return updatedMessages;
      });
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
    }

    const message = {
      groupId,
      senderId: userData.userhandle,
      content: content ? content.trim() : null,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
      messageId: `${groupId}-${Date.now()}-${Math.random()}`,
    };

    console.log('📤 Sending group message:', message);

    // ✅ Optimistic UI Update
    setMessages((prev) => [...prev, message]);

    // ✅ Prevent Duplicate Sending
    if (!pendingMessages.current.has(message.messageId)) {
      pendingMessages.current.set(message.messageId, message);
      socket.emit('sendGroupMessage', message);
    } else {
      console.warn(
        '⚠️ Duplicate message detected in send. Skipping WebSocket emit.'
      );
    }

    try {
      // ✅ Delay API Call to Avoid WebSocket Race Conditions
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!pendingMessages.current.has(message.messageId)) {
        console.log(
          '⚠️ Message already received via WebSocket. Skipping API call.'
        );
        return;
      }

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
