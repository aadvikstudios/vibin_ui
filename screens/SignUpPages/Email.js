import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConfirmationModal from '../../components/ConfirmationModal'; // Import the modal component
import { useUser } from '../../context/UserContext';
import { fetchUserProfileUsingEmailAPI } from '../../api';

const Email = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { updateUser } = useUser();
  const [fetchedProfile, setFetchedProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    // Validate email and set error message
    if (!isValidEmail(text)) {
      setErrorMessage('Please enter a valid email address');
    } else {
      setErrorMessage('');
    }
  };

  const handleNext = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const profile = await fetchUserProfileUsingEmailAPI(email);
      console.log(profile);
      setFetchedProfile(profile); // Store fetched profile
      updateUser(profile); // Save profile data in context
      setModalVisible(true); // Show the modal
    } catch (error) {
      if (error.message === 'Profile not found') {
        updateUser('emailId', email);
        navigation.navigate('DOB');
      } else {
        console.error(error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false); // Hide the modal
  };

  const handleModalConfirm = () => {
    setModalVisible(false);
    // updateUser('emailId', email);
    navigation.navigate('MainPage'); // Navigate to the main page
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="Where can we send your confirmation link?"
        subtitle="Enter a real email address. Don’t worry — no one else will see it."
      />
      <View style={styles.content}>
        <TextInput
          label="Email"
          mode="flat"
          value={email}
          onChangeText={handleEmailChange}
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          textColor={colors.primaryText}
          underlineColor={colors.primary}
          theme={{
            colors: {
              placeholder: colors.placeholder,
              text: colors.primaryText,
            },
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/* Display error message */}
        {errorMessage ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errorMessage}
          </Text>
        ) : null}
      </View>
      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={!email || !!errorMessage || loading}
      />
      <ConfirmationModal
        visible={modalVisible}
        title="Email Already Exists"
        message="Do you want to continue?"
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
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
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default Email;
