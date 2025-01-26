import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const Footer = ({ buttonText, onPress, disabled }) => {
  const { colors } = useTheme();

  const isSkip = buttonText.toLowerCase() === 'skip';

  return (
    <Button
      mode="contained"
      onPress={isSkip ? onPress : disabled ? null : onPress} // Allow onPress for "Skip", block for other disabled buttons
      style={[
        styles.footerButton,
        {
          backgroundColor: isSkip
            ? colors.disabled // Visually make "Skip" look disabled
            : disabled
              ? colors.disabled
              : colors.primary,
        },
      ]}
      disabled={!isSkip && disabled} // Disable button for other cases except "Skip"
      labelStyle={{
        color: isSkip || disabled ? colors.textSecondary : colors.onPrimary,
      }}
    >
      {buttonText}
    </Button>
  );
};

const styles = StyleSheet.create({
  footerButton: {
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default Footer;
