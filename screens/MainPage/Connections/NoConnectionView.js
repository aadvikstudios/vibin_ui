import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const NoConnectionView = ({ title, subtitle, onDiscoverMore }) => {
  return (
    <View style={styles.container}>
      {/* Circle with icon */}
      <View style={styles.circle}>
        <View style={styles.innerCircle}>
          <Text style={styles.iconText}>❤️</Text>
        </View>
        <Text style={styles.likeCount}>0</Text>
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
      <Text style={styles.title}>{title || 'See your Connections here'}</Text>
      <Text style={styles.subtitle}>
        {subtitle ||
          'When you like someone and the feelings are mutual, they become a Connection. Start your journey by tapping Like on the profiles that catch your eye.'}
      </Text>

      {/* Discover button */}
      <TouchableOpacity style={styles.primaryButton} onPress={onDiscoverMore}>
        <Text style={styles.primaryButtonText}>Discover more people</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c', // Matches dark background
    paddingHorizontal: 20,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
    color: '#ff6f61', // Heart color
  },
  likeCount: {
    position: 'absolute',
    fontSize: 20,
    color: '#fff',
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
    backgroundColor: '#333', // Placeholder for missing avatars
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default NoConnectionView;
