import {
  MD3LightTheme as LightTheme,
  MD3DarkTheme as DarkTheme,
} from 'react-native-paper';

export const PaperThemes = {
  light: {
    ...LightTheme,
    roundness: 10,
    colors: {
      ...LightTheme.colors,

      // Primary Colors
      primary: '#FF4081', // Bright pink primary
      onPrimary: '#FFFFFF', // Text on primary background
      primaryContainer: '#FFD3E4', // Soft pink container
      onPrimaryContainer: '#1C1C1E', // Text on primary container

      // Secondary Colors
      secondary: '#6200EA', // Deep purple secondary
      onSecondary: '#FFFFFF', // Text on secondary background
      secondaryContainer: '#D1C4E9', // Soft purple container
      onSecondaryContainer: '#1C1C1E', // Text on secondary container

      // Background & Surface
      background: '#F9FAFB', // Light gray background
      onBackground: '#1C1C1E', // Text on background
      surface: '#FFFFFF', // White surface
      onSurface: '#4C4C4C', // Text on surface
      surfaceVariant: '#F5F5F5', // Slightly different surface color
      onSurfaceVariant: '#3A3A3A', // Text on surface variant

      // Borders & Separators
      border: '#E0E0E0', // Light border color
      outline: '#BDBDBD', // Outline elements
      divider: '#E5E5E5', // Divider color

      // Text & Labels
      primaryText: '#1C1C1E', // Dark text for contrast
      secondaryText: '#4C4C4C', // Soft gray for secondary text
      tertiaryText: '#757575', // Lighter tertiary text
      disabled: '#E5E5E5', // Disabled elements
      placeholder: '#9E9E9E', // Placeholder text

      // Buttons & Actions
      liked: '#FF4081', // Pink for Like
      onLiked: '#FFFFFF', // White text/icon on Like button
      disliked: '#E0E0E0', // Soft Gray for Dislike Button
      onDisliked: '#1C1C1E', // Darker text/icon on soft gray

      // Status Colors
      success: '#28A745', // Green for success
      onSuccess: '#FFFFFF', // White text on success background
      warning: '#FFC107', // Amber for warning
      onWarning: '#1C1C1E', // Dark text on warning
      danger: '#DC3545', // Red for errors
      onDanger: '#FFFFFF', // White text on danger

      // Notification Colors
      notification: '#FF4081', // Notification color
    },
    fonts: {
      ...LightTheme.fonts,
      displayLarge: {
        fontFamily: 'Roboto-Bold',
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0.5,
      },
      displayMedium: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0.15,
      },
      displaySmall: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0.1,
      },
    },
  },
  dark: {
    ...DarkTheme,
    roundness: 10,
    colors: {
      ...DarkTheme.colors,

      // Primary Colors
      primary: '#FF4081', // Same pink for dark mode
      onPrimary: '#FFFFFF', // White text on primary
      primaryContainer: '#3A1F33', // Darker pink container
      onPrimaryContainer: '#EAEAEA', // Light text on primary container

      // Secondary Colors
      secondary: '#BB86FC', // Light purple for dark mode
      onSecondary: '#1C1C1E', // Text on secondary background
      secondaryContainer: '#3700B3', // Darker purple container
      onSecondaryContainer: '#EAEAEA', // Light text on secondary container

      // Background & Surface
      background: '#121212', // Deep black background
      onBackground: '#EAEAEA', // Light text for contrast
      surface: '#1E1E1E', // Dark gray surface
      onSurface: '#CCCCCC', // Light text on surface
      surfaceVariant: '#2C2C2C', // Slightly different surface color
      onSurfaceVariant: '#BDBDBD', // Text on surface variant

      // Borders & Separators
      border: '#444444', // Darker border
      outline: '#666666', // Outline elements
      divider: '#777777', // Divider color

      // Text & Labels
      primaryText: '#EAEAEA', // Light text for contrast
      secondaryText: '#CCCCCC', // Softer gray for secondary text
      tertiaryText: '#A6A6A6', // Lighter tertiary text
      disabled: '#6E6E6E', // Disabled elements
      placeholder: '#A6A6A6', // Placeholder text

      // Buttons & Actions
      liked: '#FF4081', // Same pink for like
      onLiked: '#FFFFFF', // White text/icon on Like button
      disliked: '#777777', // Darker Soft Gray for Dislike Button
      onDisliked: '#FFFFFF', // White text/icon on dark gray

      // Status Colors
      success: '#28A745', // Success green
      onSuccess: '#FFFFFF', // White text on success
      warning: '#FFC107', // Warning amber
      onWarning: '#121212', // Dark text on warning
      danger: '#DC3545', // Error red
      onDanger: '#FFFFFF', // White text on danger

      // Notification Colors
      notification: '#FF4081', // Notification color
    },
    fonts: {
      ...DarkTheme.fonts,
      displayLarge: {
        fontFamily: 'Roboto-Bold',
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0.5,
      },
      displayMedium: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0.15,
      },
      displaySmall: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0.1,
      },
    },
  },
};
