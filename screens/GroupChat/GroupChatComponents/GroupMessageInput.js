import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { pickImageAndUpload } from '../GroupChatComponents/groupChatUtils';

const GroupMessageInput = ({
  groupId,
  sendMessage,
  userData,
  inputText,
  setInputText,
  replyMessage,
  setReplyMessage,
}) => {
  const { colors } = useTheme();
  const [attachedImage, setAttachedImage] = useState(null);

  /** ✅ Handle Sending Message */
  const onSend = async () => {
    if (!inputText.trim() && !attachedImage) return; // Prevent sending empty messages

    try {
      // ✅ Send text and/or image message
      await sendMessage(
        inputText.trim() || null, // Send text if available
        attachedImage || null // Send image if available
      );

      setInputText(''); // Clear text input
      setReplyMessage(null);
      setAttachedImage(null); // ✅ Clear image after sending
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  /** ✅ Handle Image Selection & Upload */
  const onAttachImage = async () => {
    try {
      const imageUrl = await pickImageAndUpload(
        groupId,
        sendMessage,
        userData,
        'group-chat-images/'
      );

      if (imageUrl) {
        console.log('✅ Image uploaded and sent:', imageUrl);
      }
    } catch (error) {
      console.error('❌ Image upload failed from input js:', error);
    }
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
      {/* 🔹 Reply Preview */}
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

      {/* 🔹 Image Preview */}
      {attachedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: attachedImage }} style={styles.imagePreview} />
          <TouchableOpacity
            onPress={() => setAttachedImage(null)}
            style={styles.removeImageButton}
          >
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}

      {/* 🔹 Attachment Button */}
      <TouchableOpacity onPress={onAttachImage} style={styles.iconButton}>
        <Ionicons name="image-outline" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* 🔹 Text Input */}
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

      {/* 🔹 Send Button */}
      <TouchableOpacity onPress={onSend} style={styles.iconButton}>
        <Ionicons name="send" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

/** Styles */
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
  imagePreviewContainer: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    borderRadius: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default GroupMessageInput;
