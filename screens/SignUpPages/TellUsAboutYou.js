import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';

const TellUsAboutYou = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();
  const [bio, setBio] = useState('');
  const [isFocused, setIsFocused] = useState(false); // Track input focus

  const wordCount = bio
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = bio.length;

  const minWords = 10;
  const minChars = 100;
  const isBioValid = wordCount >= minWords && charCount >= minChars;

  // Fun & interactive error messages based on progress
  const getErrorMessage = () => {
    if (wordCount === 0) {
      return `Your bio is empty! Let people know more about you to increase your chances of finding the perfect match.`;
    } else if (wordCount < minWords && charCount < minChars) {
      return `You're off to a great start! Just ${minWords - wordCount} more words and ${minChars - charCount} more characters to go. A well-written bio helps you stand out!`;
    } else if (wordCount < minWords) {
      return `You're getting there! Just ${minWords - wordCount} more words needed. The more details, the better your chances of connecting!`;
    } else if (charCount < minChars) {
      return `Almost there! Add ${minChars - charCount} more characters for a complete bio. A detailed profile attracts more matches!`;
    } else if (
      charCount >= minChars &&
      wordCount >= minWords &&
      charCount < 200
    ) {
      return `Great! You've met the minimum. But adding more personality and interests will boost your match potential!`;
    } else if (charCount >= 200) {
      return `Awesome! Your bio is looking fantastic. The more engaging and unique, the better your connections will be!`;
    }
    return '';
  };

  const handleNext = () => {
    if (!isBioValid) return;

    updateUser('bio', bio);
    console.log('Bio:', bio);
    navigation.navigate('Questionnaire');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="Tell us about you"
        subtitle="Members with bios make 3X more connections."
        currentStep={8}
      />
      <View style={styles.content}>
        <Text style={[styles.counter, { color: colors.secondaryText }]}>
          {`${charCount}/1500`}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.onSurface,
              borderColor: isFocused ? colors.primary : colors.border,
              shadowColor: isFocused ? colors.primary : colors.shadow,
            },
          ]}
          multiline
          placeholder="Fill out your bio (at least 10 words and 100 characters)"
          placeholderTextColor={colors.placeholder}
          value={bio}
          onChangeText={setBio}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Text style={[styles.helperText, { color: colors.secondaryText }]}>
          Beliefs, quirks, and dreams—it all belongs here.
        </Text>
        {!isBioValid || charCount >= 100 ? (
          <Text
            style={[
              styles.errorText,
              { color: charCount < minChars ? colors.danger : colors.success },
            ]}
          >
            {getErrorMessage()}
          </Text>
        ) : null}
      </View>
      <Footer buttonText="Next" onPress={handleNext} disabled={!isBioValid} />
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
  counter: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 10,
  },
  input: {
    height: 120,
    borderWidth: 2, // Make the border more prominent when focused
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  helperText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default TellUsAboutYou;
