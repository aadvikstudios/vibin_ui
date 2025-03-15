import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import GroupChatItem from './GroupChatItem'; // ✅ GroupChatItem Component

const GroupChatList = ({ groups, onGroupPress }) => {
  const { colors } = useTheme();

  if (!groups || groups.length === 0) {
    return null; // ✅ Don't render if there are no group chats
  }

  return (
    <View style={styles.groupChatSection}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        Group Chats
      </Text>
      <FlatList
        data={groups}
        keyExtractor={(group) => group.groupId}
        renderItem={({ item }) => (
          <GroupChatItem group={item} onPress={onGroupPress} /> // ✅ Handle Group Press
        )}
        contentContainerStyle={styles.groupChatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  groupChatSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  groupChatList: {
    paddingBottom: 10,
  },
});

export default GroupChatList;
