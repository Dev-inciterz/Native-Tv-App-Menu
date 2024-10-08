import React, { useRef, useState } from 'react';
import { View, Animated, Dimensions, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');

const data = [
  { imgUrl: 'https://www.novisign.com/wp-content/uploads/2020/09/tv-menu.png' },
  { imgUrl: 'https://www.novisign.com/wp-content/uploads/2020/09/tv-digital-menu.png' },
  { imgUrl: 'https://www.novisign.com/wp-content/uploads/2020/09/tv-digital-menu-board.png' },
];

const App = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true); // State for loading images

  const renderItem = ({ item }: { item: { imgUrl: string } }) => {
    if (!item) {
      console.error("Item is undefined");
      return null; 
    }

    const opacity = scrollX.interpolate({
      inputRange: [
        (index - 1) * viewportWidth,
        index * viewportWidth,
        (index + 1) * viewportWidth,
      ],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.imageContainer, { opacity }]}>
        {loading && (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        )}
        <Image
          source={{ uri: item.imgUrl }}
          style={styles.image}
          onLoadEnd={() => setLoading(false)} // Hide loader when image is loaded
          onError={() => {
            Alert.alert('Error', 'Failed to load image: ' + item.imgUrl);
            setLoading(false); // Hide loader if image fails to load
          }}
        />
      </Animated.View>
    );
  };

  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      sliderWidth={viewportWidth}
      itemWidth={viewportWidth}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
      )}
      onSnapToItem={(index) => {
        setIndex(index);
        setLoading(true); // Reset loading when snapping to a new item
      }}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: viewportWidth,
    height: 300,
    justifyContent: 'center', // Center the content
    alignItems: 'center',     // Center the content
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
  },
});

export default App;
