import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, Alert, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';

const calculateAge = (dob) => {
  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();

  // Adjust age if the current month/day is before the DOB month/day
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dobDate.getDate())
  ) {
    age--;
  }

  return age;
};

const DateOfBirth = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Refs for controlling input focus
  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  const validateDOB = () => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      setErrorMessage('Day must be between 1 and 31.');
      return false;
    }

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      setErrorMessage('Month must be between 1 and 12.');
      return false;
    }

    if (
      isNaN(yearNum) ||
      yearNum < 1900 ||
      yearNum > new Date().getFullYear()
    ) {
      setErrorMessage(
        `Year must be between 1900 and ${new Date().getFullYear()}.`
      );
      return false;
    }

    const dob = `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum
      .toString()
      .padStart(2, '0')}`;
    const today = new Date();
    const dobDate = new Date(dob);

    if (dobDate > today) {
      setErrorMessage('Date of birth cannot be in the future.');
      return false;
    }

    const age = calculateAge(dob);
    if (age < 17) {
      setErrorMessage('You must be at least 17 years old.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleNext = () => {
    if (!validateDOB()) {
      return;
    }

    const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const age = calculateAge(dob);

    updateUser('dob', dob);
    updateUser('age', age);

    console.log('DOB:', dob);
    console.log('Age:', age);

    navigation.navigate('Name'); // Replace with the actual next step route
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
        <View style={styles.inputGroup}>
          {/* Day Input */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.primaryText,
              },
            ]}
            placeholder="Day"
            placeholderTextColor={colors.placeholder}
            value={day}
            onChangeText={(text) => {
              const formattedText = text.replace(/[^0-9]/g, '').slice(0, 2);
              setDay(formattedText);

              if (formattedText.length === 2) {
                monthInputRef.current.focus(); // Move focus to month input
              }
            }}
            keyboardType="number-pad"
          />

          {/* Month Input */}
          <TextInput
            ref={monthInputRef} // Attach ref to month input
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.primaryText,
              },
            ]}
            placeholder="Month"
            placeholderTextColor={colors.placeholder}
            value={month}
            onChangeText={(text) => {
              const formattedText = text.replace(/[^0-9]/g, '').slice(0, 2);
              setMonth(formattedText);

              if (formattedText.length === 2) {
                yearInputRef.current.focus(); // Move focus to year input
              }
            }}
            keyboardType="number-pad"
          />

          {/* Year Input */}
          <TextInput
            ref={yearInputRef} // Attach ref to year input
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.primaryText,
              },
            ]}
            placeholder="Year"
            placeholderTextColor={colors.placeholder}
            value={year}
            onChangeText={(text) => {
              setYear(text.replace(/[^0-9]/g, '').slice(0, 4));
            }}
            keyboardType="number-pad"
          />
        </View>
        {/* Error Message */}
        {errorMessage ? (
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {errorMessage}
          </Text>
        ) : null}
      </View>
      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={!(day && month && year)} // Disable if any field is empty
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
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DateOfBirth;
