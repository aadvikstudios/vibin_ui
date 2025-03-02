import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GroupChatItem = ({ group, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={() => onPress(group)} // ✅ Calls the onPress function with the group data
    >
      <View style={styles.iconContainer}>
        <Icon name="account-group" size={32} color={colors.primary} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.groupName, { color: colors.primaryText }]}>
          {group.groupName} {/* ✅ Display group name instead of ID */}
        </Text>
        <Text style={[styles.memberCount, { color: colors.secondaryText }]}>
          {group.members.length} members
        </Text>
      </View>
    </TouchableOpacity>
  );
};

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
  iconContainer: {
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
