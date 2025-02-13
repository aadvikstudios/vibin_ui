import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import CarouselComponent from './CarouselComponent';
import ChipList from '../../../components/ChipList';
import QuestionnaireAnswers from '../../../components/QuestionnaireAnswers'; // Import the new component

import {
  fetchUserProfileUsingEmailAPI,
  getPresignedReadUrlAPI,
} from '../../../api';
import ProfileDetails from '../../../components/ProfileDetails';
import BlockReportButton from '../../../components/BlockReportButton';

const ViewProfileScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { email, targetEmail } = route.params || {}; // Extract email from params

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (email) {
      fetchUserProfile();
    } else {
      setError('No email provided.');
      setLoading(false);
    }
  }, [email]);

  // Fetch user profile using email
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching profile using email:', email, targetEmail);

      const fetchedProfile = await fetchUserProfileUsingEmailAPI(
        email,
        targetEmail
      );
      console.log('📩 Fetched Profile:', fetchedProfile);

      if (fetchedProfile?.photos?.length > 0) {
        await fetchPhotoUrls(fetchedProfile.photos, fetchedProfile);
      } else {
        setUserProfile(fetchedProfile);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
      Alert.alert('Error', err.message || 'Failed to load profile.');
      setLoading(false);
    }
  };

  // Fetch pre-signed URLs for all photos
  const fetchPhotoUrls = async (photoKeys, profileData) => {
    try {
      const updatedPhotos = await Promise.all(
        photoKeys.map(async (key) => {
          try {
            return await getPresignedReadUrlAPI(key);
          } catch (error) {
            console.error(`❌ Error fetching signed URL for ${key}:`, error);
            return null;
          }
        })
      );

      setUserProfile({
        ...profileData,
        photos: updatedPhotos.filter(Boolean),
      });
    } catch (err) {
      console.error('🚨 Error fetching pre-signed URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  // **Loading State**
  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.secondaryText, marginTop: 10 }}>
          Loading Profile...
        </Text>
      </View>
    );
  }

  // **Error State**
  if (error || !userProfile) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.danger, fontSize: 18 }}>
          {error || 'Profile not found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.card, { backgroundColor: colors.surface }]}
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Profile Images */}
      {userProfile?.photos?.length > 0 ? (
        <CarouselComponent
          photos={userProfile.photos}
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

      {/* Profile Info */}
      <ProfileDetails profile={userProfile} />
      {/* Bio Section */}
      <View style={styles.textContainer}>
        {/* Desires */}
        {userProfile.desires?.length > 0 && (
          <ChipList title="Desires" items={userProfile.desires} />
        )}

        {/* Interests */}
        {userProfile.interests?.length > 0 && (
          <ChipList title="Interests" items={userProfile.interests} />
        )}
        {/* Add QuestionnaireAnswers Component */}
        {userProfile.questionnaire && (
          <QuestionnaireAnswers questionnaire={profile.questionnaire} />
        )}

        {/* Block or Report */}
        <BlockReportButton />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 8,
    borderRadius: 20,
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
  name: {
    fontSize: 20,
  },
  bioContainer: {
    position: 'relative',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 5,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontStyle: 'italic',
  },
  blockReportContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  blockReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  blockReportText: {
    fontSize: 14,
    marginLeft: 5,
  },
  flagIcon: {
    marginRight: 5,
  },
});

export default ViewProfileScreen;
