import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import ProfileCard from './ProfileCard'; // ✅ Reusable Profile Component
import { sendActionToBackendAPI } from '../../../api';
import EmptyStateView from '../../../components/EmptyStateView';
import {
  LIKE_ACTION,
  DISLIKE_ACTION,
} from '../../../constants/actionConstants'; // ✅ Import constants

const LikesScreen = ({ likes, loading, userProfile, onRefresh }) => {
  const { colors } = useTheme();

  const handleLikeAction = async (senderHandle, action) => {
    try {
      const response = await sendActionToBackendAPI(
        userProfile.userhandle,
        senderHandle,
        action
      );

      console.log('Like Action Response:', response);

      // ✅ If like action is successful, trigger refetch
      if (response?.status === 'success') {
        console.log('✅ Refreshing data after like action');
        onRefresh(); // 🔄 Calls the function passed from MainPage to refetch data
      }
    } catch (error) {
      console.error('Error in handleLikeAction:', error.message);
    }
  };

  return loading ? (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
      style={[styles.flatList, { backgroundColor: colors.background }]} // ✅ Setting background for FlatList
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flex: 1, // Ensures it takes the full height
  },
});

export default LikesScreen;
