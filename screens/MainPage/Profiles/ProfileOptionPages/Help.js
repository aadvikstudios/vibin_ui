import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const Help = ({ navigation }) => {
  const { colors } = useTheme();

  const helpItems = [
    { label: 'Contact support', external: true },
    { label: 'Help Center', external: true },
    { label: 'Cancel membership & refunds', external: true },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color={colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help</Text>
      </View>
      {helpItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.optionItem}>
          <Text style={[styles.optionLabel, { color: colors.text }]}>
            {item.label}
          </Text>
          {item.external && (
            <Ionicons name="open-outline" size={20} color={colors.text} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionLabel: { fontSize: 16 },
});

export default Help;