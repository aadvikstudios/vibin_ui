import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Text, useTheme, Button, IconButton } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import questionsData from '../../data/questions.json'; // Import JSON file

const QuestionnaireScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [tempResponse, setTempResponse] = useState(''); // Temporary response before saving

  useEffect(() => {
    setQuestions(questionsData.questionnaire);
  }, []);

  const openQuestionModal = (question) => {
    setCurrentQuestion(question);
    setTempResponse(responses[question.key] || ''); // Load existing response if available
    setModalVisible(true);
  };

  const handleSelectQuestion = (question) => {
    openQuestionModal(question);
  };

  const handleResponseChange = (text) => {
    setTempResponse(text);
  };

  const handleSaveResponse = () => {
    if (tempResponse.trim() === '') {
      // Prevent saving empty responses
      setModalVisible(false);
      return;
    }

    setResponses((prev) => ({ ...prev, [currentQuestion.key]: tempResponse }));

    if (!selectedQuestions.includes(currentQuestion.key)) {
      setSelectedQuestions([...selectedQuestions, currentQuestion.key]);
    }

    setModalVisible(false);
    setCurrentQuestion(null);
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
        title={`Select ${selectedQuestions.length === 0 ? 'first' : selectedQuestions.length === 1 ? 'second' : 'third'} question`}
        subtitle="Your answers help people get to know you! You can select up to 3 questions."
        currentStep={9}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {questions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.questionBox,
              {
                backgroundColor: selectedQuestions.includes(item.key)
                  ? colors.primaryContainer
                  : colors.surface,
              },
            ]}
            onPress={() => handleSelectQuestion(item)}
          >
            <Text style={[styles.questionText, { color: colors.text }]}>
              {item.question}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Footer
        buttonText="Submit"
        onPress={handleNext}
        disabled={selectedQuestions.length < 3}
      />

      {/* Modal for answering a question */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.primaryContainer },
            ]}
          >
            {/* Close Button in the Top-Right Corner */}
            <IconButton
              icon="close"
              size={20}
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            />
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              {currentQuestion?.question}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              multiline
              placeholder={currentQuestion?.placeholder}
              placeholderTextColor={colors.placeholder}
              value={tempResponse}
              onChangeText={handleResponseChange}
            />
            <Button
              mode="contained"
              onPress={handleSaveResponse}
              style={styles.saveButton}
            >
              Save
            </Button>
          </View>
        </View>
      </Modal>
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
  questionBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  questionText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay for better contrast
  },
  modalContent: {
    width: '85%',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // For Android shadow
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.1)', // Light transparent background for visibility
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    marginTop: 30, // Adjusted for space below close button
  },
  input: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 10,
    width: '100%',
  },
});

export default QuestionnaireScreen;
