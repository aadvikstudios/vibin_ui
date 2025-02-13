import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActionButtons = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.actionContainer}>
      {/* Dislike Button */}
      <TouchableOpacity
        style={[styles.actionButton, styles.dislikeButton]}
        onPress={() => onPress('notliked')}
      >
        <View style={styles.shadowEffect} />
        <Icon name="close" size={32} color="white" />
      </TouchableOpacity>

      {/* Like Button with Transparency */}
      <TouchableOpacity
        style={[styles.actionButton, styles.likeButton]}
        onPress={() => onPress('liked')}
      >
        <View style={styles.shadowEffect} />
        <Icon name="heart" size={32} color="white" />
      </TouchableOpacity>

      {/* Ping Button */}
      <TouchableOpacity
        style={[styles.actionButton, styles.pingButton]}
        onPress={() => onPress('pinged')}
      >
        <View style={styles.shadowEffect} />
        <Icon name="send" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    bottom: 85,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shadowEffect: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassmorphism effect
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  dislikeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  likeButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.75)', // Semi-transparent red
    shadowColor: '#ff5252',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 8 },
  },
  pingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default ActionButtons;
