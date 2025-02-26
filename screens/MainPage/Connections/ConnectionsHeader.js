import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';

const ConnectionsHeader = ({ connectionsCount, newMatches, onPressMatch }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.headerContainer}>
      {/* ✅ Connections Count */}
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
          {connectionsCount}
        </Text>
      </View>

      {/* ✅ New Matches Section */}
      {newMatches.length > 0 && (
        <FlatList
          data={newMatches}
          horizontal
          keyExtractor={(item) => item.matchId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.newMatchCard,
                { backgroundColor: colors.surfaceVariant },
              ]}
              onPress={() => onPressMatch(item)}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: item.photos?.[0] || 'https://via.placeholder.com/50',
                  }}
                  style={styles.newMatchAvatar}
                />
                {/* 🔴 Red Dot Indicator for New Match */}
                <View style={styles.redDot} />
              </View>
              <Text
                style={[styles.newMatchName, { color: colors.primaryText }]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.newMatchesContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligns elements properly
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  connectionsCountContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectionsCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newMatchesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  newMatchCard: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative', // Needed for Red Dot positioning
  },
  newMatchAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  redDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red', // 🔴 Red dot for new matches
    borderWidth: 2,
    borderColor: 'white',
  },
  newMatchName: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ConnectionsHeader;
