import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const ProfileDetails = ({ profile }) => {
  const { colors } = useTheme();

  // Determine whether to show the real name or username
  const displayName = profile.hideName ? profile.username : profile.name;

  return (
    <View style={styles.textContainer}>
      {/* Name or Username */}
      <Text style={[styles.name, { color: colors.primary }]}>
        {displayName}
      </Text>

      {/* User Handle (@userhandle) */}
      {profile.userhandle && (
        <Text style={[styles.userhandle, { color: colors.secondaryText }]}>
          @{profile.userhandle}
        </Text>
      )}

      {/* Age, Gender, Orientation */}
      <Text style={[styles.details, { color: colors.secondaryText }]}>
        {profile.age} • {profile.gender} • {profile.orientation}
      </Text>

      {/* Distance Information */}
      <Text style={[styles.details, { color: colors.secondaryText }]}>
        {profile.distanceBetween < 1
          ? 'Less than a Km away'
          : `${profile.distanceBetween} Km away`}
      </Text>

      {/* Bio Section */}
      <Text style={[styles.bio, { color: colors.primaryText }]}>
        {profile.bio || 'No bio available'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userhandle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    marginVertical: 2,
  },
  bio: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default ProfileDetails;
