import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
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
  const [processingAction, setProcessingAction] = useState(null); // ✅ Tracks which action is in progress

  const handlePingAction = async (senderHandle, action) => {
    setProcessingAction(senderHandle); // ✅ Set loading state for the specific sender

    try {
      const endpoint =
        action === ACCEPT_ACTION
          ? '/api/interactions/ping/approve'
          : '/api/interactions/ping/decline';
      console.log('user data is ', userProfile);
      const payload = {
        receiverHandle: userProfile.userhandle,
        senderHandle,
      };

      const response = await actionPingAPI(endpoint, payload);
      console.log(`Ping ${action} Action Response:`, response);

      Alert.alert(
        'Success',
        `Ping ${action === ACCEPT_ACTION ? 'approved' : 'declined'} successfully!`
      );
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} ping. Please try again.`);
      console.error(`Error in handlePingAction (${action}):`, error.message);
    } finally {
      setProcessingAction(null); // ✅ Reset processing state
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
          isLoading={processingAction === item.senderHandle} // ✅ Disables button while processing
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
