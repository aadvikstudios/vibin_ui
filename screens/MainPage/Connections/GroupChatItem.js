import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Avatar } from 'react-native-paper';

const GroupChatItem = ({ group, onPress }) => {
  const { colors } = useTheme();

  // ✅ Capitalize the first letter of the group name
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const groupName = capitalizeFirstLetter(group?.groupName || 'Unnamed Group');

  // ✅ Extract first letter for Avatar
  const groupInitial = groupName.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={() => onPress(group)} // ✅ Calls the onPress function with the group data
    >
      {/* ✅ Avatar with Group Initial */}
      <Avatar.Text
        size={48}
        label={groupInitial}
        style={[styles.avatar, { backgroundColor: colors.primary }]} // ✅ Dynamic Background
        labelStyle={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} // ✅ Letter Styling
      />

      {/* Group Name & Members Count */}
      <View style={styles.infoContainer}>
        <Text style={[styles.groupName, { color: colors.primaryText }]}>
          {groupName}
        </Text>
        <Text style={[styles.memberCount, { color: colors.secondaryText }]}>
          {group.members.length > 3
            ? '3+ members'
            : `${group.members.length} members`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/** Styles */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  avatar: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberCount: {
    fontSize: 14,
  },
});

export default GroupChatItem;
