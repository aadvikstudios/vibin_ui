import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BlockReportButton = () => (
  <View style={styles.textContainer}>
    <TouchableOpacity style={styles.button}>
      <Ionicons name="flag-outline" size={18} color="red" />
      <Text style={styles.text}>Block or Report</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  textContainer: {
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  text: {
    fontSize: 14,
    color: 'red',
    marginLeft: 5,
  },
});

export default BlockReportButton;
