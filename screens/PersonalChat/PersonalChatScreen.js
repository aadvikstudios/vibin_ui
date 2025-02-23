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

// Import new components
import ChatHeader from './PersonalChatComponents/ChatHeader';
import MessageInput from './PersonalChatComponents/MessageInput';
import InviteUserModal from './PersonalChatComponents/InviteUserModal'; // ✅ New component
import ReferralModal from './PersonalChatComponents/ReferralModal'; // ✅ New component

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

  // Invite User State
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [pendingInvite, setPendingInvite] = useState(null);

  // Match Referral State
  const [referralModalVisible, setReferralModalVisible] = useState(false);

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

  /** Handle inviting a third person */
  const handleInviteUser = (userHandle) => {
    setPendingInvite(userHandle);
    Alert.alert(
      'Invite User',
      `Do you want to invite @${userHandle} to this chat?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Invite',
          onPress: () => {
            sendMessage({
              type: 'invite_request',
              matchId,
              from: userData.userHandle,
              invitedUser: userHandle,
            });
            setInviteModalVisible(false);
          },
        },
      ]
    );
  };

  /** Handle match referral */
  const handleReferUser = (userHandle) => {
    Alert.alert(
      'Refer a Match',
      `Do you want to introduce @${userHandle} to @${match.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Refer',
          onPress: () => {
            sendMessage({
              type: 'match_referral',
              matchId,
              from: userData.userHandle,
              referredUser: userHandle,
            });
            setReferralModalVisible(false);
          },
        },
      ]
    );
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
          onInvitePress={() => setInviteModalVisible(true)} // ✅ Open Invite Modal
          onReferPress={() => setReferralModalVisible(true)} // ✅ Open Referral Modal
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
          onInvite={handleInviteUser}
        />

        {/* Referral Modal */}
        <ReferralModal
          visible={referralModalVisible}
          onClose={() => setReferralModalVisible(false)}
          onRefer={handleReferUser}
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
