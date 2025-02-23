import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import PhotoSlider from './PhotoSlider';
import OptionsList from './OptionsList';
import { useUser } from '../../../context/UserContext';

const ProfileScreen = ({ navigation }) => {
  const { userData, updateUser } = useUser();
  const { colors, fonts } = useTheme();
  const userProfile = userData;

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userProfile');
              updateUser({});
              navigation.reset({
                index: 0,
                routes: [{ name: 'SplashScreen' }],
              });
            } catch (error) {
              console.error('Error during sign-out:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Photo Slider */}
      <PhotoSlider photos={userProfile.photos} />

      {/* Name and Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.name,
              { color: colors.primaryText, ...fonts.displayLarge },
            ]}
          >
            {userProfile.name}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons
              name="pencil-outline"
              size={20}
              color={colors.primaryText}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.subInfo,
            { color: colors.secondaryText, ...fonts.displayMedium },
          ]}
        >
          {userProfile.age} {userProfile.gender} {userProfile.orientation}
        </Text>
      </View>

      {/* Get Verified Banner */}
      <TouchableOpacity
        style={[styles.banner, { backgroundColor: colors.success }]}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={[styles.bannerText, { color: colors.onSuccess }]}>
              Get verified{' '}
              <MaterialIcons
                name="verified"
                size={20}
                color={colors.onSuccess}
              />
            </Text>
            <Text style={[styles.bannerSubText, { color: colors.onSuccess }]}>
              Join the Verification beta and show others you're for real with a
              badge.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.onSuccess} />
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.actionText, { color: colors.onPrimary }]}>
            Membership
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>Upgrade</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.actionContent}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.actionText, { color: colors.primaryText }]}>
              Pings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.actionContent}>
            <Ionicons name="star-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primaryText }]}>
              Uplift your profile
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Additional Options */}
      <OptionsList navigation={navigation} />

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: colors.danger }]}
        onPress={handleSignOut}
      >
        <Text style={[styles.signOutText, { color: colors.onDanger }]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  detailsContainer: { marginVertical: 20, paddingHorizontal: 20 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 24, fontWeight: 'bold' },
  subInfo: { fontSize: 16, marginTop: 5 },
  banner: { padding: 15, borderRadius: 10, margin: 20 },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: { flex: 1 },
  bannerText: { fontSize: 18, fontWeight: 'bold' },
  bannerSubText: { fontSize: 14, marginTop: 5 },
  actionContainer: { paddingHorizontal: 20 },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  actionContent: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  upgradeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  upgradeText: { color: '#fff', fontSize: 14 },
  signOutButton: {
    marginVertical: 20,
    marginHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  signOutText: { fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
