import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { TextInput, useTheme, Button } from 'react-native-paper';
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

  const handleDateConfirm = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowPicker(false); // Close picker on Android

    if (selectedDate) {
      const age = calculateAge(selectedDate);
      if (age >= 17) {
        setDob(selectedDate);
        setErrorMessage('');
      } else {
        setErrorMessage('You must be at least 17 years old.');
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
    console.log(
      'dob',
      dob.toISOString().split('T')[0],
      'age',
      calculateAge(dob)
    );

    navigation.navigate('Gender');
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
            <Text style={[styles.ageText, { color: colors.primary }]}>
              I'm {calculateAge(dob)}
            </Text>
          )}
        </View>
        {/* Open Date Picker on Press */}
        <Pressable onPress={() => setShowPicker(true)}>
          <TextInput
            mode="outlined"
            label="Date of Birth"
            value={dob ? dob.toLocaleDateString() : ''}
            editable={false}
            style={[
              styles.input,
              { backgroundColor: colors.surface, borderColor: colors.primary },
            ]}
            right={
              <TextInput.Icon
                icon="calendar"
                onPress={() => setShowPicker(true)}
                color={colors.primary}
              />
            }
          />
        </Pressable>

        {/* ✅ Custom Date Picker */}
        {showPicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={dob || new Date()}
            mode="date"
            display="spinner" // Changes look from blue Material Design to a neutral spinner
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            onChange={handleDateConfirm}
            textColor={colors.primaryText} // ✅ Applies theme color for text
          />
        )}

        {/* ✅ Custom Modal for iOS with Themed Buttons */}
        {Platform.OS === 'ios' && (
          <Modal
            transparent
            animationType="slide"
            visible={showPicker}
            onRequestClose={() => setShowPicker(false)}
          >
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.surface },
                ]}
              >
                <DateTimePicker
                  value={dob || new Date()}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  onChange={handleDateConfirm}
                />
                <View style={styles.buttonRow}>
                  <Button
                    mode="contained"
                    onPress={() => setShowPicker(false)}
                    color={colors.danger}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setShowPicker(false);
                      handleDateConfirm(null, dob);
                    }}
                    color={colors.primary}
                  >
                    Confirm
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default DateOfBirth;
