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

  // **Dynamic Title & Subtitle Generation**
  const getHeaderTitle = () => {
    switch (selectedQuestions.length) {
      case 0:
        return 'Choose three questions to complete your profile';
      case 1:
        return 'Great start! Select two more questions';
      case 2:
        return 'Almost there! Pick your final question';
      case 3:
        return 'Awesome! Your profile is now more descriptive';
      default:
        return 'Select questions to showcase your personality';
    }
  };

  const getHeaderSubtitle = () => {
    switch (selectedQuestions.length) {
      case 0:
        return 'Pick any three questions to help others get to know you better.';
      case 1:
        return 'Nice choice! Answering two more will make your profile stand out.';
      case 2:
        return 'One more question and your profile will be more engaging!';
      case 3:
        return 'Great! Your answers will help spark meaningful conversations.';
      default:
        return 'Answer these to let people connect with you better.';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title={getHeaderTitle()} // ✅ Dynamic title
        subtitle={getHeaderSubtitle()} // ✅ Dynamic subtitle
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
                borderColor: selectedQuestions.includes(item.key)
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={() => handleSelectQuestion(item)}
          >
            <Text style={[styles.questionText, { color: colors.onSurface }]}>
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
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            {/* Close Button in the Top-Right Corner */}
            <IconButton
              icon="close"
              size={20}
              onPress={() => setModalVisible(false)}
              style={[
                styles.closeButton,
                { backgroundColor: colors.secondary },
              ]}
              iconColor={colors.onSecondary}
            />
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              {currentQuestion?.question}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.onSurface,
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
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              labelStyle={{ color: colors.onPrimary }}
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
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 10,
    width: '100%',
    borderRadius: 8,
    paddingVertical: 10,
  },
});

export default QuestionnaireScreen;
