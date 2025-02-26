import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ChatItem = ({ item }) => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('PersonalChatScreen', { match: item });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={handlePress}
    >
      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: item.photos?.[0] || 'https://via.placeholder.com/50',
          }}
          style={styles.avatar}
        />
      </View>

      {/* User Info */}
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

      {/* 🔴 Red Dot at Rightmost Center for Unread Messages */}
      {item.isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  unreadDot: {
    position: 'absolute',
    right: 15, // Rightmost position
    top: '50%', // Center vertically
    transform: [{ translateY: -6 }], // Adjust for centering
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red', // 🔴 Red dot for unread messages
  },
});

export default ChatItem;
