import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';

import MatchModal from './MatchModal'; // ✅ Using MatchModal instead of MatchScreen
import ProfileScreen from './ProfileScreen';
import ActionButtons from './ActionButtons';
import PingModal from './PingModal';
import SuccessModal from '../../../components/SuccessModal';
import EmptyStateView from '../../../components/EmptyStateView';
import {
  sendActionToBackendAPI,
  sendPingToBackendAPI,
  sendMessageAPI,
} from '../../../api';

const ExploreScreen = ({ profiles, userProfile, loading }) => {
  const { colors } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [showNoProfiles, setShowNoProfiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPingModalVisible, setPingModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [successType, setSuccessType] = useState(null); // ✅ Track success type (ping or like)
  const [pingNote, setPingNote] = useState('');

  useEffect(() => setIsLoading(loading), [loading]);

  // ✅ Reset index when user navigates to the tab
  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(0);
      setShowNoProfiles(false);
    }, [profiles])
  );

  useEffect(() => {
    if (isMatch) {
      console.log('🔹 Triggering modal re-render...');
      setTimeout(() => setIsMatch(true), 100); // Small delay to ensure re-render
    }
  }, [isMatch]);

  const moveToNextProfile = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= profiles.length) {
        setShowNoProfiles(true);
        return prevIndex;
      }
      return nextIndex;
    });
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) {
      Alert.alert('Message Required', 'Please type a message before sending.');
      return;
    }

    const payload = {
      matchId: matchedProfile?.matchId,
      content: messageText.trim(),
      isUnread: 'true',
      liked: false,
      senderId: userProfile.userhandle,
    };

    try {
      console.log('📩 Sending message:', payload);
      const response = await sendMessageAPI(payload);
      console.log('✅ Message sent successfully:', response);
      setIsMatch(false);
      moveToNextProfile();
    } catch (error) {
      console.error('❌ Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleAction = async (action) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    setIsLoading(true);
    try {
      const response = await sendActionToBackendAPI(
        userProfile.userhandle,
        currentProfile.userhandle,
        action
      );

      if (response?.isMatch) {
        console.log('✅ Match found!');
        setIsMatch(true);
        setMatchedProfile(response.matchedProfile);
        setIsSuccessModalVisible(false);
        setPingModalVisible(false);
      } else if (action === 'like' && !response.isMatch) {
        setIsMatch(false);
        setPingModalVisible(false);
        setSuccessType('like'); // ✅ Set correct success type
        setIsSuccessModalVisible(true);
        setPingNote('');
        setTimeout(() => setIsSuccessModalVisible(false), 1000);
        moveToNextProfile();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPing = async () => {
    if (!pingNote.trim()) {
      Alert.alert('Note Required', 'Please add a note before sending.');
      return;
    }

    setPingModalVisible(false);
    setIsLoading(true);

    try {
      const response = await sendPingToBackendAPI(
        userProfile.userhandle,
        profiles[currentIndex]?.userhandle,
        pingNote
      );

      if (response.message) {
        setPingModalVisible(false);
        setSuccessType('ping'); // ✅ Set success type as ping
        setIsSuccessModalVisible(true);
        setPingNote('');
        setTimeout(() => setIsSuccessModalVisible(false), 1000);
        moveToNextProfile();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send ping.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MatchModal
        visible={isMatch}
        profile={matchedProfile}
        onSendMessage={handleSendMessage}
        onLater={() => {
          setIsMatch(false);
          moveToNextProfile();
        }}
      />

      {/* ✅ Dynamic Success Modal (Ping or Like) */}
      <SuccessModal
        visible={isSuccessModalVisible}
        successType={successType} // ✅ Pass success type
        onClose={() => {
          setIsSuccessModalVisible(false);
          moveToNextProfile();
        }}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : showNoProfiles ? (
        <EmptyStateView title="No profiles available" />
      ) : profiles?.length > 0 && currentIndex < profiles.length ? (
        <ProfileScreen profile={profiles[currentIndex]} />
      ) : (
        <EmptyStateView title="No profiles available" />
      )}

      {!isLoading && !showNoProfiles && profiles?.length > 0 && !isMatch && (
        <ActionButtons
          onPress={(action) =>
            action === 'pinged'
              ? setPingModalVisible(true)
              : handleAction(action)
          }
        />
      )}

      <PingModal
        visible={isPingModalVisible}
        onClose={() => setPingModalVisible(false)}
        onSendPing={handleSendPing}
        pingNote={pingNote}
        setPingNote={setPingNote}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default ExploreScreen;
