import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { useTheme, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';

const calculateAge = (dob) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : null;
};

const DateOfBirth = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();

  const [dob, setDob] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const validateDOB = (selectedDate) => {
    if (!selectedDate) return false;

    const age = calculateAge(selectedDate);
    if (age === null || age < 17) {
      setErrorMessage('You must be at least 17 years old.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      if (validateDOB(selectedDate)) {
        setDob(selectedDate);
      }
    }
  };

  const handleNext = () => {
    if (!dob) {
      setErrorMessage('Please select your date of birth.');
      return;
    }

    updateUser('dob', dob.toISOString().split('T')[0]);
    updateUser('age', calculateAge(dob));

    navigation.navigate('Name');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="What is your date of birth?"
        subtitle="You must be 17+ to explore Vibin. Your age will appear on your profile. Your date of birth will remain private."
        currentStep={1}
      />

      <View style={styles.content}>
        <View style={styles.ageContent}>
          {dob && (
            <Text style={[styles.ageText, { color: colors.primaryText }]}>
              I'm {calculateAge(dob)}
            </Text>
          )}
        </View>

        <Pressable onPress={() => setShowPicker(true)}>
          <TextInput
            mode="outlined"
            label="Date of Birth"
            value={dob ? dob.toLocaleDateString() : ''}
            editable={false}
            style={[
              styles.input,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            right={
              <TextInput.Icon
                icon="calendar"
                onPress={() => setShowPicker(true)}
              />
            }
          />
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={dob || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            onChange={handleDateChange}
          />
        )}

        {errorMessage ? (
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {errorMessage}
          </Text>
        ) : null}
      </View>

      <Footer buttonText="Next" onPress={handleNext} disabled={!dob} />
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
  ageContent: {
    alignItems: 'center',
  },
  ageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: { fontSize: 14, marginBottom: 10 },
  input: {
    width: '100%',
    fontSize: 18,
  },
  errorText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DateOfBirth;
