import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const SuccessModal = ({ visible, message, onClose, autoCloseTime = 2000 }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current; // Start fully expanded
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Start animations: fade in & start fully expanded
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after delay
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0, // Shrinks to center
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 500,
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

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.fullscreenContainer,
            { backgroundColor: colors.primary, opacity: opacityAnim },
          ]}
        >
          <Animated.View
            style={[
              styles.shrinkingEffect,
              {
                backgroundColor: colors.primaryContainer,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <Ionicons
            name="checkmark-circle-outline"
            size={80}
            color={colors.success}
          />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
  },
  fullscreenContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SuccessModal;
