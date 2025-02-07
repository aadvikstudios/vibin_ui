import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageMessage from './ImageMessage'; // Image component

const MessageItem = ({
  socket, // Pass socket down
  item,
  profile,
  likeMessage,
  setMessages,
  fetchImageUrl,
  colors,
}) => {
  return (
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
        )}
      </View>

      {/* Timestamp */}
      <Text style={[styles.timestamp, { color: colors.secondary }]}>
        {new Date(item.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
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
  heartIconSent: { right: -1 },
  heartIconReceived: { left: -1 },
});

export default MessageItem;
