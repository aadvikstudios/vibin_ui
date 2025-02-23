import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { pickImageAndUpload } from '../ChatContainer/chatUtils';

const MessageInput = ({
  matchId,
  sendMessage,
  userData,
  inputText,
  setInputText,
  handleSendMessage,
  replyMessage, // ✅ Reply state tracking
  setReplyMessage, // ✅ Clear reply after sending
}) => {
  const { colors } = useTheme(); // ✅ Use latest theme colors

  const onSend = () => {
    if (!inputText.trim()) return;

    const message = {
      matchId,
      senderId: userData.emailId,
      content: inputText,
      createdAt: new Date().toISOString(),
      isUnRead: true,
      messageId: `${matchId}-${Date.now()}-${Math.random()}`,
      replyTo: replyMessage
        ? { messageId: replyMessage.messageId, content: replyMessage.content }
        : null, // ✅ Include reply metadata
    };

    sendMessage(message);
    setInputText('');
    setReplyMessage(null); // ✅ Clear reply after sending
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
      {/* Reply Preview */}
      {replyMessage && (
        <View
          style={[
            styles.replyContainer,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          <Text style={[styles.replyText, { color: colors.primaryText }]}>
            Replying to: {replyMessage.content}
          </Text>
          <TouchableOpacity onPress={() => setReplyMessage(null)}>
            <Ionicons name="close" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Attachment Button */}
      <TouchableOpacity
        onPress={() =>
          pickImageAndUpload(matchId, sendMessage, userData, 'chat-images/')
        }
        style={styles.iconButton}
      >
        <Ionicons name="attach" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Text Input */}
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.primaryText },
        ]}
        placeholder="Type a message..."
        value={inputText}
        onChangeText={setInputText}
        placeholderTextColor={colors.secondaryText}
      />

      {/* Send Button */}
      <TouchableOpacity onPress={onSend} style={styles.iconButton}>
        <Ionicons name="send" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  replyContainer: {
    position: 'absolute',
    top: -30,
    left: 10,
    right: 10,
    padding: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  replyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  iconButton: {
    padding: 5,
  },
});

export default MessageInput;
