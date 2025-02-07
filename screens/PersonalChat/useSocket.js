import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const API_BASE_URL = 'https://socket.vibinconnect.com';

export const useSocket = (matchId, setMessages, messageIds, userData) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    const newSocket = io(API_BASE_URL, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('join', { matchId, userId: userData.emailId });
    });

    newSocket.on('newMessage', (message) => {
      if (!messageIds.current.has(message.messageId)) {
        messageIds.current.add(message.messageId);
        setMessages((prev) => [...prev, message]);

        if (message.senderId !== userData.emailId && message.messageId) {
          newSocket.emit('messageDelivered', {
            matchId,
            messageId: message.messageId,
          });
        }
      }
    });

    newSocket.on('messageStatusUpdate', (update) => {
      console.log('📩 Status update received:', update);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.matchId === matchId ? { ...msg, status: update.status } : msg
        )
      );
    });

    setSocket(newSocket);
    return () => {
      if (newSocket) {
        console.log('🛑 Disconnecting socket:', newSocket.id);
        newSocket.disconnect();
      }
    };
  }, [matchId, userData.emailId]);

  const sendMessage = (message) => {
    if (socket) {
      console.log('📤 Sending message:', message);
      socket.emit('sendMessage', message);
    }
  };

  return { sendMessage };
};