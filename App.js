import React, { useEffect } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import StackNavigator from './navigation/StackNavigator'; // Modular stack navigator
import { PaperThemes } from './PaperThemes'; // Import custom themes
import * as NavigationBar from 'expo-navigation-bar';
import { UserProvider } from './context/UserContext';
import { LogBox } from 'react-native';

// Disable Reanimated warnings
LogBox.ignoreLogs([
  '[Reanimated] Reading from `value` during component render.',
]);

const AppContent = () => {
  // useEffect(() => {
  //   async function configureNavigationBar() {
  //     if (Platform.OS === 'android') {
  //       await NavigationBar.setVisibilityAsync('hidden');
  //       await NavigationBar.setBehaviorAsync('overlay-swipe');
  //     }
  //   }
  //   configureNavigationBar();
  // }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        {/* Now the initial route is the SplashScreen */}
        <StackNavigator initialRouteName="SplashScreen" />
      </NavigationContainer>
    </UserProvider>
  );
};

const App = () => {
  const themeMode = 'dark'; // Set 'light' or 'dark' to switch themes
  const currentTheme = PaperThemes[themeMode];

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppContent />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default gestureHandlerRootHOC(App);
