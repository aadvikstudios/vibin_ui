import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Alert, Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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

  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
      setCurrentIndex(0);
      setShowNoProfiles(false);
    }, [profiles])
  );

  const moveToNextProfile = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -500, // Slide left
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0, // Fade out
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8, // Slight shrink effect
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= profiles.length) {
          setShowNoProfiles(true);
          return prevIndex;
        }

        // Reset animation values for new profile
        slideAnim.setValue(500); // Start new profile off-screen
        opacityAnim.setValue(0);
        scaleAnim.setValue(1.2); // Slight zoom-in

        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0, // Slide to center
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1, // Fade in
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1, // Back to normal scale
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        return nextIndex;
      });
    });
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
      console.log('response?.isMatch', response?.isMatch, response);

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
    setModalVisible(false);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isMatch ? (
        <MatchScreen />
      ) : showNoProfiles ? (
        <EmptyStateView title="No profiles available" />
      ) : profiles?.length > 0 && currentIndex < profiles.length ? (
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <ProfileScreen profile={profiles[currentIndex]} />
        </Animated.View>
      ) : (
        <EmptyStateView title="No profiles available" />
      )}

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
