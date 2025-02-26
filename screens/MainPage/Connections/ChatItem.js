import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ChatItem = ({ item, userProfile }) => {
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
      <Image
        source={{
          uri: item.photos?.[0] || 'https://via.placeholder.com/50', // Default placeholder
        }}
        style={styles.avatar}
      />
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
});

export default ChatItem;
