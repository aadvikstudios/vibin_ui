import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Text,
  TextInput,
  Modal,
  useTheme,
  IconButton,
  Avatar,
} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { sendMessageAPI, getPresignedReadUrlAPI } from '../api';
import { Alert, ToastAndroid, Platform } from 'react-native';

const MatchScreen = ({ targetProfile, userProfile, matchId, onClose }) => {
  const { colors } = useTheme();
  const [initialMessage, setInitialMessage] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [targetImage, setTargetImage] = useState(null);

  const presetMessages = [
    "Hi! How's it going?",
    'Nice to meet you!',
    'What are you passionate about?',
    "Let's connect!",
    "What's your favorite hobby?",
  ];

  // Fetch presigned URLs for profile images
  useEffect(() => {
    const fetchPresignedUrls = async () => {
      try {
        console.log('user profile', userProfile, targetProfile);
        const userImageUrl = userProfile?.image
          ? await getPresignedReadUrlAPI(userProfile.image)
          : `https://robohash.org/1.png?set=set5`;
        const targetImageUrl = targetProfile?.image
          ? await getPresignedReadUrlAPI(targetProfile.image)
          : `https://robohash.org/2.png?set=set5`;
        setUserImage(userImageUrl);
        setTargetImage(targetImageUrl);
      } catch (error) {
        console.error('Error fetching presigned URLs:', error);
      }
    };

    fetchPresignedUrls();
  }, [userProfile, targetProfile]);

  const handleSend = async () => {
    if (initialMessage.trim()) {
      const message = {
        messageId: `${matchId}-${Date.now()}-${Math.random()}`,
        matchId: String(matchId),
        senderId: userProfile.userId,
        content: initialMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      try {
        console.log('Sending message:', message);
        await sendMessageAPI(message);
        setInitialMessage('');

        if (Platform.OS === 'android') {
          ToastAndroid.show('Message sent successfully!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', 'Message sent successfully!');
        }

        onClose();
      } catch (error) {
        console.error('Failed to send message:', error.message);

        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    }
  };

  const handlePresetMessageSelect = (message) => {
    setInitialMessage(message);
  };

  return (
    <Modal
      visible={true}
      onDismiss={onClose}
      contentContainerStyle={[
        styles.modalContainer,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <IconButton
          icon="close"
          size={24}
          onPress={onClose}
          style={styles.closeIcon}
          iconColor={colors.textPrimary}
        />

        {/* Match Title */}
        <Text style={[styles.title, { color: colors.primary }]}>
          It's a Match!
        </Text>

        {/* Animation */}
        <LottieView
          source={require('../../../assets/animations/matchLove.json')}
          autoPlay
          loop
          style={styles.animation}
        />

        {/* Profile Images */}
        <View style={styles.imagesContainer}>
          <Avatar.Image
            source={{ uri: userImage }}
            size={100}
            style={styles.avatar}
          />
          <Avatar.Image
            source={{ uri: targetImage }}
            size={100}
            style={styles.avatar}
          />
        </View>

        {/* Match Message */}
        <Text style={[styles.message, { color: colors.textPrimary }]}>
          You matched with {targetProfile?.name || 'a new connection'}!
        </Text>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Say something nice..."
            value={initialMessage}
            onChangeText={setInitialMessage}
            style={[styles.input, { backgroundColor: colors.surface }]}
            outlineColor={colors.outline}
          />
          <IconButton
            icon="send"
            size={20}
            onPress={handleSend}
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            iconColor={colors.onPrimary}
          />
        </View>

        {/* Preset Messages */}
        <FlatList
          data={presetMessages}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetMessagesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.presetMessageButton,
                { backgroundColor: colors.secondaryContainer },
              ]}
              onPress={() => handlePresetMessageSelect(item)}
            >
              <Text
                style={[
                  styles.presetMessageText,
                  { color: colors.onSecondaryContainer },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  animation: {
    width: 150,
    height: 150,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    marginHorizontal: 10,
  },
  message: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 10,
  },
  sendButton: {
    borderRadius: 20,
  },
  presetMessagesContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  presetMessageButton: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  presetMessageText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MatchScreen;
