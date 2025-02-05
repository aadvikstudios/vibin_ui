import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ChatContainer from './ChatContainer';
import EmptyStateView from '../../components/EmptyStateView';
import {
  fetchMessagesAPI,
  markMessagesReadAPI,
  likeMessageAPI,
} from '../../api';
import { useUser } from '../../context/UserContext';
import { useSocket } from './useSocket';

const PersonalChatScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { userData } = useUser();
  const { match } = route.params;
  const chatName = match.name;
  const chatImage = match.photo;
  const matchId = match.matchId;
  const senderId = match.senderId;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const messageIds = useRef(new Set());
  const { sendMessage } = useSocket(matchId, setMessages, messageIds);

  const fetchMessages = async () => {
    try {
      if (!refreshing) setLoading(true);
      const data = await fetchMessagesAPI(matchId, 50);
      setMessages(data);
      data.forEach((msg) => messageIds.current.add(msg.messageId));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const markAsRead = async () => {
      try {
        await markMessagesReadAPI(matchId);
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    };
    if (userData.emailId !== senderId) {
      markAsRead();
    }
  }, [matchId, senderId, userData.emailId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const message = {
      messageId: `${matchId}-${Date.now()}-${Math.random()}`,
      matchId: String(matchId),
      senderId: userData.emailId,
      content: inputText.trim(),
      imageUrl: null, // No image
      createdAt: new Date().toISOString(),
    };

    sendMessage(message);
    setInputText('');
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('You need to allow permission to access the gallery.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const message = {
        messageId: `${matchId}-${Date.now()}-${Math.random()}`,
        matchId: String(matchId),
        senderId: userData.emailId,
        content: '',
        imageUrl: imageUri, // Attach image
        createdAt: new Date().toISOString(),
      };

      sendMessage(message);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Avatar.Image source={{ uri: chatImage }} size={40} />
          <Text style={[styles.chatName, { color: colors.primaryText }]}>{chatName}</Text>
        </View>

        {/* Chat Content */}
        {loading && !refreshing ? (
          <ActivityIndicator style={styles.center} size="large" color={colors.primary} />
        ) : (
          <ChatContainer messages={messages} profile={userData} refreshing={refreshing} onRefresh={onRefresh} />
        )}

        {/* Message Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          {/* Attachment Button */}
          <TouchableOpacity onPress={pickImage} style={styles.attachmentButton}>
            <Ionicons name="attach" size={24} color={colors.primary} />
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.secondaryText }]}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={colors.secondary}
          />

          {/* Send Button */}
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  backButton: { marginRight: 10 },
  chatName: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  attachmentButton: {
    marginRight: 10,
  },
});

export default PersonalChatScreen;