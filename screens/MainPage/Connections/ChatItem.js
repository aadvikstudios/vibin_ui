import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MESSAGE_TYPES } from '../../../constants/messageConstants';

const ChatItem = ({ item, userProfile }) => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('PersonalChatScreen', { match: item });
  };
  // ✅ Helper function to format last message display text
  const getLastMessageDisplayTextForInitial = (lastMessage) => {
    if (lastMessage === MESSAGE_TYPES.MATCH_BOT) {
      return '🎉 Congratulations! Make your move, start chatting!';
    }
    return item.lastMessage || 'No messages yet';
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Profile Picture */}
      <Image source={{ uri: item.photo }} style={styles.avatar} />

      {/* Chat Info */}
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.name,
            {
              color: colors.primaryText,
              fontFamily: fonts.displayMedium.fontFamily,
            },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.lastMessage,
            {
              color: colors.secondaryText,
              fontFamily: fonts.displaySmall.fontFamily,
            },
          ]}
          numberOfLines={1}
        >
          {getLastMessageDisplayTextForInitial(item.lastMessage)}
        </Text>
      </View>

      {/* Unread Message Indicator */}
      {!item.lastMessageIsRead &&
        item.lastMessageSender !== userProfile.userhandle && (
          <View
            style={[styles.unreadDot, { backgroundColor: colors.notification }]}
          />
        )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    borderWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.8,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -6 }],
  },
});

export default ChatItem;
