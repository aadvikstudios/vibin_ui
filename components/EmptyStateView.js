import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

/**
 * A reusable Empty State View for various sections like Likes, Pings, and Matches.
 *
 * @param {Function} onPrimaryAction - Function to handle the primary action button click.
 * @param {Function} onSecondaryAction - Function to handle the secondary action button click.
 * @param {String} title - The title text for the empty state.
 * @param {String} subtitle - The subtitle text for more context.
 * @param {String} primaryActionText - Text for the primary action button.
 * @param {String} secondaryActionText - Text for the secondary action button.
 * @param {ReactNode} icon - Optional icon to display.
 */
const EmptyStateView = ({
  onPrimaryAction,
  onSecondaryAction,
  title,
  subtitle,
  primaryActionText,
  secondaryActionText,
  icon,
}) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Optional Icon or Decorative Circle */}
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : (
        <View style={[styles.circle, { borderColor: colors.primary }]} />
      )}

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: colors.primaryText, ...fonts.displayMedium },
        ]}
      >
        {title || 'It’s quiet around here'}
      </Text>

      {/* Subtitle */}
      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText, ...fonts.displaySmall },
        ]}
      >
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
            { backgroundColor: colors.surface, borderColor: colors.outline },
          ]}
          onPress={onSecondaryAction}
        >
          <Text
            style={[styles.secondaryButtonText, { color: colors.primaryText }]}
          >
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
    paddingVertical: 12,
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
