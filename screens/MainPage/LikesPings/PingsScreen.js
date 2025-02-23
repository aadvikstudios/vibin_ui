import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import PingCard from './PingCard';
import { actionPingAPI } from '../../../api';
import EmptyStateView from '../../../components/EmptyStateView';

const PingsScreen = ({ pings: initialPings, loading, userProfile }) => {
  const { colors } = useTheme();
  const [updatedPings, setUpdatedPings] = useState([...initialPings]);

  useEffect(() => {
    setUpdatedPings(initialPings);
  }, [initialPings]);

  const handlePingAction = async (emailId, action, pingNote = null) => {
    try {
      const payload = {
        emailId: userProfile.emailId,
        targetEmailId: emailId,
        action,
        ...(pingNote ? { pingNote } : {}),
      };

      console.log('Sending request:', payload);
      const response = await actionPingAPI(payload);

      if (response.message) {
        setUpdatedPings(
          updatedPings.filter((ping) => ping.senderEmailId !== emailId)
        );
      } else {
        console.error(`Error performing action: ${response.message}`);
      }
    } catch (error) {
      console.error(`Error in handlePingAction: ${error.message}`);
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
      data={updatedPings}
      keyExtractor={(item, index) => `${item.senderEmailId}-${index}`}
      renderItem={({ item }) => (
        <PingCard
          ping={item}
          onAccept={() =>
            handlePingAction(item.senderEmailId, 'accept', item.pingNote)
          }
          onDecline={() => handlePingAction(item.senderEmailId, 'decline')}
        />
      )}
      ListEmptyComponent={
        <EmptyStateView
          title="Good Pings come to those who wait"
          subtitle="People can send a Ping to let you know they’re into you."
          secondaryActionText="Edit search settings"
          onSecondaryAction={() => console.log('Edit settings pressed')}
        />
      }
      contentContainerStyle={{ flexGrow: 1, padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PingsScreen;
