import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../../../../context/UserContext';

const SearchSettings = ({ navigation }) => {
  const { colors } = useTheme();
  const { userData, updateUser } = useUser();

  // States
  const [maxDistance, setMaxDistance] = useState(50);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [recentlyOnline, setRecentlyOnline] = useState(false);
  const [lookingFor, setLookingFor] = useState(3);
  const [filterByDesires, setFilterByDesires] = useState('Any');

  // Handlers
  const handleNavigate = (screen) => {
    if (screen) {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color={colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Search settings
        </Text>
      </View>

      {/* Maximum Distance */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          Maximum distance
        </Text>
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderValue, { color: colors.text }]}>
            {maxDistance} km
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={maxDistance}
            onSlidingComplete={(value) => setMaxDistance(value)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.disabled}
          />
        </View>
      </View>

      {/* Age Range */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          Age range
        </Text>
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderValue, { color: colors.text }]}>
            {ageRange[0]} - {ageRange[1]} and older
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={100}
            step={1}
            value={ageRange[0]}
            onSlidingComplete={(value) => setAgeRange([value, ageRange[1]])}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.disabled}
          />
          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={100}
            step={1}
            value={ageRange[1]}
            onSlidingComplete={(value) => setAgeRange([ageRange[0], value])}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.disabled}
          />
        </View>
      </View>

      {/* Looking For */}
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleNavigate('LookingForScreen')}
      >
        <Text style={[styles.optionLabel, { color: colors.text }]}>
          Looking for
        </Text>
        <Text style={[styles.optionValue, { color: colors.disabled }]}>
          {lookingFor} selected
        </Text>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={colors.text}
        />
      </TouchableOpacity>

      {/* Filter by Desires */}
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleNavigate('FilterByDesiresScreen')}
      >
        <Text style={[styles.optionLabel, { color: colors.text }]}>
          Filter by Desires
        </Text>
        <Text style={[styles.optionValue, { color: colors.disabled }]}>
          {filterByDesires}
        </Text>
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={colors.text}
        />
      </TouchableOpacity>

      {/* Recently Online */}
      <View style={styles.optionItem}>
        <Text style={[styles.optionLabel, { color: colors.text }]}>
          Recently online
        </Text>
        <Switch
          value={recentlyOnline}
          onValueChange={(value) => setRecentlyOnline(value)}
          thumbColor={recentlyOnline ? colors.primary : colors.disabled}
          trackColor={{
            true: colors.primary + '66',
            false: colors.disabled,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 14,
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionLabel: {
    fontSize: 16,
  },
  optionValue: {
    fontSize: 14,
    marginRight: 10,
  },
});

export default SearchSettings;
