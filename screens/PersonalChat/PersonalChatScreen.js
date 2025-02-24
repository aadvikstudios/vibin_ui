import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatContainer from './ChatContainer/ChatContainer';
import { useUser } from '../../context/UserContext';
import { useSocket } from './useSocket';
import {
  fetchMessages,
  markMessagesRead,
  handleSendMessage,
  likeMessage,
} from './ChatContainer/chatUtils';

// Import Components
import ChatHeader from './PersonalChatComponents/ChatHeader';
import MessageInput from './PersonalChatComponents/MessageInput';
import InviteUserModal from './PersonalChatComponents/InviteUserModal';

// Import Invite Utility
import { handleUserInvite } from '../../utils/chatUtils';

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
  const [replyMessage, setReplyMessage] = useState(null);
  const messageIds = useRef(new Set());
  const { socket, sendMessage } = useSocket(matchId, setMessages, messageIds);

  // Invite State
  const [inviteModalVisible, setInviteModalVisible] = useState(false);

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
        <ChatHeader
          chatImage={chatImage}
          chatName={chatName}
          navigation={navigation}
          colors={colors}
          onInvitePress={() => setInviteModalVisible(true)}
          onReferPress={() =>
            Alert.alert('Coming Soon', 'This feature is not available yet!')
          }
        />

        {/* Chat Content */}
        {loading && !refreshing ? (
          <ActivityIndicator
            style={styles.center}
            size="large"
            color={colors.primary}
          />
        ) : (
          <ChatContainer
            socket={socket}
            messages={messages}
            setMessages={setMessages}
            likeMessage={likeMessage}
            profile={userData}
            refreshing={refreshing}
            onRefresh={onRefresh}
            setReplyMessage={setReplyMessage}
          />
        )}

        {/* Message Input */}
        <MessageInput
          matchId={matchId}
          sendMessage={sendMessage}
          userData={userData}
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
          colors={colors}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
        />

        {/* Invite User Modal */}
        <InviteUserModal
          visible={inviteModalVisible}
          onClose={() => setInviteModalVisible(false)}
          onInvite={(userHandle) =>
            handleUserInvite({
              userHandle,
              userData,
              setModalVisible: setInviteModalVisible,
              sendMessage,
              secondUserEmail: senderId, // The second user who needs to approve
            })
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/** Styles */
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default PersonalChatScreen;
