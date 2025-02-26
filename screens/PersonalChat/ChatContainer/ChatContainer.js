import React, { useRef, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getPresignedReadUrlAPI } from '../../../api';
import MessageItem from './MessageItem'; // ✅ Updated MessageItem
import CenteredMessage from './CenteredMessage'; // ✅ Handles system messages
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

  // ✅ Remove duplicate messages efficiently
  const seenMessageIds = new Set();
  const uniqueMessages = messages.filter((message) => {
    if (seenMessageIds.has(message.messageId)) {
      console.warn('⚠️ Duplicate messageId found:', message.messageId);
      return false;
    }
    seenMessageIds.add(message.messageId);
    return true;
  });

  // ✅ Fetch pre-signed URLs for images
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

  // ✅ Check if only one message exists and senderId is empty (system message)
  const shouldCenterMessage =
    uniqueMessages.length === 1 && uniqueMessages[0].content === '';

  if (shouldCenterMessage) {
    return <CenteredMessage message={uniqueMessages[0]} colors={colors} />;
  }

  // ✅ Filter out messages with an empty senderId (except system messages)
  const filteredMessages = uniqueMessages.filter((msg) => msg.content !== '');

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
          setReplyMessage={setReplyMessage}
          fetchImageUrl={fetchImageUrl}
          colors={colors}
        />
      )}
      keyExtractor={(item, index) =>
        item.messageId ? item.messageId.toString() : `msg-${index}`
      }
      ref={flatListRef}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 12,
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
