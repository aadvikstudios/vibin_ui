import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CenteredGroupMessage = ({ message, colors }) => {
  return (
    <View style={styles.centerMessageContainer}>
      <Text style={[styles.centerMessageText, { color: colors.primary }]}>
        {message?.content ||
          'Welcome to the group chat! 🎉 Say hello to everyone!'}
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

export default CenteredGroupMessage;
