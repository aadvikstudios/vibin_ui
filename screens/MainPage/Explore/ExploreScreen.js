import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import ViewProfileScreen from './ViewProfileScreen';
import SuccessModal from '../../../components/SuccessModal';
import ActionButtons from './ActionButtons';
import MatchScreen from './MatchScreen';
import PingModal from './PingModal';
import { sendActionToBackendAPI, sendPingToBackendAPI } from '../../../api';
import EmptyStateView from '../../../components/EmptyStateView';

const ExploreScreen = ({ profiles, userProfile, loading }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const [showNoProfiles, setShowNoProfiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [pingNote, setPingNote] = useState('');

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

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

        setTimeout(() => {
          setIsSuccessModalVisible(false);
          moveToNextProfile();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to send ping.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send ping.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Loading...
          </Text>
        </View>
      ) : isMatch ? (
        <MatchScreen />
      ) : showNoProfiles ? (
        <EmptyStateView
          title="It’s quiet around here"
          subtitle="To find more people near you, update your search settings."
          primaryActionText="Edit search settings"
          secondaryActionText="Clear filters"
        />
      ) : profiles?.length > 0 && currentIndex < profiles.length ? (
        <ViewProfileScreen profile={profiles[currentIndex]} />
      ) : (
        <EmptyStateView title="No profiles available" />
      )}

      {profiles?.length > 0 &&
        currentIndex < profiles.length &&
        !isMatch &&
        !showNoProfiles && (
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ExploreScreen;
