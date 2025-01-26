import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NoProfilesView = ({
  onEditSettings,
  onClearFilters,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Text style={styles.title}>{title || 'It’s quiet around here'}</Text>
      <Text style={styles.subtitle}>
        {subtitle ||
          'To find more people near you, update your search settings.'}
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onEditSettings}>
        <Text style={styles.primaryButtonText}>Edit search settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onClearFilters}>
        <Text style={styles.secondaryButtonText}>Clear filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#000',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  secondaryButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NoProfilesView;
