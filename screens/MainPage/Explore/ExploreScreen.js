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
import SuccessModal from '../../../components/SuccessModal';
import ChipList from './ChipList';
import ActionButtons from './ActionButtons';
import MatchScreen from './MatchScreen';
import PingModal from './PingModal';
import { sendActionToBackendAPI, sendPingToBackendAPI } from '../../../api';
import EmptyStateView from '../../../components/EmptyStateView';
import { Ionicons } from '@expo/vector-icons';

const ExploreScreen = ({ profiles, userProfile, loading }) => {
  const { colors } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [setMatchedProfile] = useState(null);
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
      console.log('response:', response);

      if (response?.isMatch) {
        setMatchedProfile(response.matchedProfile);
        setIsMatch(true);
      } else {
        moveToNextProfile();
      }
    } catch (error) {
      console.error('Error sending action:', error);
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
        setModalVisible(false);
        setIsSuccessModalVisible(true);
        setPingNote('');

        // Automatically close the success modal & move to the next profile after 2 seconds
        setTimeout(() => {
          setIsSuccessModalVisible(false);
          // moveToNextProfile();
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
        <Text style={[styles.name, { color: colors.secondaryText }]}>
          {item.name}
        </Text>
        <Text style={[{ color: colors.secondaryText }]}>
          {item.age}{' '}
          {item.gender?.charAt(0).toUpperCase() + item.gender.slice(1) ||
            'Not specified'}{' '}
          •{' '}
          {item.orientation?.charAt(0).toUpperCase() +
            item.orientation.slice(1) || 'Not specified'}
        </Text>
        <Text style={[{ color: colors.secondaryText }]}>
          {item.distanceBetween < 1
            ? 'Less than a Km away'
            : `${item.distanceBetween} Km away`}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.bioContainer}>
          <Text style={[styles.quote, styles.openingQuote]}>“</Text>
          <Text style={[styles.bio, { color: colors.primaryText }]}>
            {item.bio || 'No bio available'}
          </Text>
          <Text style={[styles.quote, styles.closingQuote]}>”</Text>
        </View>

        {item.desires?.length > 0 && (
          <ChipList title="Desires" items={item.desires} />
        )}
        {item.interests?.length > 0 && (
          <ChipList title="Interests" items={item.interests} />
        )}

        <View style={styles.blockReportContainer}>
          <TouchableOpacity style={styles.blockReportButton}>
            <Ionicons
              name="flag-outline"
              size={18}
              color={colors.danger}
              style={styles.flagIcon}
            />
            <Text style={[styles.blockReportText, { color: colors.danger }]}>
              Block or Report
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

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
        renderProfile(profiles[currentIndex])
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
  bioContainer: {
    position: 'relative',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 5,
  },
  name: {
    fontSize: 20,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center', // Center the text
    paddingHorizontal: 10,
    fontStyle: 'italic', // Italic for styling
  },
  quote: {
    position: 'absolute',
    fontSize: 36,
    color: '#ccc', // Light gray color for the quotes
  },
  openingQuote: {
    top: -10,
    left: 5,
  },
  closingQuote: {
    bottom: -30,
    right: 5,
  },
  blockReportContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 100,
  },
  blockReportButton: {
    flexDirection: 'row', // Aligns icon and text horizontally
    alignItems: 'center', // Vertically center text & icon
    padding: 8,
    borderRadius: 5,
  },
  flagIcon: {
    marginRight: 5, // Adds spacing between icon and text
  },
  blockReportText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ExploreScreen;
