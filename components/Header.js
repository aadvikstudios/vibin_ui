import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, IconButton, ProgressBar, useTheme } from 'react-native-paper';

const Header = ({ navigation, title, subtitle, currentStep }) => {
  const { colors } = useTheme();
  const totalSteps = 15;
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <IconButton
          icon="arrow-left"
          size={24}
          color={colors.primary}
          onPress={() => navigation.goBack()}
        />
        {currentStep && totalSteps && (
          <Text style={[styles.stepText, { color: colors.text }]}>
            {currentStep} of {totalSteps}
          </Text>
        )}
      </View>
      {currentStep && totalSteps && (
        <ProgressBar
          progress={currentStep / totalSteps}
          color={colors.primary}
          style={styles.progressBar}
        />
      )}
      <Text style={[styles.title, { color: colors.primaryText }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 14,
    marginLeft: 'auto',
  },
  progressBar: {
    height: 5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
});

export default Header;
