import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const ChipList = ({ title, items }) => {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
        {title}
      </Text>
      <View style={styles.chipContainer}>
        {items?.map((item, index) => (
          <View
            key={index}
            style={[styles.chip, { borderColor: colors.primaryText }]}
          >
            <Text style={[styles.chipText, { color: colors.primaryText }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    fontSize: 12,
  },
});

export default ChipList;
