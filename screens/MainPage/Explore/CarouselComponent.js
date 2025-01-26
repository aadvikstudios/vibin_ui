import React, { useCallback } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useTheme } from 'react-native-paper';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const CarouselComponent = ({ photos, activeSlide, setActiveSlide }) => {
  const { colors } = useTheme();

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image
        source={{
          uri: item || 'https://via.placeholder.com/400x300?text=No+Image',
        }}
        style={styles.image}
      />
    </View>
  );

  // UseCallback for onSnapToItem to avoid unnecessary re-renders
  const handleSnapToItem = useCallback(
    (index) => {
      setActiveSlide(index); // Update activeSlide state
    },
    [setActiveSlide]
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        data={photos}
        renderItem={renderCarouselItem}
        width={screenWidth}
        height={screenHeight * 0.5}
        autoPlay={false}
        loop
        onSnapToItem={handleSnapToItem} // Use debounced handler
      />
      <View style={styles.paginationContainer}>
        {photos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  activeSlide === index
                    ? colors.primary
                    : colors.surfaceVariant,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
  },
  carouselItem: {
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.5,
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default CarouselComponent;
