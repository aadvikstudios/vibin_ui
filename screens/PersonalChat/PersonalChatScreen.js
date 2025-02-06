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
import { useUser } from '../../context/UserContext';
import { useSocket } from './useSocket';
import { pickImageAndUpload } from './chatUtils';

/** External Utility Functions */
import {
  fetchMessages,
  markMessagesRead,
  handleSendMessage,
  pickImage,
  likeMessage,
} from './chatUtils';

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

  useEffect(() => {
    fetchMessages(matchId, setMessages, setLoading, setRefreshing, messageIds);
    if (userData.emailId !== senderId) {
      markMessagesRead(matchId);
    }
  }, [matchId, senderId, userData.emailId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages(matchId, setMessages, setLoading, setRefreshing, messageIds);
  };

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
            setMessages={setMessages}
            likeMessage={likeMessage}
            profile={userData}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}

        {/* Message Input */}
        <View
          style={[styles.inputContainer, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            onPress={() =>
              pickImageAndUpload(matchId, sendMessage, userData, 'chat-images/')
            }
          >
            <Ionicons name="attach" size={24} color={colors.primary} />
          </TouchableOpacity>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/** Styles */
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
  attachmentButton: { marginRight: 10 },
});

export default PersonalChatScreen;
