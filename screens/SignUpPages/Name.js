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
import { checkUserHandleAPI } from '../../api'; // Import API function

// Function to generate a fun, random user handle
const generateUserHandle = () => {
  const handleList = [
    'FlirtyFox99',
    'LoveMagnet',
    'KinkMaster',
    'RomanticRider',
    'CupidArrow',
    'Phoenix121',
    'LetsFlirt',
    'MysticLover',
    'HeartThrob88',
    'SoulmateHunter',
  ];
  return handleList[Math.floor(Math.random() * handleList.length)];
};

const Name = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();

  // State variables
  const [name, setName] = useState('');
  const [userhandle, setUserHandle] = useState(generateUserHandle());
  const [userhandleAvailable, setUserHandleAvailable] = useState(true);
  const [hideName, setHideName] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    setUserHandle(generateUserHandle()); // Generate a random handle when the screen loads
  }, []);

  // Function to check user handle availability via API
  const checkUserHandleAvailability = async () => {
    if (!userhandle.trim()) return;

    setCheckingAvailability(true);
    const isAvailable = await checkUserHandleAPI(userhandle.trim());
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

    // Save user data globally
    updateUser('name', name);
    updateUser('userhandle', userhandle);
    updateUser('hideName', hideName);

    // Navigate to next step
    navigation.navigate('Gender');
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
          value={userhandle}
          onChangeText={(text) => {
            setUserHandle(text);
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
                icon="check-circle"
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

        {/* Name Input - Optional */}
        <TextInput
          label="Real Name (Optional)"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.primaryText}
          underlineColor={colors.primary}
        />

        {/* Toggle Switch to Hide Real Name */}
        <View style={styles.switchContainer}>
          <Switch
            value={hideName}
            onValueChange={() => setHideName(!hideName)}
            color={colors.accentPrimary}
          />
          <Text style={[styles.switchLabel, { color: colors.primaryText }]}>
            Hide my real name
          </Text>
        </View>
      </View>

      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={!userhandle.trim() || !userhandleAvailable}
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
