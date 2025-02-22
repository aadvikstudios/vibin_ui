import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActionButtons = ({ onPress }) => {
  const { colors } = useTheme(); // Get colors from theme.js

  return (
    <View style={styles.actionContainer}>
      {/* Dislike Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.disliked, shadowColor: colors.disliked },
        ]}
        onPress={() => onPress('notliked')}
      >
        <View style={[styles.shadowEffect, { shadowColor: colors.disliked }]} />
        <Icon name="close" size={32} color={colors.onDisliked} />
      </TouchableOpacity>

      {/* Like Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.liked, shadowColor: colors.liked },
        ]}
        onPress={() => onPress('liked')}
      >
        <View style={[styles.shadowEffect, { shadowColor: colors.liked }]} />
        <Icon name="heart" size={32} color={colors.onLiked} />
      </TouchableOpacity>

      {/* Ping Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.disliked, shadowColor: colors.disliked },
        ]}
        onPress={() => onPress('pinged')}
      >
        <View style={[styles.shadowEffect, { shadowColor: colors.disliked }]} />
        <Icon name="send" size={32} color={colors.onDisliked} />
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
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 6,
  },
  shadowEffect: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassmorphism effect
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
});

export default ActionButtons;
