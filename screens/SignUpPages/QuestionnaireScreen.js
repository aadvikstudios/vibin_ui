import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import questionsData from '../../data/questions.json'; // Import JSON file

const QuestionnaireScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Load questions from JSON
    setQuestions(questionsData.questionnaire);

    // Initialize responses object dynamically
    const initialResponses = questionsData.questionnaire.reduce((acc, item) => {
      acc[item.key] = '';
      return acc;
    }, {});
    setResponses(initialResponses);
  }, []);

  const handleChange = (key, value) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    updateUser('questionnaire', responses);
    console.log('Responses:', responses);
    navigation.navigate('AddPhotos');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="Let's Get to Know You"
        subtitle="Answer these fun questions to express yourself."
        currentStep={9} // Update step if needed
      />
      <ScrollView contentContainerStyle={styles.content}>
        {questions.map((item, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={[styles.question, { color: colors.text }]}>
              {item.question}
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
              placeholder={item.placeholder}
              placeholderTextColor={colors.placeholder}
              value={responses[item.key]}
              onChangeText={(text) => handleChange(item.key, text)}
            />
          </View>
        ))}
      </ScrollView>
      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={Object.values(responses).some((value) => value.trim() === '')}
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
    paddingVertical: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default QuestionnaireScreen;
