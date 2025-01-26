import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
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
                  : colors.textDisabled
              }
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.helperText, { color: colors.secondaryText }]}>
          {getHelperText()}
        </Text>
        <View style={styles.tagContainer}>
          {interestList.map((interest, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: colors.primaryContainer }]}
            >
              <Text style={[styles.tagText, { color: colors.primary }]}>
                {interest}
              </Text>
              <Text
                style={[styles.removeTag, { color: colors.primary }]}
                onPress={() => handleRemoveInterest(interest)}
              >
                ✕
              </Text>
            </View>
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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    marginRight: 10,
  },
  removeTag: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Interests;
