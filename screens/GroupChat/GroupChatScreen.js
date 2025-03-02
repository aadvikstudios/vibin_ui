import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatContainer from '../PersonalChat/ChatContainer/ChatContainer';
import { useUser } from '../../context/UserContext';
import {
  fetchGroupMessages,
  markGroupMessagesRead,
} from './GroupChatComponents/groupChatUtils';
import { useGroupChatSocket } from './useGroupChatSocket';

// Import Components
import GroupChatHeader from './GroupChatComponents/GroupChatHeader';
import GroupMessageInput from './GroupChatComponents/GroupMessageInput';

const GroupChatScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { userData } = useUser();
  const { group } = route.params;

  const groupName = group.name;
  const groupImage = group.photo;
  const groupId = group.groupId;
  const members = group.members;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const messageIds = useRef(new Set());

  // ✅ Use Group Chat Socket for real-time messaging
  const { socket, sendGroupMessage, likeGroupMessage } = useGroupChatSocket(
    groupId,
    setMessages,
    messageIds
  );

  useEffect(() => {
    fetchGroupMessages(
      groupId,
      setMessages,
      setLoading,
      setRefreshing,
      messageIds
    );

    // ✅ Mark messages as read when user joins
    if (userData.userhandle) {
      markGroupMessagesRead(socket, groupId, userData.userhandle);
    }
  }, [groupId, userData.userhandle]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroupMessages(
      groupId,
      setMessages,
      setLoading,
      setRefreshing,
      messageIds
    );
  };

  /** ✅ Send Group Message */
  const handleSendMessage = async (imageUrl = null) => {
    if (!inputText.trim() && !imageUrl) return;

    try {
      await sendGroupMessage(
        imageUrl ? '' : inputText, // ✅ If image is present, send an empty text
        imageUrl,
        userData.userId // ✅ Send userId from context
      );

      setInputText('');
      setReplyMessage(null);
    } catch (error) {
      console.error('❌ Failed to send group message:', error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 🔹 Updated Group Chat Header */}
        <GroupChatHeader
          groupImage={groupImage}
          groupName={groupName}
          members={members}
          navigation={navigation}
        />

        {/* 🔹 Chat Content */}
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
            likeMessage={likeGroupMessage} // ✅ Handle real-time likes
            profile={userData}
            refreshing={refreshing}
            onRefresh={onRefresh}
            setReplyMessage={setReplyMessage}
          />
        )}

        {/* 🔹 Group Message Input */}
        <GroupMessageInput
          groupId={groupId}
          sendMessage={handleSendMessage} // ✅ Uses socket-integrated sendMessage function
          userData={userData}
          inputText={inputText}
          setInputText={setInputText}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
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

export default GroupChatScreen;
