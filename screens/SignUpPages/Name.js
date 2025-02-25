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
  const { userData, updateUser } = useUser();

  // Extract gender from user context
  const gender = userData?.gender || 'Male'; // Default to 'Male' if not set

  // Generate a random user handle on mount based on gender
  const { username: initialUsername, userhandle: initialUserHandle } =
    generateUserHandle(gender);

  // State variables
  const [name, setName] = useState(userData?.name || '');
  const [username, setUsername] = useState(initialUsername); // Stores original capitalization
  const [userhandle, setUserHandle] = useState(initialUserHandle); // Stores lowercase for validation
  const [userhandleAvailable, setUserHandleAvailable] = useState(null); // Null means unchecked
  const [hideName, setHideName] = useState(userData?.hideName || false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Validate preloaded userhandle on page load
  useEffect(() => {
    const validatePreloadedUserhandle = async () => {
      if (userhandle.trim()) {
        await checkUserHandleAvailability(userhandle);
      }
    };
    validatePreloadedUserhandle();
  }, []); // Runs once when component mounts

  // Function to check userhandle availability via API
  const checkUserHandleAvailability = async (handle) => {
    if (!handle.trim()) return;

    setCheckingAvailability(true);
    const result = await checkUserHandleAPI(handle.toLowerCase()); // Check lowercase handle
    setUserHandleAvailable(result.available);
    setCheckingAvailability(false);

    if (!result.available) {
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

    if (userhandleAvailable === false) {
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
            setUserHandleAvailable(null); // Reset availability until checked
          }}
          onBlur={() => checkUserHandleAvailability(userhandle)}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.primaryText}
          underlineColor={colors.primary}
          left={<TextInput.Affix text="@" />}
          right={
            checkingAvailability ? (
              <ActivityIndicator animating={true} size="small" />
            ) : (
              userhandleAvailable !== null && (
                <TextInput.Icon
                  icon={userhandleAvailable ? 'check-circle' : 'close-circle'}
                  color={userhandleAvailable ? 'green' : 'red'}
                />
              )
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
        disabled={
          !userhandle.trim() || userhandleAvailable === false || !name.trim()
        }
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
