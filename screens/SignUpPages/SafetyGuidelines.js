import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext'; // Import the UserContext hook
import { createUserProfileAPI } from '../../api'; // Import the API function

const SafetyGuidelines = ({ navigation }) => {
  const { colors } = useTheme();
  const { userData, updateUser } = useUser(); // Access user data from the context
  const [isBottomReached, setIsBottomReached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle button state

  useEffect(() => {
    console.log('Current User Data:', userData); // Log user data when the component mounts
  }, [userData]);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    setIsBottomReached(isAtBottom);
  };

  const handleContinue = async () => {
    setIsSubmitting(true); // Disable the button while the API call is in progress
    try {
      console.log('Sending user data to API:', userData);
      const response = await createUserProfileAPI(userData); // Call the API with userData
      console.log('Profile created successfully:', response);
      if (response && response.profile) {
        updateUser(response.profile);
      }

      navigation.navigate('MainPage'); // Navigate to the MainPage after success
    } catch (error) {
      console.error('Failed to create profile:', error.message);
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header navigation={navigation} title="Safety guidelines" subtitle="" />
      <ScrollView
        style={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.animatedIcon}>🌍</Text>
        </View>
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Safety guidelines
        </Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          Together we can build a safer and more inclusive community. If you
          want to let us know about a safety issue, tap on the Report button or
          contact Support.
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Active consent
        </Text>
        <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
          Both online and offline, active consent is a cornerstone. Consent is a
          “yes,” freely given, without coercion, manipulation, or while
          incapacitated. It is a “yes,” made intentionally, by a person who is
          informed about what will and will not happen in an exchange. It’s a
          “yes” that can be retracted at any time.
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Inclusive
        </Text>
        <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
          Feeld is a place for all humans to feel safe exploring their desires.
          In this space, we approach each other with openness, curiosity, and
          respect—regardless of difference. Feeling seen and respected is a
          fundamental human need.
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Private
        </Text>
        <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
          Revealing ourselves to others is deeply personal. Sometimes we feel
          comfortable sharing, and sometimes we don’t. Each of us gets to decide
          how, when, and with whom we share ourselves.
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Authentic
        </Text>
        <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
          We are who we say we are. Fake member profiles, catfishing, and other
          misrepresentations of identity are not allowed.
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          Safer
        </Text>
        <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
          If someone makes you feel unsafe on Feeld, please report any
          harassment, abuse, threats, discriminatory behavior, or misconduct
          that you witness or experience.
        </Text>
        {/* Add spacer to ensure no overlapping */}
        <View style={styles.spacer} />
      </ScrollView>
      {/* Footer is placed outside of ScrollView */}
      {isBottomReached && (
        <Footer
          buttonText="Continue"
          onPress={handleContinue}
          disabled={isSubmitting} // Disable the button while API call is in progress
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  animatedIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  sectionText: {
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  spacer: {
    height: 100, // Ensure content does not overlap with the Footer
  },
});

export default SafetyGuidelines;
