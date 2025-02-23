import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // Import icon library
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';

const Interests = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();
  const [interests, setInterests] = useState('');
  const [interestList, setInterestList] = useState([]);

  const handleAddInterest = () => {
    if (interests.trim() && interestList.length < 10) {
      setInterestList((prev) => [...prev, interests.trim()]);
      setInterests('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterestList((prev) => prev.filter((item) => item !== interest));
  };

  const handleNext = () => {
    updateUser('interests', interestList);
    console.log('Interests:', interestList);
    navigation.navigate('TellUsAboutYou');
  };

  const getHelperText = () => {
    if (interestList.length === 0) {
      return 'Type in an interest and press the plus icon or Enter.';
    } else if (interestList.length < 10) {
      return `You can add up to ${10 - interestList.length} more interests.`;
    } else {
      return 'You’ve added the maximum number of interests.';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="What are your Interests?"
        subtitle="Connections are sparked in and outside the bedroom. Give others a glimpse of your whole self."
        currentStep={7}
      />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.primaryText,
              },
            ]}
            placeholder="e.g., Traveling, Music, Yoga"
            placeholderTextColor={colors.placeholder}
            value={interests}
            onChangeText={setInterests}
            onSubmitEditing={handleAddInterest}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: colors.surface, // White background
                borderColor:
                  interests.trim() && interestList.length < 10
                    ? colors.primary
                    : colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={handleAddInterest}
            disabled={!interests.trim() || interestList.length >= 10}
          >
            <MaterialIcons
              name="add"
              size={24}
              color={
                interests.trim() && interestList.length < 10
                  ? colors.primary
                  : colors.secondary
              }
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.helperText, { color: colors.secondaryText }]}>
          {getHelperText()}
        </Text>

        {/* Display Selected Interests Using Chip Styling */}
        <View style={styles.selectedContainer}>
          {interestList.map((interest, index) => (
            <Chip
              key={index}
              style={[
                styles.chip,
                {
                  backgroundColor: colors.primaryContainer,
                  borderColor: colors.primary,
                },
              ]}
              textStyle={{ color: colors.primary }}
              onClose={() => handleRemoveInterest(interest)}
            >
              {interest}
            </Chip>
          ))}
        </View>
      </View>

      <Footer
        buttonText={interestList.length > 0 ? 'Next' : 'Skip'}
        onPress={handleNext}
        disabled={false}
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
    paddingTop: 20,
  },
  helperText: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    height: 30,
    width: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Interests;
