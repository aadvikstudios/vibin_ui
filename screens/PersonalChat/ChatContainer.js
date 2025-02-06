import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { getPresignedReadUrlAPI } from '../../api'; // Import your util function

const ChatContainer = ({
  messages = [],
  setMessages,
  profile,
  likeMessage,
  markAsRead,
  refreshing,
  onRefresh,
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef(null);
  const [imageUrls, setImageUrls] = useState({}); // Store pre-signed URLs

  useEffect(() => {
    if (markAsRead) markAsRead();
  }, [markAsRead]);

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
    if (!imageKey) return null; // No image key, return null
    if (imageUrls[imageKey]) return imageUrls[imageKey]; // Return if already fetched

    try {
      const url = await getPresignedReadUrlAPI(imageKey);
      setImageUrls((prevUrls) => ({ ...prevUrls, [imageKey]: url })); // Cache URL
      return url;
    } catch (error) {
      console.error('❌ Failed to fetch pre-signed URL:', error);
      return null;
    }
  };

  return (
    <FlatList
      data={uniqueMessages}
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageWrapper,
            item.senderId === profile.emailId
              ? styles.sentMessageWrapper
              : styles.receivedMessageWrapper,
          ]}
        >
          <View
            style={[
              styles.messageContainer,
              item.senderId === profile.emailId
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surface },
            ]}
          >
            {/* Display Image or Text Message */}
            {item.imageUrl ? (
              <ImageMessage
                imageKey={item.imageUrl}
                fetchImageUrl={fetchImageUrl}
              />
            ) : (
              <Text
                style={[
                  styles.messageText,
                  item.senderId === profile.emailId
                    ? { color: colors.onPrimary }
                    : { color: colors.primaryText },
                ]}
              >
                {item.content}
              </Text>
            )}

            {/* Heart Icon for Sent Messages */}
            {item.senderId === profile.emailId && item.liked && (
              <View style={[styles.heartIcon, styles.heartIconSent]}>
                <Ionicons name="heart" size={20} color={colors.accent} />
              </View>
            )}

            {/* Like Button for Received Messages */}
            {item.senderId !== profile.emailId && (
              <TouchableOpacity
                onPress={() =>
                  likeMessage(
                    item.matchId,
                    item.createdAt,
                    item.messageId,
                    !item.liked,
                    setMessages
                  )
                }
                style={[styles.heartIcon, styles.heartIconReceived]}
              >
                <Ionicons
                  name={item.liked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={colors.accent}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Timestamp */}
          <Text
            style={[
              styles.timestamp,
              item.senderId === profile.emailId
                ? { alignSelf: 'flex-end', color: colors.secondary }
                : { alignSelf: 'flex-start', color: colors.secondary },
            ]}
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}
      keyExtractor={(item, index) =>
        item.messageId ? item.messageId.toString() : `msg-${index}`
      }
      ref={flatListRef}
      contentContainerStyle={styles.chatContainer}
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

/**
 * Separate component to fetch and display the image with a pre-signed URL
 */
const ImageMessage = ({ imageKey, fetchImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const url = await fetchImageUrl(imageKey);
      if (url) setImageUrl(url);
    };
    loadImage();
  }, [imageKey]);

  return imageUrl ? (
    <Image source={{ uri: imageUrl }} style={styles.messageImage} />
  ) : (
    <Text style={{ color: 'gray' }}>Loading image...</Text>
  );
};

const styles = StyleSheet.create({
  chatContainer: { paddingHorizontal: 10, paddingVertical: 10, flexGrow: 1 },
  messageWrapper: { marginBottom: 20 },
  sentMessageWrapper: { alignItems: 'flex-end' },
  receivedMessageWrapper: { alignItems: 'flex-start' },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    position: 'relative',
  },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 12, marginTop: 5 },
  heartIcon: { position: 'absolute', bottom: -10 },
  heartIconSent: { right: -1 },
  heartIconReceived: { left: -1 },
  messageImage: { width: 200, height: 200, borderRadius: 10, marginTop: 5 },
});

export default ChatContainer;
