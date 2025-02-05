import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
      setMessages((prevMessages) => {
        const newMessageMap = new Map(data.map((msg) => [msg.messageId, msg]));
        const updatedMessages = prevMessages.map((msg) =>
          newMessageMap.has(msg.messageId)
            ? { ...msg, ...newMessageMap.get(msg.messageId) }
            : msg
        );
        const newMessages = data.filter(
          (msg) =>
            !prevMessages.some((prevMsg) => prevMsg.messageId === msg.messageId)
        );
        return [...updatedMessages, ...newMessages];
      });
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

    if (userData.userId !== senderId) {
      markAsRead();
    }
  }, [matchId, senderId, userData.userId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const message = {
      messageId: `${matchId}-${Date.now()}-${Math.random()}`,
      matchId: String(matchId),
      senderId: userData.userId,
      content: inputText.trim(),
      createdAt: new Date().toISOString(),
    };
    sendMessage(message);
    setInputText('');
    setMessages((prev) => [...prev, message]);
  };

  const likeMessage = async (matchId, createdAt, messageId, liked) => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, liked } : msg
        )
      );
      await likeMessageAPI(matchId, createdAt, messageId, liked);
    } catch (error) {
      console.error('Failed to like message:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  // Empty State
  if (messages.length === 1 && messages[0].senderId === '') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Avatar.Image source={{ uri: chatImage }} size={40} />
            <Text style={[styles.chatName, { color: colors.primaryText }]}>
              {chatName}
            </Text>
          </View>

          {/* Empty State View */}
          <EmptyStateView
            title="You have new connections!"
            subtitle={
              messages[0].content ||
              'Start connecting by sending a message to your new matches.'
            }
            //   primaryActionText="View new connections"
            //   onPrimaryAction={() => console.log('View new connections pressed')}
          />

          {/* Message Input */}
          <View
            style={[styles.inputContainer, { backgroundColor: colors.surface }]}
          >
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
            <TouchableOpacity onPress={handleSendMessage}>
              <Ionicons name="send" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Avatar.Image source={{ uri: chatImage }} size={40} />
          <Text style={[styles.chatName, { color: colors.primaryText }]}>
            {chatName}
          </Text>
        </View>

        {/* Chat Content */}
        {loading && !refreshing ? (
          <ActivityIndicator
            style={styles.center}
            size="large"
            color={colors.primary}
          />
        ) : (
          <ChatContainer
            messages={messages}
            profile={userData}
            likeMessage={likeMessage}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}

        {/* Message Input */}
        <View
          style={[styles.inputContainer, { backgroundColor: colors.surface }]}
        >
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
});

export default PersonalChatScreen;
