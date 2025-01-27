import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
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

  // Automatically scroll to the bottom of the chat when new messages arrive
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Call `markAsRead` when the component is mounted
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
            item.senderId === profile.userId
              ? styles.sentMessageWrapper
              : styles.receivedMessageWrapper,
          ]}
        >
          {/* Message Content */}
          <View
            style={[
              styles.messageContainer,
              item.senderId === profile.userId
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.senderId === profile.userId
                  ? { color: colors.onPrimary }
                  : { color: colors.primaryText },
              ]}
            >
              {item.content}
            </Text>

            {/* Heart Icon for Sent Messages */}
            {item.senderId === profile.userId && item.liked && (
              <View style={[styles.heartIcon, styles.heartIconSent]}>
                <Ionicons name="heart" size={20} color={colors.accent} />
              </View>
            )}

            {/* Heart Icon for Received Messages */}
            {item.senderId !== profile.userId && (
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
              item.senderId === profile.userId
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
});

export default ChatContainer;
