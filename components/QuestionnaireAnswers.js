import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import questionsData from '../data/questions.json'; // Import questions.json

const QuestionnaireAnswers = ({ questionnaire }) => {
  const { colors } = useTheme();

  // Convert questionnaire data into a map for quick lookup
  const questionMap = questionsData.questionnaire.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {Object.entries(questionnaire).map(([key, value]) => {
        const questionData = questionMap[key];
        if (!questionData) return null;

        return (
          <View key={key} style={styles.questionContainer}>
            <Text style={[styles.question, { color: colors.primary }]}>
              {questionData.question}
            </Text>
            <Text style={[styles.answer, { color: colors.secondaryText }]}>
              {value || 'No response provided'}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  questionContainer: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default QuestionnaireAnswers;
