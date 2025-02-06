import React, { useState, useEffect } from 'react';
import { Image, Text, StyleSheet } from 'react-native';

const ImageMessage = ({ imageKey, fetchImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const url = await fetchImageUrl(imageKey);
      if (url) setImageUrl(url);
    };
    loadImage();
  }, [imageKey]);

  return imageUrl ? (
    <Image source={{ uri: imageUrl }} style={styles.messageImage} />
  ) : (
    <Text style={{ color: 'gray' }}>Loading image...</Text>
  );
};

const styles = StyleSheet.create({
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
});

export default ImageMessage;
