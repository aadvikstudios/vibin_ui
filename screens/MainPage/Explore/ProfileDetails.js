import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const ProfileDetails = ({ profile }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.textContainer}>
      <Text style={[styles.name, { color: colors.primary }]}>
        {profile.name}
      </Text>
      <Text style={[styles.details, { color: colors.secondaryText }]}>
        {profile.age} • {profile.gender} • {profile.orientation}
      </Text>
      <Text style={[styles.details, { color: colors.secondaryText }]}>
        {profile.distanceBetween < 1
          ? 'Less than a Km away'
          : `${profile.distanceBetween} Km away`}
      </Text>
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
