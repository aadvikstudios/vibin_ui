import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const GroupChatHeader = ({ groupImage, groupName, members, navigation }) => {
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

      {/* 🟡 Group Avatar & Name */}
      <Avatar.Image source={{ uri: groupImage }} size={40} />
      <View style={styles.infoContainer}>
        <Text
          style={[styles.groupName, { color: colors.primaryText }]}
          numberOfLines={1}
        >
          {groupName}
        </Text>
        <Text style={[styles.members, { color: colors.secondaryText }]}>
          {members.length} members
        </Text>
      </View>

      {/* ⚙️ Group Settings (Future feature) */}
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

/** Styles */
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 15,
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1, // ✅ Ensures text doesn't overlap with buttons
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  members: {
    fontSize: 14,
  },
  iconButton: {
    marginLeft: 15,
  },
});

export default GroupChatHeader;
