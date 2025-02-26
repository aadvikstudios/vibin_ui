import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * ProfileCard Component - Used for displaying user profiles in Likes, Pings, and Matches.
 *
 * @param {Object} profile - The user profile data.
 * @param {String} type - Defines the context (e.g., "like", "ping", "match").
 * @param {Function} onPrimaryAction - Function to handle the main action (e.g., like, accept ping).
 * @param {Function} onSecondaryAction - Function to handle the secondary action (e.g., dislike, decline ping).
 */
const ProfileCard = ({ profile, type, onPrimaryAction, onSecondaryAction }) => {
  const { colors, fonts } = useTheme();

  // Define action icons dynamically based on type
  const actionIcons = {
    like: { primary: 'heart', secondary: 'minus' }, // Like & Dislike
    ping: { primary: 'check', secondary: 'close' }, // Accept & Decline
    match: { primary: 'message-text', secondary: 'close' }, // Start Chat & Unmatch
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Profile Photo */}
      <View style={styles.photoContainer}>
        {profile.photos && profile.photos.length > 0 ? (
          <Image source={{ uri: profile.photos[0] }} style={styles.photo} />
        ) : (
          <Avatar.Text
            size={60}
            label={profile.name?.charAt(0).toUpperCase() || '?'}
            style={[styles.avatar, { backgroundColor: colors.disabled }]}
          />
        )}
      </View>

      {/* User Details */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.name,
            { color: colors.primaryText, ...fonts.displayMedium },
          ]}
        >
          {profile.name}, {profile.age}
        </Text>
        <Text
          style={[
            styles.secondaryText,
            { color: colors.secondaryText, ...fonts.bodyMedium },
          ]}
        >
          {profile.gender}, {profile.orientation}
        </Text>

        {/* Display message for Pings */}
        {type === 'ping' && profile.message && (
          <Text
            style={[
              styles.pingNote,
              { color: colors.onSurfaceVariant, ...fonts.bodyMedium },
            ]}
          >
            {profile.message}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {/* Secondary Action (Dislike, Decline, Unmatch) */}
        <TouchableOpacity
          onPress={onSecondaryAction}
          style={styles.actionButton}
        >
          <Avatar.Icon
            size={36}
            icon={actionIcons[type]?.secondary}
            color={colors.onDanger}
            style={[styles.actionIcon, { backgroundColor: colors.danger }]}
          />
        </TouchableOpacity>

        {/* Primary Action (Like, Accept, Start Chat) */}
        <TouchableOpacity onPress={onPrimaryAction} style={styles.actionButton}>
          <Avatar.Icon
            size={36}
            icon={actionIcons[type]?.primary}
            color={colors.onPrimary}
            style={[styles.actionIcon, { backgroundColor: colors.primary }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 3,
  },
  photoContainer: {
    marginRight: 15,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatar: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryText: {
    marginTop: 3,
    fontSize: 14,
  },
  pingNote: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
  },
  actionIcon: {
    borderRadius: 18,
    elevation: 2,
  },
});

export default ProfileCard;
