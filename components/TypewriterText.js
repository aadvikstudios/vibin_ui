import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TypeWriter from 'react-native-typewriter';
import { Text } from 'react-native-paper';

const TypewriterText = () => {
  const texts = [
    'Swipe right, love draws near!',
    'Sparks fly, no need to fear!',
    "Heartbeats race, let's steer!",
    'Find your match, make it clear!',
    'Love and laughter, year by year!',
  ];

  // Colors adjusted for better visibility on dark backgrounds
  const visibleColors = [
    '#FF80AB', // Soft Pink (Vibrant but readable)
    '#FFA726', // Orange (Visible on dark)
    '#66BB6A', // Bright Green
    '#42A5F5', // Light Blue
    '#D1C4E9', // Soft Purple (Easy to read)
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Static Text (Remains Fixed) */}
      <Text style={styles.staticText}>Vibe Starts Here</Text>

      {/* Dynamic Typewriter Text (Moves Without Affecting Static Text) */}
      <View style={styles.dynamicTextContainer}>
        <TypeWriter typing={1} minDelay={50} maxDelay={100} key={index}>
          <Text style={[styles.typingText, { color: visibleColors[index] }]}>
            {texts[index]}
          </Text>
        </TypeWriter>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20, // Keep space from the edges
    paddingVertical: 10,
    width: '100%', // Full width for proper alignment
  },
  staticText: {
    alignItems: 'center', // Align text to the left

    fontSize: 28, // Slightly larger for emphasis
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for "Vibin Starts Here"
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)', // Adds shadow for better contrast
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  dynamicTextContainer: {
    height: 55, // Fixed height to prevent shifting
    justifyContent: 'center', // Center text inside
    alignItems: 'flex-start', // Align text to the left
  },
  typingText: {
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)', // Adds shadow for better contrast
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default TypewriterText;
