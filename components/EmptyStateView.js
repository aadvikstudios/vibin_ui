import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

const EmptyStateView = ({
  onPrimaryAction,
  onSecondaryAction,
  title,
  subtitle,
  primaryActionText,
  secondaryActionText,
  icon,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Optional Icon or Circle */}
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : (
        <View style={[styles.circle, { borderColor: colors.primary }]} />
      )}

      {/* Title */}
      <Text style={[styles.title, { color: colors.primaryText }]}>
        {title || 'It’s quiet around here'}
      </Text>

      {/* Subtitle */}
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        {subtitle ||
          'To find more people near you, update your search settings.'}
      </Text>

      {/* Primary Action Button */}
      {primaryActionText && (
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={onPrimaryAction}
        >
          <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>
            {primaryActionText}
          </Text>
        </TouchableOpacity>
      )}

      {/* Secondary Action Button */}
      {secondaryActionText && (
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.outline,
            },
          ]}
          onPress={onSecondaryAction}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
            {secondaryActionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EmptyStateView;