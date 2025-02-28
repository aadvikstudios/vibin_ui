import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const SuccessModal = ({
  visible,
  successType,
  onClose,
  autoCloseTime = 1000, // ✅ Reduced to 1 second
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current; // Start fully expanded
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // ✅ Fade in animation (completes in 300ms)
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // ✅ Auto close after delay
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0, // Shrinks to center
            duration: 400, // ✅ Reduced duration for 1s animation
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 400, // ✅ Reduced duration for 1s animation
            useNativeDriver: true,
          }),
        ]).start(() => {
          onClose();
        });
      }, autoCloseTime);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  // ✅ Determine icon, text, and transparent background color dynamically
  const successConfig = {
    ping: {
      icon: 'paper-plane-outline',
      message: 'Ping Sent!',
      background: `${colors.primary}AA`, // ✅ 66% transparency
    },
    like: {
      icon: 'heart-outline',
      message: 'Like Sent!',
      background: `${colors.liked}AA`, // ✅ 66% transparency
    },
  };

  const { icon, message, background } =
    successConfig[successType] || successConfig.like;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.fullscreenContainer,
            { backgroundColor: background, opacity: opacityAnim },
          ]}
        >
          <Animated.View
            style={[
              styles.shrinkingEffect,
              {
                backgroundColor: `${colors.primaryContainer}99`, // ✅ 60% transparency
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <Ionicons name={icon} size={80} color={colors.onPrimary} />
          <Text style={[styles.successText, { color: colors.onPrimary }]}>
            {message}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ 50% opacity for background
  },
  fullscreenContainer: {
    flex: 1, // ✅ Fullscreen modal
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shrinkingEffect: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    borderRadius: 999,
    opacity: 0.3,
  },
  successText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SuccessModal;
