import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import ProfileCard from './ProfileCard'; // ✅ Using the new reusable component
import { sendActionToBackendAPI } from '../../../api';
import EmptyStateView from '../../../components/EmptyStateView';
import {
  LIKE_ACTION,
  DISLIKE_ACTION,
} from '../../../constants/actionConstants'; // ✅ Import constants

const LikesScreen = ({ likes, loading, userProfile }) => {
  const { colors } = useTheme();

  const handleLikeAction = async (senderHandle, action) => {
    try {
      const response = await sendActionToBackendAPI(
        userProfile.userhandle,
        senderHandle,
        action
      );
      console.log('Like Action Response:', response);
    } catch (error) {
      console.error('Error in handleLikeAction:', error.message);
    }
  };

  return loading ? (
    <View
      style={[styles.loadingContainer, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ) : (
    <FlatList
      data={likes}
      keyExtractor={(item) => item.senderHandle}
      renderItem={({ item }) => (
        <ProfileCard
          profile={item}
          type={LIKE_ACTION}
          onPrimaryAction={() =>
            handleLikeAction(item.senderHandle, LIKE_ACTION)
          }
          onSecondaryAction={() =>
            handleLikeAction(item.senderHandle, DISLIKE_ACTION)
          }
        />
      )}
      ListEmptyComponent={
        <EmptyStateView title="No Likes Yet" subtitle="Keep swiping!" />
      }
      contentContainerStyle={{ flexGrow: 1, padding: 10 }}
    />
  );
};

// ✅ Adding missing styles to prevent errors
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LikesScreen;
