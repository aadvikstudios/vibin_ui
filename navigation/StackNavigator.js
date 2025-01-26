import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Welcome from '../screens/Welcome';

//SignUp screens
import Email from '../screens/SignUpPages/Email';
import DateOfBirth from '../screens/SignUpPages/DateOfBirth';
import Name from '../screens/SignUpPages/Name';
import Gender from '../screens/SignUpPages/Gender';
import Orientation from '../screens/SignUpPages/Orientation';
import Desires from '../screens/SignUpPages/Desires';
import LookingFor from '../screens/SignUpPages/LookingFor';
import Interests from '../screens/SignUpPages/Interests';
import TellUsAboutYou from '../screens/SignUpPages/TellUsAboutYou';
import AddPhotos from '../screens/SignUpPages/AddPhotos';
import Permissions from '../screens/SignUpPages/Permissions';
import SafetyGuidelines from '../screens/SignUpPages/SafetyGuidelines';
import MainPage from '../screens/MainPage/MainPage';
import PersonalChatScreen from '../screens/PersonalChat/PersonalChatScreen';
const Stack = createStackNavigator();

const StackNavigator = ({ initialRouteName }) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Email"
        component={Email}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DOB"
        component={DateOfBirth}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Name"
        component={Name}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Gender"
        component={Gender}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Orientation"
        component={Orientation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LookingFor"
        component={LookingFor}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Desires"
        component={Desires}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Interests"
        component={Interests}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TellUsAboutYou"
        component={TellUsAboutYou}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPhotos"
        component={AddPhotos}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Permissions"
        component={Permissions}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SafetyGuidelines"
        component={SafetyGuidelines}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalChatScreen"
        component={PersonalChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
