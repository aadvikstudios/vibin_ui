import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useUser } from '../../context/UserContext';
import {
  fetchMatchesForProfileAPI,
  fetchInteractionsForUserHandle,
  fetchPingsAPI,
  fetchConnectionsAPI,
} from '../../api';

// Screens
import ExploreScreen from './Explore/ExploreScreen';
import ConnectionsScreen from './Connections/ConnectionsScreen';
import LikesPingsScreen from './LikesPings/LikesPingsScreen';
import ProfileScreen from './Profiles/ProfileScreen';
import EditProfile from './Profiles/ProfileOptionPages/EditProfile';
import SearchSettings from './Profiles/ProfileOptionPages/SearchSettings';
import AppSettings from './Profiles/ProfileOptionPages/AppSettings';
import OurCommunity from './Profiles/ProfileOptionPages/OurCommunity';
import Help from './Profiles/ProfileOptionPages/Help';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

// Profile Stack Navigator
const ProfileStackScreen = ({ userProfile, fetchData }) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ headerShown: false }}
      initialParams={{ userProfile }}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ headerShown: false }}
      initialParams={{ userProfile, fetchData }}
    />
    <ProfileStack.Screen
      name="SearchSettings"
      component={SearchSettings}
      options={{ headerShown: false }}
      initialParams={{ fetchData }}
    />
    <ProfileStack.Screen
      name="AppSettings"
      component={AppSettings}
      options={{ headerShown: false }}
      initialParams={{ fetchData }}
    />
    <ProfileStack.Screen
      name="OurCommunity"
      component={OurCommunity}
      options={{ headerShown: false }}
      initialParams={{ fetchData }}
    />
    <ProfileStack.Screen
      name="Help"
      component={Help}
      options={{ headerShown: false }}
      initialParams={{ fetchData }}
    />
  </ProfileStack.Navigator>
);

const MainPage = ({ navigation }) => {
  const { colors, dark } = useTheme();
  const { userData, updateUser } = useUser();
  const insets = useSafeAreaInsets();
  const [profiles, setProfiles] = useState([]);
  const [likes, setLikes] = useState([]);
  const [pings, setPings] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    console.log('Fetching user data:', userData.lookingFor, userData.emailId);
    if (!userData?.emailId || !userData?.lookingFor) {
      console.warn('⚠️ User data is missing required fields.');
      return;
    }

    setLoading(true);

    try {
      const [profileData, interactionData] = await Promise.all([
        fetchMatchesForProfileAPI(userData.userhandle, userData.lookingFor),
        fetchInteractionsForUserHandle(userData.userhandle),
      ]);

      setProfiles(profileData || []);
      console.log('likesData', interactionData);
      setLikes((interactionData || []).filter((like) => like.type === 'like'));
      setPings((interactionData || []).filter((like) => like.type === 'ping'));
      // setConnections(connectionsData || []);
    } catch (error) {
      console.error('❌ Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  }, [userData]);
  useEffect(() => {
    // Fetch Data on Mount
    fetchData();
  }, [fetchData]);

  const handleTabChange = (focused) => {
    if (focused) {
      fetchData();
    }
  };

  return (
    <SafeAreaProvider>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <StatusBar
          barStyle={dark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Explore') {
                iconName = focused ? 'compass' : 'compass-outline';
              } else if (route.name === 'LikesPings') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Connections') {
                iconName = focused ? 'link-variant' : 'link-variant-off';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'account' : 'account-outline';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.onSurfaceDisabled,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              elevation: 5,
            },
          })}
        >
          <Tab.Screen
            name="Explore"
            listeners={{ tabPress: () => handleTabChange(true) }}
            options={{ headerShown: false }}
          >
            {() => (
              <ExploreScreen
                profiles={profiles}
                userProfile={userData}
                loading={loading}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="LikesPings"
            listeners={{ tabPress: () => handleTabChange(true) }}
            options={{ headerShown: false }}
          >
            {() => (
              <LikesPingsScreen
                likes={likes}
                pings={pings}
                loading={loading}
                onRefresh={fetchData}
                userProfile={userData}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Connections"
            listeners={{ tabPress: () => handleTabChange(true) }}
            options={{ headerShown: false }}
          >
            {() => (
              <ConnectionsScreen
                connections={connections}
                loading={loading}
                onRefresh={fetchData}
                userProfile={userData}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Profile"
            listeners={{ tabPress: () => handleTabChange(true) }}
            options={{ headerShown: false }}
          >
            {() => (
              <ProfileStackScreen
                userProfile={userData}
                fetchData={fetchData}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainPage;
