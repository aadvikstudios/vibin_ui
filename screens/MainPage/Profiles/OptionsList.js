import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const options = [
  {
    label: 'Edit profile',
    icon: 'pencil-outline',
    onPress: (navigation) => navigation.navigate('EditProfile'),
  },
  {
    label: 'Search settings',
    icon: 'settings-outline',
    onPress: (navigation) => navigation.navigate('SearchSettings'),
  },
  {
    label: 'App settings',
    icon: 'cog-outline',
    onPress: (navigation) => navigation.navigate('AppSettings'),
  },
  {
    label: 'Share my profile',
    icon: 'share-social-outline',
    onPress: () => {},
  },
  { label: 'Magazine', icon: 'book-outline', onPress: () => {} },
  {
    label: 'Our community',
    icon: 'people',
    onPress: (navigation) => navigation.navigate('OurCommunity'),
  },
  { label: 'About', icon: 'information-outline', onPress: () => {} },
  {
    label: 'Help',
    icon: 'help-circle-outline',
    onPress: (navigation) => navigation.navigate('Help'),
  },
];

const OptionsList = ({ navigation }) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.optionsContainer, { borderColor: colors.border }]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.optionItem, { borderBottomColor: colors.outline }]}
          onPress={() => (option.onPress ? option.onPress(navigation) : null)}
        >
          <View style={styles.optionContent}>
            {/* Icon */}
            <Ionicons
              name={option.icon}
              size={22}
              color={colors.primaryText}
              style={styles.optionIcon}
            />
            {/* Label */}
            <Text
              style={[
                styles.optionText,
                { color: colors.primaryText, ...fonts.displaySmall },
              ]}
            >
              {option.label}
            </Text>
          </View>
          {/* Chevron */}
          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.secondaryText}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
  },
});

export default OptionsList;
