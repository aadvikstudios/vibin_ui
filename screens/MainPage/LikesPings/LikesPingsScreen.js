import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import LikesScreen from './LikesScreen';
import PingsScreen from './PingsScreen';

const Tab = createMaterialTopTabNavigator();

const LikesPingsScreen = ({
  likes,
  pings,
  loading,
  onRefresh,
  userProfile,
}) => {
  const { colors, fonts } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface, // Tab bar background
          elevation: 0, // Remove shadow for a cleaner look
          borderBottomWidth: 1,
          borderBottomColor: colors.border, // Match border color
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary, // Indicator color
          height: 3, // Slightly thicker indicator
        },
        tabBarActiveTintColor: colors.primaryText, // Active tab text color
        tabBarInactiveTintColor: colors.secondaryText, // Inactive tab text color
        tabBarLabelStyle: {
          ...fonts.labelLarge, // Apply typography from theme.js
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Likes"
        children={() => (
          <LikesScreen
            likes={likes}
            loading={loading}
            onRefresh={onRefresh}
            userProfile={userProfile}
          />
        )}
      />
      <Tab.Screen
        name="Pings"
        children={() => (
          <PingsScreen
            pings={pings}
            loading={loading}
            userProfile={userProfile}
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default LikesPingsScreen;
