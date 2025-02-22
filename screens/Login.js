import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, ImageBackground } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import TypewriterText from '../components/TypewriterText';

const Login = ({ navigation }) => {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -30, // Moves left by 30 pixels
          duration: 20000, // Slow movement (20 seconds)
          useNativeDriver: false,
        }),
        Animated.timing(translateX, {
          toValue: 0, // Moves back to original position
          duration: 20000, // Slow movement (20 seconds)
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleJoin = () => {
    navigation.navigate('Email');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Background */}
      <Animated.View
        style={[styles.animatedBackground, { transform: [{ translateX }] }]}
      >
        <ImageBackground
          source={require('../assets/background.jpg')}
          style={styles.background}
        />
      </Animated.View>

      {/* Overlay Content */}
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        {/* Row 1: Title & Subtitle (Static) */}
        <View style={styles.staticRow}>
          <Text style={[styles.title, { color: colors.primary }]}>VIBIN</Text>
          <Text style={[styles.subtitle, { color: '#FFFFFF' }]}>
            A dating app for the curious
          </Text>
        </View>

        {/* Row 2: Typewriter Text (Fixed Height) */}
        <View style={styles.dynamicRow}>
          <TypewriterText />
        </View>

        {/* Row 3: Join Button (Static) */}
        <View style={styles.staticRow}>
          <Button
            mode="contained"
            onPress={handleJoin}
            style={[styles.button, { backgroundColor: colors.primary }]}
            labelStyle={[styles.buttonText, { color: colors.onPrimary }]}
          >
            Join Vibin
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  animatedBackground: {
    position: 'absolute',
    width: '110%', // Extra width for smooth animation
    height: '100%',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around', // Ensures elements don't move
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  staticRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dynamicRow: {
    height: 60, // Fixed height to prevent movement
    width: '100%',
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  button: {
    paddingVertical: 14,
    width: '70%',
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Login;
