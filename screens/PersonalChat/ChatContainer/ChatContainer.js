import React, { useRef, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getPresignedReadUrlAPI } from '../../../api';
import MessageItem from './MessageItem'; // Import the new MessageItem component
import CenteredMessage from './CenteredMessage'; // Import the new CenteredMessage component
import { useSocket } from '../useSocket';

const ChatContainer = ({
  socket,
  messages = [],
  setMessages,
  profile,
  likeMessage,
  refreshing,
  onRefresh,
  setReplyMessage,
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef(null);
  const [imageUrls, setImageUrls] = useState({});

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
          socket={socket}
          item={item}
          profile={profile}
          likeMessage={likeMessage}
          setMessages={setMessages}
          setReplyMessage={setReplyMessage} // ✅ Pass replyMessage setter
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
