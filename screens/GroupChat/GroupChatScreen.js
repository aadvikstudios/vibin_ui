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
import {
  fetchGroupMessages,
  markGroupMessagesRead,
} from './GroupChatComponents/groupChatUtils';
import { useGroupChatSocket } from './useGroupChatSocket';
import { useUser } from '../../context/UserContext';

// Import Components
import GroupChatHeader from './GroupChatComponents/GroupChatHeader';
import GroupMessageInput from './GroupChatComponents/GroupMessageInput';
import GroupChatContainer from './GroupChatComponents/GroupChatContainer';

const GroupChatScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { userData } = useUser();
  const { group } = route.params;

  const groupId = group.groupId;
  const groupName = group.groupName;
  const messageIds = useRef(new Set());

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  const { socket, sendGroupMessage, likeGroupMessage } = useGroupChatSocket(
    groupId,
    setMessages,
    messageIds,
    userData
  );

  useEffect(() => {
    fetchGroupMessages(
      groupId,
      setMessages,
      setLoading,
      setRefreshing,
      messageIds
    );
  }, [groupId, userData.userhandle]);

  const onRefresh = () => {
    setRefreshing(true);
    setMessages([]); // ✅ Clear existing messages
    messageIds.current.clear(); // ✅ Clear message IDs to avoid duplicates

    fetchGroupMessages(
      groupId,
      setMessages,
      setLoading,
      setRefreshing,
      messageIds
    );
  };

  const handleSendMessage = async (content = null, imageUrl = null) => {
    if ((!content || !content.trim()) && !imageUrl) return; // Ensure at least content or image exists

    try {
      const messageContent = content && content.trim() ? content.trim() : null; // Avoid calling trim() on null

      await sendGroupMessage(messageContent, imageUrl);
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
        <GroupChatHeader group={group} navigation={navigation} />

        {loading && !refreshing ? (
          <ActivityIndicator
            style={styles.center}
            size="large"
            color={colors.primary}
          />
        ) : (
          <GroupChatContainer
            messages={messages}
            setMessages={setMessages}
            likeMessage={likeGroupMessage}
            profile={userData}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}

        <GroupMessageInput
          groupId={groupId}
          sendMessage={handleSendMessage}
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
