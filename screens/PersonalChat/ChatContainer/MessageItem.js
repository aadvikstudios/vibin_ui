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
  setReplyMessage, // ✅ New state for reply handling
}) => {
  return (
    <TouchableOpacity
      onLongPress={() => setReplyMessage(item)} // ✅ Set the reply message
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
        {/* Display Reply Message */}
        {item.replyTo && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>{item.replyTo.content}</Text>
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
              item.senderId === profile.emailId
                ? { color: colors.onPrimary }
                : { color: colors.primaryText },
            ]}
          >
            {item.content}
          </Text>
        )}

        {/* Like Button */}
        <TouchableOpacity
          onPress={() =>
            likeMessage(
              socket,
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
      </View>

      <Text style={[styles.timestamp, { color: colors.secondary }]}>
        {new Date(item.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  heartIconReceived: { left: -1 },
  replyContainer: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 8,
    marginBottom: 5,
  },
  replyText: { fontSize: 12, fontStyle: 'italic', color: 'gray' },
});

export default MessageItem;
