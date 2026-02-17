import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { View, Text, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';

// REMOVE "export default" here
function WelcomeHeader() {
  return (
    <View>
      <Text>My App</Text>
    </View>
  );
}

export default function HomeScreen() {

  const [count, setCount] = useState(0);

  useEffect(() => {
      if (count === 10) {
        Alert.alert("You have recieved 10 points.")
      } else if (count === 20) {
        Alert.alert("You have recieved 20 points.")
      } else if (count === 30) {
        Alert.alert("You have  recieved 30 points.")
      }
  }, [count]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      <WelcomeHeader />

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Current Count: {count}</ThemedText>
        <Button
          title="Tap to Count!"
          onPress={() => setCount(count + 1)}
        />
        <Button
          title="Tap to Refresh!"
          onPress={() => setCount(0)}
        />
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hello World!</ThemedText>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
