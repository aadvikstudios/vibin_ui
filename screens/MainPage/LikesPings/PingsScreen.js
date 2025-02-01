import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import PingCard from './PingCard'; // Import the PingCard component
import { actionPingAPI } from '../../../api'; // Import your unified API function
import EmptyStateView from '../../../components/EmptyStateView';
const PingsScreen = ({ pings: initialPings, loading, userProfile }) => {
  const { colors } = useTheme();
  const [updatedPings, setUpdatedPings] = useState([...initialPings]); // Maintain a local state for pings
  console.log('initialPings ', initialPings, updatedPings);

  const handlePingAction = async (emailId, actionType, pingNote = null) => {
    try {
      // Construct request payload conditionally
      const payload = {
        userEmailId: userProfile.emailId,
        targetEmailId: emailId,
        actionType,
        ...(pingNote ? { pingNote } : {}), // Only add pingNote if it's provided
      };

      console.log('Sending request:', payload);

      // Call the API
      const response = await actionPingAPI(payload);

      console.log('API response:', response);

      if (response.message) {
        // Remove the processed ping from the list
        setUpdatedPings(
          updatedPings.filter((ping) => ping.senderEmailId !== emailId)
        );
      } else {
        console.error(
          `Error performing action (${actionType}): ${response.message}`
        );
      }
    } catch (error) {
      console.error(
        `Error in handlePingAction (${actionType}): ${error.message}`
      );
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={updatedPings} // Use the local state for pings
      keyExtractor={(item, index) => `${item.senderEmailId}-${index}`}
      renderItem={({ item }) => (
        <PingCard
          ping={item}
          onAccept={() =>
            handlePingAction(item.senderEmailId, 'accept', item.pingNote)
          }
          onDecline={() =>
            handlePingAction(item.senderEmailId, 'decline', null)
          }
        />
      )}
      ListEmptyComponent={
        <EmptyStateView
          title="Good Pings come to those who wait"
          subtitle="People can send a Ping to let you know they’re into you. Pings can help you connect faster when the feeling’s mutual."
          secondaryActionText="Edit search settings"
          onSecondaryAction={() => console.log('Edit settings pressed')}
        />
      }
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: colors.background, // Ensure the list has a themed background
        padding: 10,
      }}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default PingsScreen;
