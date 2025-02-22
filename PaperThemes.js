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
      primary: '#F7529E', // Updated primary color (Pink)
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
      notification: '#F7529E', // Notification color
      onSurface: '#4C4C4C', // Text on surfaces
      // action buttons
      liked: '#F7529E', // Pink for Like
      onDisliked: '#FFFFFF', // Text/icon on Like button
      disliked: '#E0E0E0', // **Soft Gray for Dislike Button**
      onDisliked: '#1C1C1E', // Darker text/icon on soft gray

      // Success (Green)
      success: '#28A745', // Success green
      onSuccess: '#FFFFFF', // Text on success background

      // Warning (Orange)
      warning: '#FFC107', // Warning amber
      onWarning: '#1C1C1E', // Dark text on warning

      // Danger / Error (Red)
      danger: '#DC3545', // Error red
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
      primary: '#F7529E', // Updated primary color for dark mode
      primaryContainer: '#3A1F33', // Dark pink container
      accent: '#FF85B3', // Light pink accent
      background: '#121212', // Deep black background
      surface: '#1E1E1E', // Dark surface color
      primaryText: '#EAEAEA', // Light text for contrast
      secondaryText: '#CCCCCC', // Softer gray for secondary text
      text: '#EAEAEA', // Default text color
      onPrimary: '#FFFFFF', // White text on primary
      disabled: '#6E6E6E', // Disabled elements
      placeholder: '#A6A6A6', // Placeholder text
      border: '#444444', // Dark border
      notification: '#F7529E', // Notification color
      onSurface: '#CCCCCC', // Light text on surfaces

      // action buttons
      disliked: '#777777', // **Darker Soft Gray for Dislike Button**
      onDisliked: '#FFFFFF', // White text/icon on dark gray
      liked: '#B71C1C', // Darker red for Dislike
      onLiked: '#FFFFFF', // Text/icon on Dislike button
      // Success (Green)
      success: '#28A745', // Success green
      onSuccess: '#FFFFFF', // Text on success background

      // Warning (Orange)
      warning: '#FFC107', // Warning amber
      onWarning: '#121212', // Dark text on warning

      // Danger / Error (Red)
      danger: '#DC3545', // Error red
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
