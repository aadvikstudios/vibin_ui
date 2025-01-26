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

const ConnectionsScreen = ({ connections, loading, userProfile }) => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();

  console.log('ConnectionsScreen:', connections);

  const newMatches = connections.filter((item) => !item.senderId);
  const chats = connections.filter((item) => item.senderId);

  const handlePress = (item) => {
    navigation.navigate('PersonalChatScreen', { match: item });
  };

  const renderNewMatch = ({ item }) => (
    <TouchableOpacity
      style={[styles.newMatchCard]}
      onPress={() => handlePress(item)}
    >
      <Image source={{ uri: item.photo }} style={styles.newMatchAvatar} />
      <Text style={[styles.newMatchName, { color: colors.primaryText }]}>
        {item.name}
      </Text>
      {item.isUnread && <View style={styles.redDot} />}
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => handlePress(item)}
    >
      <Image source={{ uri: item.photo }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.name,
            { color: colors.primaryText, ...fonts.displaySmall },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.lastMessage,
            { color: colors.secondaryText, ...fonts.displaySmall },
          ]}
          numberOfLines={1}
        >
          {item.lastMessage || 'No messages yet'}
        </Text>
      </View>
      {item.isUnread && item.senderId !== userProfile.userId && (
        <View style={styles.redDot} />
      )}
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
            style={[styles.connectionsCount, { color: colors.primaryText }]}
          >
            {connections.length}
          </Text>
        </View>
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

      <FlatList
        data={chats}
        keyExtractor={(item) => item.matchId}
        renderItem={renderChatItem}
        contentContainerStyle={
          chats.length ? styles.chatList : styles.emptyContainer
        }
        ListEmptyComponent={
          newMatches.length === 0 && chats.length === 0 ? (
            // Case 1: No new matches and no old matches
            <EmptyStateView
              title="See your Connections here"
              subtitle="When you like someone and the feelings are mutual, they become a Connection. Start your journey by tapping Like on the profiles that catch your eye."
              primaryActionText="Discover more people"
              onPrimaryAction={() =>
                console.log('Discover more people pressed')
              }
            />
          ) : newMatches.length > 0 && chats.length === 0 ? (
            // Case 2: No old matches but new matches exist
            <EmptyStateView
              title="You have new connections!"
              subtitle="Start connecting by sending a message to your new matches."
              primaryActionText="View new connections"
              onPrimaryAction={() =>
                console.log('View new connections pressed')
              }
            />
          ) : // Case 3: Both new and old matches exist (default fallback)
          null
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
    position: 'relative',
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  redDot: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    position: 'absolute',
    top: 5,
    right: 5,
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
