import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

const NoConnectionView = ({ title, subtitle, onDiscoverMore }) => {
  const { colors, fonts } = useTheme(); // ✅ Get latest theme colors

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Circle with icon */}
      <View style={[styles.circle, { borderColor: colors.outline }]}>
        <View
          style={[
            styles.innerCircle,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          <Text style={[styles.iconText, { color: colors.liked }]}>❤️</Text>
        </View>
        <Text style={[styles.likeCount, { color: colors.primaryText }]}>0</Text>
      </View>

      {/* Avatar carousel */}
      <View style={styles.avatarCarousel}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
      </View>

      {/* Title and subtitle */}
      <Text style={[styles.title, { color: colors.primaryText }]}>
        {title || 'See your Connections here'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        {subtitle ||
          'When you like someone and the feelings are mutual, they become a Connection. Start your journey by tapping Like on the profiles that catch your eye.'}
      </Text>

      {/* Discover button */}
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={onDiscoverMore}
      >
        <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>
          Discover more people
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  likeCount: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    bottom: -15,
  },
  avatarCarousel: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  primaryButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default NoConnectionView;
