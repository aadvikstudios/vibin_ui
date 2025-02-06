import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pickImageAndUpload } from '../ChatContainer/chatUtils';

const MessageInput = ({
  matchId,
  sendMessage,
  userData,
  inputText,
  setInputText,
  handleSendMessage,
  colors,
}) => {
  return (
    <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
      {/* Attachment Button */}
      <TouchableOpacity
        onPress={() =>
          pickImageAndUpload(matchId, sendMessage, userData, 'chat-images/')
        }
      >
        <Ionicons name="attach" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Text Input */}
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.secondaryText },
        ]}
        placeholder="Type a message..."
        value={inputText}
        onChangeText={setInputText}
        placeholderTextColor={colors.secondary}
      />

      {/* Send Button */}
      <TouchableOpacity
        onPress={() =>
          handleSendMessage(
            inputText,
            matchId,
            userData,
            sendMessage,
            setInputText
          )
        }
      >
        <Ionicons name="send" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});

export default MessageInput;
