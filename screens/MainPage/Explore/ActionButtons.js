import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActionButtons = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.actionContainer}>
      {/* Dislike Button */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface }]}
        onPress={() => onPress('notliked')}
      >
        <Icon name="minus" size={24} color={colors.primaryText} />
      </TouchableOpacity>

      {/* Like Button */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={() => onPress('liked')}
      >
        <Icon name="heart" size={24} color={colors.onPrimary} />
      </TouchableOpacity>

      {/* Ping Button */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface }]}
        onPress={() => onPress('pinged')}
      >
        <Icon name="send" size={24} color={colors.primaryText} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default ActionButtons;
