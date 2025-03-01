import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import NotificationDropdown from './NotificationDropdown'; // ✅ Import the new component

const ConnectionsHeader = ({
  connectionsCount,
  newMatches = [],
  pendingInvites = [],
  onPressMatch,
  onPressNotifications,
}) => {
  const { colors } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (onPressNotifications) {
      onPressNotifications();
    }
  };

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
          keyExtractor={(item, index) => item.matchId || `match-${index}`}
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
                  source={{ uri: item.photo }}
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

      {/* ✅ Notification Bell Icon with Badge */}
      <TouchableOpacity
        style={styles.notificationIcon}
        onPress={toggleNotifications}
      >
        <Icon name="notifications-outline" size={28} color={colors.primary} />
        {pendingInvites.length > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{pendingInvites.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ✅ Notification Dropdown */}
      <NotificationDropdown
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        pendingInvites={pendingInvites}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    position: 'relative',
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
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  },
  newMatchName: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  notificationIcon: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ConnectionsHeader;
