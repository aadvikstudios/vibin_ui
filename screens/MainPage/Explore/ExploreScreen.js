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
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [pingNote, setPingNote] = useState('');

  useEffect(() => setIsLoading(loading), [loading]);

  // ✅ Reset index when user navigates to the tab
  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(0);
      setShowNoProfiles(false);
    }, [profiles])
  );

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
        setIsMatch(true);
        console.log('response of match is ', response);
        setMatchedProfile(response?.matchedProfile);
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

    setModalVisible(false);
    setIsLoading(true);

    try {
      const response = await sendPingToBackendAPI(
        userProfile.userhandle,
        profiles[currentIndex]?.userhandle,
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
      // ✅ Pass `handleSendMessage` to `MatchModal`
      <MatchModal
        visible={isMatch}
        profile={matchedProfile}
        userhandle={userProfile.userhandle}
        onSendMessage={handleSendMessage} // ✅ Pass function as a prop
        onLater={() => {
          setIsMatch(false);
          moveToNextProfile();
        }}
      />
      ;
      {/* ✅ Action Buttons only appear when profiles exist and it's not loading */}
      {!isLoading && !showNoProfiles && profiles?.length > 0 && !isMatch && (
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
