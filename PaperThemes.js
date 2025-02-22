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
      primary: '#FF4081', // Bright pink primary
      primaryContainer: '#FFD3E4', // Soft pink container
      accent: '#FF85B3', // Complementary accent color
      background: '#F9FAFB', // Light gray background
      surface: '#FFFFFF', // White surface
      primaryText: '#1C1C1E', // Dark text for contrast
      secondaryText: '#4C4C4C', // Soft gray for secondary text
      text: '#1C1C1E', // Default text color
      onPrimary: '#FFFFFF', // White text on primary
      disabled: '#E5E5E5', // Disabled elements
      placeholder: '#9E9E9E', // Placeholder text
      border: '#E0E0E0', // Light border color
      notification: '#FF4081', // Notification color
      onSurface: '#4C4C4C', // Text on surfaces

      // Buttons & Action Colors
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
      primary: '#FF4081', // Same pink for dark mode
      primaryContainer: '#3A1F33', // Darker pink container
      accent: '#FF85B3', // Lighter pink accent
      background: '#121212', // Deep black background
      surface: '#1E1E1E', // Dark gray surface
      primaryText: '#EAEAEA', // Light text for contrast
      secondaryText: '#CCCCCC', // Softer gray for secondary text
      text: '#EAEAEA', // Default text color
      onPrimary: '#FFFFFF', // White text on primary
      disabled: '#6E6E6E', // Disabled elements
      placeholder: '#A6A6A6', // Placeholder text
      border: '#444444', // Darker border
      notification: '#FF4081', // Notification color
      onSurface: '#CCCCCC', // Light text on surfaces

      // Buttons & Action Colors
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
