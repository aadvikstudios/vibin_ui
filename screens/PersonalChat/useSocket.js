import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const API_BASE_URL = 'https://socket.vibinconnect.com';

export const useSocket = (matchId, setMessages, messageIds) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    const newSocket = io(API_BASE_URL, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('join', { matchId });
      setSocket(newSocket); // ✅ Ensure socket is set after connecting
    });

    // Handle incoming messages
    newSocket.on('newMessage', (message) => {
      if (!messageIds.current.has(message.createdAt)) {
        messageIds.current.add(message.createdAt);
        setMessages((prev) => [...prev, message]);
      }
    });

    // Listen for real-time like updates
    newSocket.on('messageLiked', ({ messageId, liked }) => {
      console.log(`💖 Message ${messageId} liked: ${liked}`);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId === messageId ? { ...msg, liked } : msg
        )
      );
    });

    return () => {
      console.log('❌ Disconnecting socket...');
      newSocket.disconnect();
    };
  }, [matchId]);

  const sendMessage = (message) => {
    if (socket) {
      console.log('📤 Sending message:', message);
      socket.emit('sendMessage', message);
    } else {
      console.error('❌ Socket is not connected!');
    }
  };

  return { socket, sendMessage };
};
