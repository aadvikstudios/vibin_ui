import React, { useRef, useEffect } from 'react';
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

const ChatContainer = ({
  messages = [],
  profile,
  likeMessage,
  markAsRead,
  refreshing,
  onRefresh,
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef(null);

  // Scroll to the bottom of the chat when new messages arrive
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Mark messages as read when component mounts
  useEffect(() => {
    if (markAsRead) markAsRead();
  }, [markAsRead]);

  return (
    <FlatList
      data={messages.filter((message) => message.senderId !== null)}
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageWrapper,
            item.senderId === profile.emailId
              ? styles.sentMessageWrapper
              : styles.receivedMessageWrapper,
          ]}
        >
          {/* Message Container */}
          <View
            style={[
              styles.messageContainer,
              item.senderId === profile.emailId
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surface },
            ]}
          >
            {/* Display Image Message */}
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
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

            {/* Heart Icon for Received Messages */}
            {item.senderId !== profile.emailId && (
              <TouchableOpacity
                onPress={() =>
                  likeMessage(
                    item.matchId,
                    item.createdAt,
                    item.messageId,
                    !item.liked
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
      keyExtractor={(item) => item.messageId}
      ref={flatListRef}
      contentContainerStyle={styles.chatContainer}
      onContentSizeChange={scrollToBottom}
      onLayout={scrollToBottom}
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

const styles = StyleSheet.create({
  chatContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1,
  },
  messageWrapper: {
    marginBottom: 20,
  },
  sentMessageWrapper: {
    alignItems: 'flex-end',
  },
  receivedMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    position: 'relative',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
  },
  heartIcon: {
    position: 'absolute',
    bottom: -10,
  },
  heartIconSent: {
    right: -1,
  },
  heartIconReceived: {
    left: -1,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
});

export default ChatContainer;