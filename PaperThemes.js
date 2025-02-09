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
      primary: '#FF5858', // Vibrant red for primary actions
      primaryContainer: '#FFE5E5', // Soft red tint
      accent: '#FF7575', // Secondary red accent
      background: '#F9FAFB', // Subtle light gray for the background
      surface: '#FFFFFF', // White surface
      primaryText: '#1C1C1E', // Dark gray for primary text
      secondaryText: '#4C4C4C', // Subtle gray for secondary text
      text: '#1C1C1E', // Default text color (same as primaryText)
      onPrimary: '#FFFFFF', // Text on primary background
      disabled: '#E5E5E5', // Light gray for disabled elements
      placeholder: '#9E9E9E', // Neutral placeholder text
      border: '#E0E0E0', // Subtle light gray borders
      notification: '#FF5858', // Notification color
      onSurface: '#4C4C4C', // Secondary text on surfaces

      // Success (Green)
      success: '#28A745', // Success color
      onSuccess: '#FFFFFF', // Text on success background

      // Warning (Orange)
      warning: '#FFC107', // Warning color (amber)
      onWarning: '#1C1C1E', // Dark text on warning background

      // Danger / Error (Red)
      danger: '#DC3545', // Danger color (strong red)
      onDanger: '#FFFFFF', // Text on danger background
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
      primary: '#FF5858', // Vibrant red for primary actions
      primaryContainer: '#442C2C', // Dark red for containers
      accent: '#FF8C8C', // Secondary red accent
      background: '#121212', // Deep black background
      surface: '#1E1E1E', // Dark surface color
      primaryText: '#EAEAEA', // Light gray for primary text
      secondaryText: '#CCCCCC', // Softer gray for secondary text
      text: '#EAEAEA', // Default text color (same as primaryText)
      onPrimary: '#FFFFFF', // White text on primary background
      disabled: '#6E6E6E', // Neutral disabled elements
      placeholder: '#A6A6A6', // Neutral placeholder text
      border: '#444444', // Dark border
      notification: '#FF5858', // Notification color
      onSurface: '#CCCCCC', // Light text on surfaces

      // Success (Green)
      success: '#28A745', // Success color
      onSuccess: '#FFFFFF', // Text on success background

      // Warning (Orange)
      warning: '#FFC107', // Warning color (amber)
      onWarning: '#121212', // Dark text on warning background

      // Danger / Error (Red)
      danger: '#DC3545', // Danger color (strong red)
      onDanger: '#FFFFFF', // Text on danger background
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
