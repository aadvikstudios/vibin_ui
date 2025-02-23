import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ChatHeader = ({
  chatImage,
  chatName,
  navigation,
  colors,
  onInvitePress,
  onReferPress,
}) => {
  return (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Chat Avatar and Name */}
      <Avatar.Image source={{ uri: chatImage }} size={40} />
      <Text style={[styles.chatName, { color: colors.primaryText }]}>
        {chatName}
      </Text>

      {/* Invite a Third Person */}
      <TouchableOpacity onPress={onInvitePress} style={styles.iconButton}>
        <Ionicons name="person-add" size={24} color={colors.primaryText} />
      </TouchableOpacity>

      {/* Refer a Match */}
      <TouchableOpacity onPress={onReferPress} style={styles.iconButton}>
        <Ionicons name="share-social" size={24} color={colors.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  backButton: {
    marginRight: 10,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1, // Ensures text doesn't overlap with buttons
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default ChatHeader;
