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
import ConnectionsHeader from './ConnectionsHeader'; // ✅ Import new component

const ConnectionsScreen = ({ connections, loading, userProfile }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  console.log('ConnectionsScreen:', connections[0]?.lastMessage);

  // ✅ Filter new matches and active chats
  const newMatches = connections.filter(
    (item) => item.lastMessage === undefined
  );
  const chats = connections.filter((item) => item.lastMessage);

  const handlePress = (item) => {
    navigation.navigate('PersonalChatScreen', { match: item });
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
      {/* ✅ Connections Header Component */}
      <ConnectionsHeader
        connectionsCount={connections.length}
        newMatches={newMatches}
        onPressMatch={handlePress}
      />

      {/* ✅ Render Chat List using ChatItem component */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.matchId}
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
});

export default ConnectionsScreen;
