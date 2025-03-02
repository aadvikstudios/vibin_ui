import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import EmptyStateView from '../../../components/EmptyStateView';
import ChatItem from './ChatItem';
import GroupChatItem from './GroupChatItem'; // ✅ New component for groups
import ConnectionsHeader from './ConnectionsHeader';
import { MESSAGE_TYPES } from '../../../constants/messageConstants';

const isInitialMessage = (item) =>
  item.lastMessage === MESSAGE_TYPES.MATCH_BOT &&
  item.lastMessageIsRead === false;

const ConnectionsScreen = ({
  connections = [],
  pendingInvites = [],
  groupConnections = [],
  loading,
  userProfile,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const safeConnections = connections ?? [];
  const safePendingInvites = pendingInvites ?? [];
  const safeGroupConnections = groupConnections ?? [];

  console.log('Group Connections:', safeGroupConnections);

  // Separate new matches and active chats
  const newMatches = safeConnections.filter(isInitialMessage);
  const chats = safeConnections.filter((item) => !isInitialMessage(item));

  const handlePress = (item) => {
    navigation.navigate('PersonalChatScreen', { match: item });
  };

  const handleGroupPress = (group) => {
    navigation.navigate('GroupChatScreen', { group });
  };

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
        Loading connections...
      </Text>
    </View>
  ) : (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ✅ Connections Header */}
      <ConnectionsHeader
        connectionsCount={safeConnections.length}
        newMatches={newMatches}
        pendingInvites={safePendingInvites}
        onPressMatch={handlePress}
      />

      {/* ✅ Personal Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item, index) => item.matchId || `chat-${index}`}
        renderItem={({ item }) => (
          <ChatItem item={item} userProfile={userProfile} />
        )}
        contentContainerStyle={
          chats.length ? styles.chatList : styles.emptyContainer
        }
        ListEmptyComponent={
          newMatches.length === 0 && chats.length === 0 ? (
            <EmptyStateView
              title="See your Connections here"
              subtitle="When you like someone and the feelings are mutual, they become a Connection. Start your journey by tapping Like on the profiles that catch your eye."
              primaryActionText="Discover more people"
              onPrimaryAction={() =>
                console.log('Discover more people pressed')
              }
            />
          ) : newMatches.length > 0 && chats.length === 0 ? (
            <EmptyStateView
              title="You have new connections!"
              subtitle="Start connecting by sending a message to your new matches."
              primaryActionText="View new connections"
              onPrimaryAction={() =>
                console.log('View new connections pressed')
              }
            />
          ) : null
        }
      />

      {/* ✅ Group Chat List */}
      {safeGroupConnections.length > 0 && (
        <View style={styles.groupChatSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            Group Chats
          </Text>
          <FlatList
            data={safeGroupConnections}
            keyExtractor={(group) => group.groupId}
            renderItem={({ item }) => (
              <GroupChatItem group={item} onPress={handleGroupPress} /> // ✅ Pass handleGroupPress
            )}
            contentContainerStyle={styles.groupChatList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  groupChatSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  groupChatList: {
    paddingBottom: 10,
  },
});

export default ConnectionsScreen;
