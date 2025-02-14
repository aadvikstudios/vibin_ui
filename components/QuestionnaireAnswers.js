import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(questionnaire).map(([key, value], index) => {
        const questionData = questionMap[key];
        if (!questionData) return null;

        return (
          <View
            key={key}
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Text style={[styles.question, { color: colors.secondaryText }]}>
              {questionData.question}
            </Text>
            <Text style={[styles.answer, { color: colors.onPrimary }]}>
              {value || 'No response provided'}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  card: {
    padding: 15,
    marginBottom: 12,
    elevation: 3, // Adds subtle shadow on Android
    shadowOffset: { width: 0, height: 2 }, // iOS Shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  question: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answer: {
    fontSize: 18,
    fontStyle: 'italic',
    opacity: 0.9,
  },
});

export default QuestionnaireAnswers;
