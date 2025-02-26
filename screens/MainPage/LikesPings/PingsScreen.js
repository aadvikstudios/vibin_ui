import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import ProfileCard from './ProfileCard'; // ✅ Reusable Profile Component
import { actionPingAPI } from '../../../api';
import EmptyStateView from '../../../components/EmptyStateView';
import {
  DECLINE_ACTION,
  ACCEPT_ACTION,
  PING_ACTION,
} from '../../../constants/actionConstants'; // ✅ Import constants

const PingsScreen = ({ pings, loading, userProfile }) => {
  const { colors } = useTheme();

  const handlePingAction = async (senderHandle, action) => {
    try {
      const payload = {
        receiverHandle: userProfile.receiverHandle,
        senderHandle,
        action,
      };

      const response = await actionPingAPI(payload);
      console.log('Ping Action Response:', response);
    } catch (error) {
      console.error('Error in handlePingAction:', error.message);
    }
  };

  return loading ? (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ) : (
    <FlatList
      data={pings}
      keyExtractor={(item) => item.senderHandle}
      renderItem={({ item }) => (
        <ProfileCard
          profile={item}
          type={PING_ACTION}
          onPrimaryAction={() =>
            handlePingAction(item.senderHandle, ACCEPT_ACTION)
          }
          onSecondaryAction={() =>
            handlePingAction(item.senderHandle, DECLINE_ACTION)
          }
        />
      )}
      ListEmptyComponent={
        <EmptyStateView
          title="No Pings Yet"
          subtitle="Waiting for someone to ping you!"
        />
      }
      contentContainerStyle={{ flexGrow: 1, padding: 10 }}
      style={[styles.flatList, { backgroundColor: colors.background }]} // ✅ Ensuring background color
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
    flex: 1, // Ensures it takes full height
  },
});

export default PingsScreen;
