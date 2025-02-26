import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import EmptyStateView from '../../../components/EmptyStateView';
import ChatItem from './ChatItem'; // ✅ Import ChatItem component

const ConnectionsScreen = ({ connections, loading, userProfile }) => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();

  console.log('ConnectionsScreen:', connections);

  // ✅ Filter new matches and active chats
  const newMatches = connections.filter((item) => item.status === 'active'); // Matches with no chat history
  const chats = connections.filter((item) => item.lastMessage); // Matches where a chat has started

  const handlePress = (item) => {
    navigation.navigate('PersonalChatScreen', { match: item });
  };

  // ✅ Render new match cards (Horizontal List)
  const renderNewMatch = ({ item }) => (
    <TouchableOpacity
      style={[styles.newMatchCard, { backgroundColor: colors.surfaceVariant }]}
      onPress={() => handlePress(item)}
    >
      <Image
        source={{
          uri: item.photos?.[0] || 'https://via.placeholder.com/50', // Default placeholder
        }}
        style={styles.newMatchAvatar}
      />
      <Text style={[styles.newMatchName, { color: colors.primaryText }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
        Loading connections...
      </Text>
    </View>
  ) : (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with total connections count */}
      <View style={styles.header}>
        <View
          style={[
            styles.connectionsCountContainer,
            { backgroundColor: colors.primaryContainer },
          ]}
        >
          <Text
            style={[
              styles.connectionsCount,
              { color: colors.onPrimaryContainer },
            ]}
          >
            {connections.length}
          </Text>
        </View>

        {/* ✅ Render new matches if available */}
        {newMatches.length > 0 && (
          <FlatList
            data={newMatches}
            horizontal
            keyExtractor={(item) => item.matchId}
            renderItem={renderNewMatch}
            contentContainerStyle={styles.newMatchesContainer}
          />
        )}
      </View>

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
            // Case 1: No matches or chats
            <EmptyStateView
              title="See your Connections here"
              subtitle="When you like someone and the feelings are mutual, they become a Connection. Start your journey by tapping Like on the profiles that catch your eye."
              primaryActionText="Discover more people"
              onPrimaryAction={() =>
                console.log('Discover more people pressed')
              }
            />
          ) : newMatches.length > 0 && chats.length === 0 ? (
            // Case 2: No chats but new matches exist
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  connectionsCountContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  connectionsCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newMatchesContainer: {
    flexDirection: 'row',
  },
  newMatchCard: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
  },
  newMatchAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  newMatchName: {
    marginTop: 5,
    fontSize: 12,
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
