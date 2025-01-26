import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import Header from '../../components/Header'; // Import your Header component
import Footer from '../../components/Footer'; // Import your Footer component
import { useUser } from '../../context/UserContext'; // Import UserContext to save data globally

const Name = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();

  const [name, setName] = useState('');

  const handleNext = () => {
    // Update the UserContext with the entered name
    updateUser('name', name);
    console.log('name is ', name);
    // Navigate to the next step
    navigation.navigate('Gender'); // Replace with the actual next step route
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="What shall we call you?"
        subtitle=""
        currentStep={2}
      />
      <View style={styles.content}>
        <TextInput
          label="Name"
          mode="flat"
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.primaryText,
            },
          ]}
          textColor={colors.primaryText}
          underlineColor={colors.primary}
          placeholder="Enter your name"
          placeholderTextColor={colors.placeholder}
        />
      </View>
      <Footer buttonText="Next" onPress={handleNext} disabled={!name.trim()} />
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
  input: {
    paddingVertical: 12,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default Name;
