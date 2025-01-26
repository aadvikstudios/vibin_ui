import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, RadioButton } from 'react-native-paper';
import Header from '../../components/Header'; // Import your Header component
import Footer from '../../components/Footer'; // Import your Footer component
import { useUser } from '../../context/UserContext'; // Import UserContext to save data globally
import { orientationOptions } from '../../data/options'; // Import options from data file

const Orientation = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();

  const [selectedOrientation, setSelectedOrientation] = useState('');

  const handleNext = () => {
    // Update the UserContext with the selected orientation
    updateUser('orientation', selectedOrientation);
    console.log('selectedOrientation', selectedOrientation);
    // Navigate to the next step
    navigation.navigate('LookingFor'); // Replace with the actual next step route
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.optionContainer,
        {
          borderColor:
            selectedOrientation === item.id ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setSelectedOrientation(item.id)}
    >
      <Text style={[styles.optionText, { color: colors.primaryText }]}>
        {item.label}
      </Text>
      <RadioButton
        value={item.id}
        status={selectedOrientation === item.id ? 'checked' : 'unchecked'}
        onPress={() => setSelectedOrientation(item.id)}
        color={colors.primary}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="Which best describes you?"
        subtitle=""
        currentStep={4}
      />
      <View style={styles.content}>
        <FlatList
          data={orientationOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={!selectedOrientation} // Disable if no option is selected
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
    justifyContent: 'center',
  },
  listContainer: {
    paddingVertical: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Orientation;
