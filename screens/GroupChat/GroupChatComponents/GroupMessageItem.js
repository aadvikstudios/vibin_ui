import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageMessage from './GroupImageMessage';

const GroupMessageItem = ({
  socket,
  item,
  profile,
  likeMessage,
  setMessages,
  fetchImageUrl,
  colors,
  setReplyMessage,
}) => {
  const isSentByCurrentUser = item.senderId === profile.userhandle;

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
        {/* 🔹 Sender Name (Only for Received Messages) */}
        {!isSentByCurrentUser && (
          <Text style={[styles.senderName, { color: colors.primary }]}>
            {item.senderName}
          </Text>
        )}

        {/* 🔹 Reply Preview */}
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

        {/* 🔹 Image or Text Message */}
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

        {/* 🔹 Like (Heart) Button */}
        {!isSentByCurrentUser ? (
          // ✅ Heart Button for Received Messages (Can Like or Unlike)
          <TouchableOpacity
            onPress={() =>
              likeMessage(
                socket,
                item.groupId,
                item.messageId,
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
          // ✅ Show Heart Only if Sent Message is Liked
          item.liked && (
            <View style={styles.heartIconSent}>
              <Ionicons name="heart" size={20} color={colors.liked} />
            </View>
          )
        )}
      </View>

      {/* 🔹 Message Timestamp */}
      <Text style={[styles.timestamp, { color: colors.secondaryText }]}>
        {new Date(item.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );
};

/** 📌 Styles */
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
  senderName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
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

export default GroupMessageItem;
