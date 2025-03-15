import React, { useRef, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getPresignedReadUrlAPI } from '../../../api';
import GroupMessageItem from './GroupMessageItem'; // ✅ Updated MessageItem for Group Chat
import CenteredMessage from './CenteredGroupMessage'; // ✅ Handles system messages
import { MESSAGE_TYPES } from '../../../constants/messageConstants'; // ✅ Import message constants

const GroupChatContainer = ({
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
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // ✅ Fetch pre-signed URLs for image messages
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
  console.log('uniqueMessages', uniqueMessages);
  // ✅ Check if only one message exists and it's a system message
  const shouldCenterMessage =
    uniqueMessages.length === 1 &&
    uniqueMessages[0].senderId === MESSAGE_TYPES.SYSTEM_MESSAGE;

  if (shouldCenterMessage) {
    return <CenteredMessage message={uniqueMessages[0]} colors={colors} />;
  }

  // ✅ Filter out system messages from the display
  const filteredMessages = uniqueMessages.filter(
    (msg) => msg.senderId !== MESSAGE_TYPES.SYSTEM_MESSAGE
  );

  return (
    <FlatList
      data={filteredMessages}
      renderItem={({ item }) => (
        <GroupMessageItem
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

export default GroupChatContainer;
