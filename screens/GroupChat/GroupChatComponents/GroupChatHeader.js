import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const GroupChatHeader = ({ group, navigation }) => {
  const { colors } = useTheme();

  // ✅ Capitalize first letter function
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const groupName = capitalizeFirstLetter(group?.groupName || 'Unnamed Group');
  const membersCount = group?.members?.length || 0;

  // ✅ Extract first letter of the group name for Avatar
  const groupInitial = groupName.charAt(0).toUpperCase();

  return (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
      </TouchableOpacity>

      {/* 🟡 Group Avatar with Initial */}
      <Avatar.Text
        size={40}
        label={groupInitial}
        style={{ backgroundColor: colors.primary }} // ✅ Dynamic Background
        labelStyle={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} // ✅ Letter Styling
      />

      {/* Group Name & Members Count */}
      <View style={styles.infoContainer}>
        <Text
          style={[styles.groupName, { color: colors.primaryText }]}
          numberOfLines={1}
        >
          {groupName}
        </Text>
        <Text style={[styles.members, { color: colors.secondaryText }]}>
          {membersCount} members
        </Text>
      </View>

      {/* ⚙️ Group Settings */}
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
    flex: 1,
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
