import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';

const PingCard = ({ ping, onAccept, onDecline }) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Profile Photo */}
      <View style={styles.photoContainer}>
        {ping.senderPhoto ? (
          <Image source={{ uri: ping.senderPhoto }} style={styles.photo} />
        ) : (
          <Avatar.Text
            size={60}
            label={ping.senderName?.charAt(0).toUpperCase() || '?'}
            style={[styles.avatar, { backgroundColor: colors.disabled }]}
          />
        )}
      </View>

      {/* User Details */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.name,
            { color: colors.primaryText, ...fonts.headlineSmall },
          ]}
        >
          {ping.senderName}, {ping.senderAge}
        </Text>
        <Text
          style={[
            styles.secondaryText,
            { color: colors.secondaryText, ...fonts.bodyMedium },
          ]}
        >
          {ping.senderGender}, {ping.senderOrientation}
        </Text>
        <Text
          style={[
            styles.pingNote,
            { color: colors.onSurface, ...fonts.bodyMedium },
          ]}
        >
          {ping.pingNote}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onDecline} style={styles.declineButton}>
          <Avatar.Icon
            size={36}
            icon="close"
            color={colors.danger}
            style={[styles.actionIcon, { backgroundColor: colors.surface }]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
          <Avatar.Icon
            size={36}
            icon="check"
            color={colors.primary}
            style={[styles.actionIcon, { backgroundColor: colors.surface }]}
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
  actionIcon: {
    borderRadius: 18,
    elevation: 2,
  },
  declineButton: {
    marginRight: 8,
  },
});
export default PingCard;
