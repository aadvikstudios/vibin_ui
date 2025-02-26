import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { sendMessageAPI, markMessagesReadAPI, likeMessageAPI } from '../../api'; // ✅ Ensure backend storage

const SOCKET_URL = 'https://socket.vibinconnect.com';

export const useSocket = (matchId, setMessages, messageIds) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    const newSocket = io(SOCKET_URL, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('join', { matchId });
      setSocket(newSocket);
    });

    // ✅ Handle incoming messages (Text & Image)
    newSocket.on('newMessage', (message) => {
      console.log('📩 New message received:', message);

      if (!messageIds.current.has(message.messageId)) {
        messageIds.current.add(message.messageId);
        setMessages((prev) => [...prev, message]); // ✅ Update UI instantly
      }
    });

    // ✅ Handle real-time message likes
    newSocket.on('messageLiked', ({ messageId, liked }) => {
      console.log(`💖 Message ${messageId} liked: ${liked}`);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId === messageId ? { ...msg, liked } : msg
        )
      );
    });

    // ✅ Handle read receipts (messages marked as read)
    newSocket.on('messagesRead', ({ matchId, readerId }) => {
      console.log(
        `👀 Messages marked as read by ${readerId} in match ${matchId}`
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.senderId !== readerId ? { ...msg, isUnread: 'false' } : msg
        )
      );
    });

    return () => {
      console.log('❌ Disconnecting socket...');
      newSocket.disconnect();
    };
  }, [matchId]);

  // ✅ Send message through socket and backend
  const sendMessage = async (message) => {
    if (socket) {
      console.log('📤 Sending message:', message);
      socket.emit('sendMessage', message);
      setMessages((prev) => [...prev, message]); // ✅ Update UI instantly

      try {
        await sendMessageAPI(message); // ✅ Store message in backend
      } catch (error) {
        console.error('❌ Backend message storage failed:', error);
      }
    } else {
      console.error('❌ Socket is not connected!');
    }
  };

  // ✅ Mark messages as read (both UI & Backend)
  const markMessagesAsRead = async (userHandle) => {
    if (socket) {
      console.log(`🔄 Marking messages as read for ${userHandle}`);
      socket.emit('markAsRead', { matchId, userHandle });

      try {
        await markMessagesReadAPI(matchId, userHandle);
      } catch (error) {
        console.error('❌ Failed to mark messages as read:', error);
      }
    }
  };

  const likeMessage = async (createdAt, liked) => {
    if (!socket) {
      console.error('❌ Socket not available');
      return;
    }

    try {
      // ✅ Optimistically update UI
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.createdAt === createdAt ? { ...msg, liked } : msg
        )
      );

      // ✅ Emit event to the WebSocket server (Real-time update)
      socket.emit('likeMessage', { matchId, createdAt, liked });

      console.log(
        `👍 Like event sent: Message at ${createdAt}, Liked: ${liked}`
      );

      // ✅ Update like status in backend
      await likeMessageAPI(matchId, createdAt, liked);

      console.log(
        `✅ Like status updated in backend for message at ${createdAt}`
      );
    } catch (error) {
      console.error('❌ Failed to like message:', error);

      // ❌ Rollback UI update if an error occurs
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.createdAt === createdAt ? { ...msg, liked: !liked } : msg
        )
      );
    }
  };

  return { socket, sendMessage, markMessagesAsRead, likeMessage };
};
