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
      {Object.entries(questionnaire).map(([key, value]) => {
        const questionData = questionMap[key];
        if (!questionData) return null;

        return (
          <View
            key={key}
            style={[
              styles.card,
              {
                backgroundColor: colors.primaryContainer,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            {/* Question */}
            <Text style={[styles.question, { color: colors.onPrimary }]}>
              {questionData.question}
            </Text>

            {/* Answer */}
            <View style={styles.answerContainer}>
              <Text style={[styles.answer, { color: colors.accent }]}>
                {value || 'No response provided'}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  card: {
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 2, // Slight elevation for better visibility
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  question: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    opacity: 0.9,
  },
  answerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Subtle background for differentiation
  },
  answer: {
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

export default QuestionnaireAnswers;
