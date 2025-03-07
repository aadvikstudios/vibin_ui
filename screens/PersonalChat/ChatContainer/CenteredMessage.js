import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CenteredMessage = ({ message, colors }) => {
  return (
    <View style={styles.centerMessageContainer}>
      <Text style={[styles.centerMessageText, { color: colors.primary }]}>
        Hey! You both matched! 🎉 Start a conversation now!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerMessageText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CenteredMessage;
