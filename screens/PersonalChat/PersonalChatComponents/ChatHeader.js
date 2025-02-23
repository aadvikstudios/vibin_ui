import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ChatHeader = ({ chatImage, chatName, navigation, onInvitePress }) => {
  const { colors } = useTheme(); // ✅ Get latest theme colors

  return (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
      </TouchableOpacity>

      {/* 🟡 Chat Avatar & Name */}
      <Avatar.Image source={{ uri: chatImage }} size={40} />
      <Text style={[styles.chatName, { color: colors.primaryText }]}>
        {chatName}
      </Text>

      {/* ➕ Invite Button */}
      <TouchableOpacity onPress={onInvitePress} style={styles.iconButton}>
        <Ionicons name="person-add" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 15,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1, // ✅ Ensures text doesn't overlap with buttons
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default ChatHeader;
