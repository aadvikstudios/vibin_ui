import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // ✅ Import useFocusEffect

import { useTheme } from 'react-native-paper';
import MatchScreen from './MatchScreen';
import ProfileScreen from './ProfileScreen';
import ActionButtons from './ActionButtons';
import PingModal from './PingModal';
import SuccessModal from '../../../components/SuccessModal';
import EmptyStateView from '../../../components/EmptyStateView';
import { sendActionToBackendAPI, sendPingToBackendAPI } from '../../../api';

const ExploreScreen = ({ profiles, userProfile, loading }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const [showNoProfiles, setShowNoProfiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [pingNote, setPingNote] = useState('');

  useEffect(() => setIsLoading(loading), [loading]);
  // ✅ Reset index when user navigates to the tab
  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(0); // Reset index
      setShowNoProfiles(false); // Reset empty state
    }, [profiles]) // Depend on profiles, so it resets when they change
  );
  const moveToNextProfile = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= profiles.length) {
      setShowNoProfiles(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const handleAction = async (action) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    setIsLoading(true);
    try {
      const response = await sendActionToBackendAPI(
        userProfile.emailId,
        currentProfile.emailId,
        action
      );

      if (response?.isMatch) {
        setIsMatch(true);
      } else {
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

    setIsLoading(true);
    try {
      const response = await sendPingToBackendAPI(
        userProfile.emailId,
        profiles[currentIndex]?.emailId,
        'pinged',
        pingNote
      );

      if (response.message) {
        setModalVisible(false);
        setIsSuccessModalVisible(true);
        setPingNote('');
        setTimeout(() => setIsSuccessModalVisible(false), 2000);
        moveToNextProfile();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send ping.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : isMatch ? (
        <MatchScreen />
      ) : showNoProfiles ? (
        <EmptyStateView title="No profiles available" />
      ) : profiles?.length > 0 && currentIndex < profiles.length ? (
        <ProfileScreen profile={profiles[currentIndex]} />
      ) : (
        <EmptyStateView title="No profiles available" />
      )}

      {profiles?.length > 0 && currentIndex < profiles.length && !isMatch && (
        <ActionButtons
          onPress={(action) =>
            action === 'pinged' ? setModalVisible(true) : handleAction(action)
          }
        />
      )}

      <PingModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSendPing={handleSendPing}
        pingNote={pingNote}
        setPingNote={setPingNote}
        isLoading={isLoading}
      />

      <SuccessModal
        visible={isSuccessModalVisible}
        message="Ping Sent Successfully!"
        onClose={() => {
          setIsSuccessModalVisible(false);
          moveToNextProfile();
        }}
      />
    </View>
  );
};

export default ExploreScreen;
