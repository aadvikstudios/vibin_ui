import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import CarouselComponent from './CarouselComponent';
import ChipList from './ChipList';
import ActionButtons from './ActionButtons';
import MatchScreen from './MatchScreen';
import PingModal from './PingModal';
import { sendActionToBackendAPI, sendPingToBackendAPI } from '../../../api';
import EmptyStateView from '../../../components/EmptyStateView';
const ExploreScreen = ({ profiles, userProfile, loading }) => {
  const { colors } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [setMatchedProfile] = useState(null);
  const [isMatch, setIsMatch] = useState(false);
  const [showNoProfiles, setShowNoProfiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [pingNote, setPingNote] = useState('');

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

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
      console.log('response:', response);

      if (response?.isMatch) {
        setMatchedProfile(response.matchedProfile);
        setIsMatch(true);
      } else {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= profiles.length) {
          setShowNoProfiles(true);
        } else {
          setCurrentIndex(nextIndex);
        }
      }
    } catch (error) {
      console.error('Error sending action:', error);
      Alert.alert('Error', 'Failed to process action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfile = (item) => (
    <ScrollView
      contentContainerStyle={[styles.card, { backgroundColor: colors.surface }]}
    >
      {item.photos?.length > 0 ? (
        <CarouselComponent
          photos={item.photos}
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text
            style={[styles.placeholderText, { color: colors.secondaryText }]}
          >
            No photos available
          </Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: colors.primaryText }]}>
          {item.name}, {item.age}
        </Text>
        <Text style={[styles.subInfo, { color: colors.secondaryText }]}>
          {item.gender?.charAt(0).toUpperCase() + item.gender.slice(1) ||
            'Not specified'}{' '}
          •{' '}
          {item.orientation?.charAt(0).toUpperCase() +
            item.orientation.slice(1) || 'Not specified'}
        </Text>
        <Text style={[styles.bio, { color: colors.secondaryText }]}>
          {item.bio || 'No bio available'}
        </Text>
        <ChipList title="Desires" items={item.desires} />
        <ChipList title="Interests" items={item.interests} />
        <View style={styles.blockReportContainer}>
          <TouchableOpacity>
            <Text style={[styles.blockReportText, { color: colors.error }]}>
              Block or Report
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const handleSendPing = async () => {
    if (!pingNote.trim()) {
      Alert.alert('Note Required', 'Please add a note before sending.');
      return;
    }

    setIsLoading(true);
    console.log('\nValue of current profile is ', profiles[currentIndex]);
    try {
      const response = await sendPingToBackendAPI(
        userProfile.emailId,
        profiles[currentIndex]?.emailId,
        'pinged',
        pingNote
      );
      console.log('from ui response ', response);
      if (response.message) {
        Alert.alert('Ping Sent', 'Your ping was sent successfully!');
        setModalVisible(false);
        setPingNote('');
        const nextIndex = currentIndex + 1;
        if (nextIndex >= profiles.length) {
          setShowNoProfiles(true);
        } else {
          setCurrentIndex(nextIndex);
        }
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
          onPrimaryAction={() => console.log('Edit settings pressed')}
          onSecondaryAction={() => console.log('Clear filters pressed')}
        />
      ) : profiles?.length > 0 && currentIndex < profiles.length ? (
        renderProfile(profiles[currentIndex])
      ) : (
        <EmptyStateView
          title="It’s quiet around here"
          subtitle="To find more people near you, update your search settings."
          primaryActionText="Edit search settings"
          secondaryActionText="Clear filters"
          onPrimaryAction={() => console.log('Edit settings pressed')}
          onSecondaryAction={() => console.log('Clear filters pressed')}
        />
      )}
      {profiles?.length > 0 &&
        currentIndex < profiles.length &&
        !isMatch &&
        !showNoProfiles && (
          <ActionButtons
            onPress={(action) => {
              if (action === 'pinged') {
                setModalVisible(true);
              } else {
                handleAction(action);
              }
            }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  card: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  placeholderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexGrow: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExploreScreen;
