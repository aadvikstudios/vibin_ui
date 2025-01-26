import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const API_BASE_URL = `http://vibin-env.eba-cqjrsm82.ap-south-1.elasticbeanstalk.com`;

export const useSocket = (matchId, setMessages, messageIds) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('join', { matchId });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('newMessage', (message) => {
      console.log('New message received:', message);
      if (!messageIds.current.has(message.messageId)) {
        messageIds.current.add(message.messageId);
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up socket connection for matchId:', matchId);
      newSocket.disconnect();
    };
  }, [matchId, setMessages, messageIds]);

  const sendMessage = (message) => {
    if (socket && socket.connected) {
      console.log('Sending message:', message);
      socket.emit('sendMessage', message, (ack) => {
        console.log('Message sent acknowledgment:', ack);
      });
    } else {
      console.error('Cannot send message. Socket not connected.');
    }
  };

  return { sendMessage };
};
