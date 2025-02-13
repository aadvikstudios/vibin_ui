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

  const handleNext = () => {
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
          {`${bio.length}/1500`}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          multiline
          placeholder="Fill out your bio"
          placeholderTextColor={colors.placeholder}
          value={bio}
          onChangeText={setBio}
        />
        <Text style={[styles.helperText, { color: colors.placeholder }]}>
          Beliefs and quirks—it all belongs here.
        </Text>
      </View>
      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={bio.length === 0}
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
  counter: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 10,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  helperText: {
    fontSize: 14,
  },
});

export default TellUsAboutYou;
