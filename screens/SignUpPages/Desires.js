import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Chip, useTheme, Button } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import { desireCategories } from '../../data/options'; // Import categorized desires data

const Desires = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();

  const [selectedDesires, setSelectedDesires] = useState([]);

  const toggleDesire = (desire) => {
    if (selectedDesires.includes(desire)) {
      setSelectedDesires((prev) => prev.filter((item) => item !== desire));
    } else if (selectedDesires.length < 10) {
      setSelectedDesires((prev) => [...prev, desire]);
    }
  };

  const handleNext = () => {
    updateUser('desires', selectedDesires);
    console.log('desires', selectedDesires);
    navigation.navigate('Interests'); // Replace with the actual next step route
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="What are your Desires?"
        subtitle="Let people know what you’re into. You can add or edit Desires as often as you want."
        currentStep={6}
      />
      <View style={styles.content}>
        {/* Selected Desires */}
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
          Selected ({selectedDesires.length}/10)
        </Text>
        <View style={styles.selectedContainer}>
          {selectedDesires.map((desire) => (
            <Chip
              key={desire}
              style={[
                styles.chip,
                {
                  backgroundColor: colors.primaryContainer,
                  borderColor: colors.primary,
                },
              ]}
              textStyle={{ color: colors.primary }}
              onClose={() => toggleDesire(desire)}
            >
              {desire}
            </Chip>
          ))}
        </View>

        {/* Desire Categories */}
        <FlatList
          data={desireCategories}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <View>
              <Text style={[styles.categoryTitle, { color: colors.onSurface }]}>
                {item.category}
              </Text>
              <View style={styles.chipContainer}>
                {item.desires.map((desire) => (
                  <Chip
                    key={desire}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selectedDesires.includes(desire)
                          ? colors.primaryContainer
                          : colors.surface,
                        borderColor: selectedDesires.includes(desire)
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                    textStyle={{
                      color: selectedDesires.includes(desire)
                        ? colors.primary
                        : colors.secondaryText,
                    }}
                    onPress={() => toggleDesire(desire)}
                  >
                    {desire}
                  </Chip>
                ))}
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <Footer
        buttonText={selectedDesires.length > 0 ? 'Next' : 'Skip'}
        onPress={handleNext}
        disabled={selectedDesires.length === 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    margin: 4,
    borderWidth: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Desires;
