import React, { useState, useEffect } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const GroupImageMessage = ({ imageKey, fetchImageUrl }) => {
  const { colors } = useTheme(); // ✅ Get theme colors
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = await fetchImageUrl(imageKey);
        if (url) {
          setImageUrl(url);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('❌ Failed to fetch group chat image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (imageKey) {
      loadImage();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [imageKey]);

  if (loading) {
    return <ActivityIndicator size="small" color={colors.primary} />;
  }

  if (error) {
    return (
      <Text style={[styles.errorText, { color: colors.danger }]}>
        ❌ Image not available
      </Text>
    );
  }

  return (
    <View
      style={[
        styles.imageContainer,
        { backgroundColor: colors.surfaceVariant },
      ]}
    >
      <Image source={{ uri: imageUrl }} style={styles.messageImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 5,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default GroupImageMessage;
