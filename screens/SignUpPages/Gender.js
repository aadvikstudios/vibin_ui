import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, RadioButton } from 'react-native-paper';
import Header from '../../components/Header'; // Import your Header component
import Footer from '../../components/Footer'; // Import your Footer component
import { useUser } from '../../context/UserContext'; // Import UserContext to save data globally
import { genderOptions } from '../../data/options'; // Import options from data file

const Gender = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();

  const [selectedGender, setSelectedGender] = useState('');

  const handleNext = () => {
    // Update the UserContext with the selected gender
    updateUser('gender', selectedGender);
    console.log('Gender', selectedGender);
    navigation.navigate('Orientation');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.optionContainer,
        {
          borderColor:
            selectedGender === item.id ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setSelectedGender(item.id)}
    >
      <Text style={[styles.optionText, { color: colors.primaryText }]}>
        {item.label}
      </Text>
      <RadioButton
        value={item.id}
        status={selectedGender === item.id ? 'checked' : 'unchecked'}
        onPress={() => setSelectedGender(item.id)}
        color={colors.primary}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="Select your gender"
        subtitle=""
        currentStep={3}
      />
      <View style={styles.content}>
        <FlatList
          data={genderOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={!selectedGender} // Disable if no option is selected
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

export default Gender;
