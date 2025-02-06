import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const API_BASE_URL = `https://socket.vibinconnect.com`;

export const useSocket = (matchId, setMessages, messageIds) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    const newSocket = io(API_BASE_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('join', { matchId });
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket disconnected. Reason:', reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    newSocket.on('newMessage', (message) => {
      console.log('📩 New message received:', message);
      if (!messageIds.current.has(message.messageId)) {
        messageIds.current.add(message.messageId);
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        console.warn('⚠️ Duplicate message detected:', message.messageId);
      }
    });

    setSocket(newSocket);

    return () => {
      console.log('🛑 Cleaning up socket connection for matchId:', matchId);
      newSocket.disconnect();
    };
  }, [matchId, messageIds, setMessages]);

  const sendMessage = (message) => {
    if (socket && socket.connected) {
      console.log('📤 Sending message:', message);
      socket.emit('sendMessage', message, (ack) => {
        if (ack?.status) {
          console.log('✅ Message sent acknowledgment:', ack.status);
        } else {
          console.error('❌ Message failed:', ack?.error);
        }
      });
    } else {
      console.error('❌ Cannot send message. Socket not connected.');
    }
  };

  return { sendMessage };
};
