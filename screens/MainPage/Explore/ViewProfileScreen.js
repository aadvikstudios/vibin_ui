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
import ChipList from './ChipList';
import {
  fetchUserProfileUsingEmailAPI,
  getPresignedReadUrlAPI,
} from '../../../api';

const ViewProfileScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { profile: passedProfile, email } = route.params || {}; // Ensure `route.params` is not undefined

  const [userProfile, setUserProfile] = useState(passedProfile || null);
  const [loading, setLoading] = useState(!passedProfile);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  console.log('🚀 Received Props -> Profile:', passedProfile, 'Email:', email);

  useEffect(() => {
    if (!userProfile && email) {
      fetchUserProfile();
    } else if (userProfile?.photos?.length > 0) {
      console.log('🖼 Fetching Signed URLs for Photos...');
      fetchPhotoUrls(userProfile.photos);
    }
  }, [email, userProfile]);

  // Fetch user profile using email if not passed from navigation
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching profile using email:', email);

      const fetchedProfile = await fetchUserProfileUsingEmailAPI(email);
      console.log('📩 Fetched Profile:', fetchedProfile);

      if (fetchedProfile?.photos?.length > 0) {
        await fetchPhotoUrls(fetchedProfile.photos, fetchedProfile);
      } else {
        setUserProfile(fetchedProfile);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
      Alert.alert('Error', err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pre-signed URLs for all photos
  const fetchPhotoUrls = async (photoKeys, profileData = userProfile) => {
    try {
      const updatedPhotos = await Promise.all(
        photoKeys.map(async (key) => {
          try {
            const url = await getPresignedReadUrlAPI(key);
            return url;
          } catch (error) {
            console.error(`❌ Error fetching signed URL for ${key}:`, error);
            return null;
          }
        })
      );

      const filteredPhotos = updatedPhotos.filter((url) => url);
      console.log('✅ Updated Photo URLs:', filteredPhotos);

      setUserProfile((prevProfile) => ({
        ...prevProfile,
        photos: filteredPhotos,
      }));
    } catch (err) {
      console.error('🚨 Error fetching pre-signed URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  // **🟢 Show Loading Indicator While Fetching Data**
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

  // **🔴 Show Error Message if Profile is Missing**
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
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: colors.secondaryText }]}>
          {userProfile.name || 'No Name'}
        </Text>
        <Text style={[{ color: colors.secondaryText }]}>
          {userProfile.age || 'N/A'}{' '}
          {userProfile.gender
            ? userProfile.gender.charAt(0).toUpperCase() +
              userProfile.gender.slice(1)
            : 'Not specified'}{' '}
          •{' '}
          {userProfile.orientation
            ? userProfile.orientation.charAt(0).toUpperCase() +
              userProfile.orientation.slice(1)
            : 'Not specified'}
        </Text>
        <Text style={[{ color: colors.secondaryText }]}>
          {userProfile.distanceBetween < 1
            ? 'Less than a Km away'
            : `${userProfile.distanceBetween} Km away`}
        </Text>
      </View>

      {/* Bio Section */}
      <View style={styles.textContainer}>
        <View style={styles.bioContainer}>
          <Text style={[styles.quote, styles.openingQuote]}>“</Text>
          <Text style={[styles.bio, { color: colors.primaryText }]}>
            {userProfile.bio || 'No bio available'}
          </Text>
          <Text style={[styles.quote, styles.closingQuote]}>”</Text>
        </View>

        {/* Desires */}
        {userProfile.desires?.length > 0 && (
          <ChipList title="Desires" items={userProfile.desires} />
        )}

        {/* Interests */}
        {userProfile.interests?.length > 0 && (
          <ChipList title="Interests" items={userProfile.interests} />
        )}

        {/* Block or Report */}
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
};

const styles = StyleSheet.create({
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
});

export default ViewProfileScreen;
