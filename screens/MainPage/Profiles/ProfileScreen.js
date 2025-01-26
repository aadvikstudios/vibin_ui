import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import PhotoSlider from './PhotoSlider';
import OptionsList from './OptionsList';
import { useUser } from '../../../context/UserContext';

const ProfileScreen = ({ navigation, route }) => {
  const { userData } = useUser();
  const { colors } = useTheme();
  const userProfile = userData;
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Photo Slider */}
      <PhotoSlider photos={userProfile.photos} />

      {/* Name and Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.primaryText }]}>
            {userProfile.name}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons
              name="pencil-outline"
              size={20}
              color={colors.primaryText}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subInfo, { color: colors.secondaryText }]}>
          {userProfile.age} {userProfile.gender} {userProfile.orientation}
        </Text>
      </View>

      {/* Get Verified Banner */}
      <TouchableOpacity
        style={[styles.banner, { backgroundColor: colors.success }]}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={[styles.bannerText, { color: colors.onPrimary }]}>
              Get verified{' '}
              <MaterialIcons
                name="verified"
                size={20}
                color={colors.onPrimary}
              />
            </Text>
            <Text style={[styles.bannerSubText, { color: colors.onPrimary }]}>
              Join the Verification beta, and show others you're for real with a
              badge.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.onPrimary} />
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
            <Text style={[styles.actionText, { color: colors.text }]}>
              Pings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.actionContent}>
            <Ionicons name="star-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Uplift your profile
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Additional Options */}
      <OptionsList navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailsContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editIcon: {
    marginLeft: 10,
  },
  subInfo: {
    fontSize: 16,
    marginTop: 5,
  },
  banner: {
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubText: {
    fontSize: 14,
    marginTop: 5,
  },
  actionContainer: {
    paddingHorizontal: 20,
  },
  actionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  upgradeText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProfileScreen;
