import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  TextInput,
  Switch,
  useTheme,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import { checkUserHandleAPI } from '../../api'; // Adjust path if needed
import { generateUserHandle } from '../../utils/generateUserHandle'; // Import from utils

const Name = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser, user } = useUser(); // Fetch user data, including gender

  // Extract gender from user context
  const gender = user?.gender || 'Male'; // Default to 'Male' if not set

  // Generate a random user handle on mount based on gender
  const { username: initialUsername, userhandle: initialUserHandle } =
    generateUserHandle(gender);

  // State variables
  const [name, setName] = useState('');
  const [username, setUsername] = useState(initialUsername); // Stores the original capitalization
  const [userhandle, setUserHandle] = useState(initialUserHandle); // Stores lowercase version for validation
  const [userhandleAvailable, setUserHandleAvailable] = useState(true);
  const [hideName, setHideName] = useState(false); // Controls whether name is visible on other pages
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const { username, userhandle } = generateUserHandle(gender);
    setUsername(username);
    setUserHandle(userhandle);
  }, [gender]); // Re-run when gender changes

  // Function to check userhandle availability via API
  const checkUserHandleAvailability = async () => {
    if (!userhandle.trim()) return;

    setCheckingAvailability(true);
    const isAvailable = await checkUserHandleAPI(userhandle); // Check lowercase handle
    setUserHandleAvailable(isAvailable);
    setCheckingAvailability(false);

    if (!isAvailable) {
      setErrorMessage('Oops! This handle is already taken. Try another.');
    } else {
      setErrorMessage('');
    }
  };

  const handleNext = () => {
    if (!userhandle.trim()) {
      setErrorMessage('User handle is required.');
      return;
    }

    if (!userhandleAvailable) {
      setErrorMessage('Please choose a unique user handle.');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Name is required.');
      return;
    }

    // Save user data globally
    updateUser('name', name);
    updateUser('username', username); // Store display name
    updateUser('userhandle', userhandle); // Store lowercase handle
    updateUser('hideName', hideName); // Used to decide visibility on other pages

    // Navigate to next step
    navigation.navigate('Orientation');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="Your Identity"
        subtitle="Choose how you'd like to be known."
        currentStep={2}
      />

      <View style={styles.content}>
        {/* User Handle Input - Mandatory */}
        <TextInput
          label="User Handle (Public)"
          mode="outlined"
          value={username} // Display name
          onChangeText={(text) => {
            setUsername(text); // Store original casing
            setUserHandle(text.toLowerCase()); // Store lowercase for validation
            setUserHandleAvailable(true); // Reset availability until checked
          }}
          onBlur={checkUserHandleAvailability}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.primaryText}
          underlineColor={colors.primary}
          left={<TextInput.Affix text="@" />}
          right={
            checkingAvailability ? (
              <ActivityIndicator animating={true} size="small" />
            ) : (
              <TextInput.Icon
                icon={userhandleAvailable ? 'check-circle' : 'close-circle'}
                color={userhandleAvailable ? 'green' : 'red'}
              />
            )
          }
        />

        {/* Compact Info Text about User Handle */}
        <Text style={[styles.infoText, { color: colors.secondaryText }]}>
          Your user handle is public and helps you connect with others. You can
          use your real name or stay anonymous.
        </Text>
        <HelperText type="error" visible={!!errorMessage}>
          {errorMessage}
        </HelperText>
      </View>

      <View style={styles.content}>
        {/* Name Input - Required */}
        <TextInput
          label="Your Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.primaryText}
          underlineColor={colors.primary}
        />

        {/* Toggle Switch to Hide Name on Other Pages */}
        <View style={styles.switchContainer}>
          <Switch
            value={hideName}
            onValueChange={() => setHideName(!hideName)}
            color={colors.accentPrimary}
          />
          <Text style={[styles.switchLabel, { color: colors.primaryText }]}>
            {hideName
              ? "Don't show my real name to others"
              : 'Show my real name to others'}
          </Text>
        </View>
      </View>

      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={!userhandle.trim() || !userhandleAvailable || !name.trim()}
      />
    </View>
  );
};

// Styles
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
    marginBottom: 8,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  switchLabel: {
    fontSize: 14,
    marginLeft: 6,
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Name;
