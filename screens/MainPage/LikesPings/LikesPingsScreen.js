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
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface, // Tab bar background
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary, // Indicator color
        },
        tabBarActiveTintColor: colors.primaryText, // Active tab text color
        tabBarInactiveTintColor: colors.textSecondary, // Inactive tab text color
        tabBarLabelStyle: {
          fontWeight: '600', // Text styling for tab labels
        },
      }}
    >
      <Tab.Screen
        name="Likes"
        children={() => <LikesScreen likes={likes} loading={loading} />}
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
