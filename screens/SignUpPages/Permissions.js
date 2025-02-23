import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import {
  fetchPermissionAndLocation,
  fetchNotificationPermission,
} from '../../utils/permissionsHelper';

const Permissions = ({ navigation }) => {
  const { colors } = useTheme();
  const { updateUser } = useUser();
  const [permissions, setPermissions] = useState({
    notifications: false,
    location: false,
  });
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const hasFetchedPermissions = useRef(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (hasFetchedPermissions.current) return;
      hasFetchedPermissions.current = true;

      try {
        const location = await fetchPermissionAndLocation();
        if (location) {
          setPermissions((prev) => ({ ...prev, location: true }));
          updateUser({
            latitude: location.latitude,
            longitude: location.longitude,
          });
        }

        const notificationsGranted = await fetchNotificationPermission();
        if (notificationsGranted) {
          setPermissions((prev) => ({ ...prev, notifications: true }));
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [updateUser]);

  const handleNext = () => {
    console.log('Permissions:', permissions);
    navigation.navigate('SafetyGuidelines');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        title="Permissions"
        subtitle="Do we have your permission to access the following?"
        currentStep={10}
      />

      <View style={styles.content}>
        {/* Notifications Permission */}
        <TouchableOpacity
          style={[
            styles.permissionCard,
            {
              backgroundColor: permissions.notifications
                ? colors.primary + '33'
                : colors.surface,
              borderColor: permissions.notifications
                ? colors.primary
                : colors.border,
            },
          ]}
          onPress={() =>
            Alert.alert(
              'Info',
              'Notification permissions are handled on page load.'
            )
          }
        >
          <IconButton icon="bell-outline" size={24} color={colors.primary} />
          <View style={styles.textContainer}>
            <Text
              style={[styles.permissionTitle, { color: colors.primaryText }]}
            >
              Notifications
            </Text>
            <Text
              style={[
                styles.permissionDescription,
                { color: colors.secondaryText },
              ]}
            >
              Know when someone likes you back or when someone sends a message.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Location Permission */}
        <TouchableOpacity
          style={[
            styles.permissionCard,
            {
              backgroundColor: permissions.location
                ? colors.primary + '33'
                : colors.surface,
              borderColor: permissions.location
                ? colors.primary
                : colors.border,
            },
          ]}
          onPress={() =>
            Alert.alert(
              'Info',
              'Location permissions are handled on page load.'
            )
          }
        >
          <IconButton
            icon="map-marker-outline"
            size={24}
            color={permissions.location ? colors.primary : colors.onSurface}
          />
          <View style={styles.textContainer}>
            <Text
              style={[styles.permissionTitle, { color: colors.primaryText }]}
            >
              Location
            </Text>
            <Text
              style={[
                styles.permissionDescription,
                { color: colors.secondaryText },
              ]}
            >
              We help you discover people based on your location.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Overlay Loader while fetching permissions */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Checking permissions...
          </Text>
        </View>
      )}

      <Footer
        buttonText="Next"
        onPress={handleNext}
        disabled={isLoading || !permissions.location} // Disable while loading or if location is denied
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Permissions;
