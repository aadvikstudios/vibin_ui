import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const API_BASE_URL = 'https://socket.vibinconnect.com';

export const useSocket = (matchId, messages, setMessages, messageIds) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    const newSocket = io(API_BASE_URL, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('join', { matchId });
    });

    // Handle incoming messages
    newSocket.on('newMessage', (message) => {
      if (!messageIds.current.has(message.createdAt)) {
        messageIds.current.add(message.createdAt);
        setMessages((prev) => [...prev, message]);
      }
    });

    setSocket(newSocket);

    return () => {
      console.log('❌ Disconnecting socket...');
      newSocket.disconnect();
    };
  }, [matchId]);

  const sendMessage = (message) => {
    if (socket) {
      console.log('📤 Sending message:', message);
      socket.emit('sendMessage', message);
    }
  };

  return { socket, sendMessage };
};
