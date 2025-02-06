import React, { useRef, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getPresignedReadUrlAPI } from '../../../api';
import MessageItem from './MessageItem'; // Import the new MessageItem component
import CenteredMessage from './CenteredMessage'; // Import the new CenteredMessage component
import { useSocket } from '../useSocket';

const ChatContainer = ({
  messages = [],
  setMessages,
  profile,
  likeMessage,
  refreshing,
  onRefresh,
  matchId,
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef(null);
  const [imageUrls, setImageUrls] = useState({});
  const messageIds = useRef(new Set());
  const { socket } = useSocket(matchId, setMessages, messageIds);

  // Mark messages as DELIVERED when received
  useEffect(() => {
    if (!socket) return;

    messages.forEach((msg) => {
      if (msg.senderId !== profile.emailId && msg.status === 'sent') {
        console.log(
          '📤 Emitting messageDelivered:',
          msg.matchId,
          msg.messageId
        ); // Debugging log
        socket.emit('messageDelivered', {
          matchId: msg.matchId,
          messageId: msg.messageId,
        });
      }
    });
  }, [messages]);

  // Mark messages as READ when chat screen is opened
  useEffect(() => {
    if (socket) {
      console.log('📤 Emitting messageRead:', matchId); // Debugging log
      socket.emit('messageRead', { matchId, senderId: profile.emailId });
    }
  }, []);

  // Remove duplicate messages
  const seenMessageIds = new Set();
  const uniqueMessages = messages.filter((message) => {
    if (seenMessageIds.has(message.messageId)) {
      console.warn('⚠️ Duplicate messageId found:', message.messageId);
      return false;
    }
    seenMessageIds.add(message.messageId);
    return true;
  });

  // Function to fetch pre-signed URLs for images
  const fetchImageUrl = async (imageKey) => {
    if (!imageKey) return null;
    if (imageUrls[imageKey]) return imageUrls[imageKey];

    try {
      const url = await getPresignedReadUrlAPI(imageKey);
      setImageUrls((prevUrls) => ({ ...prevUrls, [imageKey]: url }));
      return url;
    } catch (error) {
      console.error('❌ Failed to fetch pre-signed URL:', error);
      return null;
    }
  };

  // Check if only one message exists and senderId is empty (special case)
  const shouldCenterMessage =
    uniqueMessages.length === 1 && uniqueMessages[0].senderId === '';

  if (shouldCenterMessage) {
    return <CenteredMessage message={uniqueMessages[0]} colors={colors} />;
  }

  // Filter out messages with an empty senderId (except the single-message case)
  const filteredMessages = uniqueMessages.filter((msg) => msg.senderId !== '');

  return (
    <FlatList
      data={filteredMessages}
      renderItem={({ item }) => (
        <MessageItem
          item={item}
          profile={profile}
          likeMessage={likeMessage}
          setMessages={setMessages}
          fetchImageUrl={fetchImageUrl}
          colors={colors}
        />
      )}
      keyExtractor={(item, index) =>
        item.messageId ? item.messageId.toString() : `msg-${index}`
      }
      ref={flatListRef}
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexGrow: 1,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    />
  );
};

export default ChatContainer;
