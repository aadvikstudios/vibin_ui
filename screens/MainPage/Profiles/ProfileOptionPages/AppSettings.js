import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const AppSettings = ({ navigation }) => {
  const { colors } = useTheme();
  const [optOutPing, setOptOutPing] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [showDistances, setShowDistances] = useState(false);

  const settings = [
    {
      title: 'Your login methods',
      items: [
        { label: 'Email', value: 'aadvikstudios@gmail.com', navigateTo: null },
        { label: 'Apple', value: 'Off', navigateTo: null },
        { label: 'Facebook', value: 'Off', navigateTo: null },
      ],
    },
    {
      title: 'Privacy and safety',
      items: [
        {
          label: 'Opt out of Ping + Note',
          description:
            'You will no longer be able to send or receive notes along with Pings.',
          isSwitch: true,
          value: optOutPing,
          onToggle: setOptOutPing,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          label: 'Receive updates from Feeld',
          description: 'Know about experiences, opportunities, and news.',
          isSwitch: true,
          value: receiveUpdates,
          onToggle: setReceiveUpdates,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          label: 'Show distances in miles',
          isSwitch: true,
          value: showDistances,
          onToggle: setShowDistances,
        },
        { label: 'Dark mode', navigateTo: null },
      ],
    },
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          App settings
        </Text>
      </View>
      {settings.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </Text>
          {section.items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionItem}
              onPress={() =>
                item.navigateTo && navigation.navigate(item.navigateTo)
              }
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
                {item.value && !item.isSwitch ? (
                  <Text
                    style={[styles.optionValue, { color: colors.disabled }]}
                  >
                    {item.value}
                  </Text>
                ) : null}
                {item.isSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    thumbColor={item.value ? colors.primary : colors.disabled}
                    trackColor={{
                      true: colors.primary + '66',
                      false: colors.disabled,
                    }}
                  />
                ) : (
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color={colors.text}
                  />
                )}
              </View>
              {item.description && (
                <Text style={[styles.description, { color: colors.disabled }]}>
                  {item.description}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: { fontSize: 16 },
  optionValue: { fontSize: 14, marginRight: 10 },
  description: { fontSize: 12, marginTop: 5 },
});

export default AppSettings;
