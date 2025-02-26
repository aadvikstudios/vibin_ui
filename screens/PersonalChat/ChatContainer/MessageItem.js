import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageMessage from './ImageMessage';

const MessageItem = ({
  socket,
  item,
  profile,
  likeMessage,
  setMessages,
  fetchImageUrl,
  colors,
  setReplyMessage,
}) => {
  const isSentByCurrentUser = item.senderId === profile.emailId;

  return (
    <TouchableOpacity
      onLongPress={() => setReplyMessage(item)}
      style={[
        styles.messageWrapper,
        isSentByCurrentUser
          ? styles.sentMessageWrapper
          : styles.receivedMessageWrapper,
      ]}
    >
      <View
        style={[
          styles.messageContainer,
          isSentByCurrentUser
            ? { backgroundColor: colors.primaryContainer }
            : { backgroundColor: colors.surfaceVariant },
        ]}
      >
        {/* Reply Message Preview */}
        {item.replyTo && (
          <View
            style={[
              styles.replyContainer,
              { backgroundColor: colors.secondaryContainer },
            ]}
          >
            <Text
              style={[styles.replyText, { color: colors.onSecondaryContainer }]}
            >
              {item.replyTo.content}
            </Text>
          </View>
        )}

        {/* Image or Text Message */}
        {item.imageUrl ? (
          <ImageMessage
            imageKey={item.imageUrl}
            fetchImageUrl={fetchImageUrl}
          />
        ) : (
          <Text
            style={[
              styles.messageText,
              isSentByCurrentUser
                ? { color: colors.onPrimaryContainer }
                : { color: colors.onSurfaceVariant },
            ]}
          >
            {item.content}
          </Text>
        )}

        {/* Heart Button - Different Behavior for Sent & Received Messages */}
        {!isSentByCurrentUser ? (
          // ✅ Show outlined heart for received messages (can like or unlike)
          <TouchableOpacity
            onPress={() =>
              likeMessage(
                socket,
                item.matchId,
                item.createdAt, // ✅ Use createdAt instead of messageId
                !item.liked,
                setMessages
              )
            }
            style={styles.heartIconReceived}
          >
            <Ionicons
              name={item.liked ? 'heart' : 'heart-outline'}
              size={20}
              color={colors.liked}
            />
          </TouchableOpacity>
        ) : (
          // ✅ Show heart for sent messages only if liked
          item.liked && (
            <View style={styles.heartIconSent}>
              <Ionicons name="heart" size={20} color={colors.liked} />
            </View>
          )
        )}
      </View>

      {/* Message Timestamp */}
      <Text style={[styles.timestamp, { color: colors.secondaryText }]}>
        {new Date(item.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );
};

/** Styles */
const styles = StyleSheet.create({
  messageWrapper: {
    marginBottom: 15,
  },
  sentMessageWrapper: {
    alignItems: 'flex-end',
  },
  receivedMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
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
  heartIconReceived: {
    position: 'absolute',
    bottom: -10,
    left: -1,
  },
  heartIconSent: {
    position: 'absolute',
    bottom: -10,
    right: -1,
  },
  replyContainer: {
    padding: 6,
    borderRadius: 8,
    marginBottom: 5,
  },
  replyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default MessageItem;
