/**
 * RizzK Mobile App
 * Entry point
 */

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // TODO: Add actual font files to assets/fonts/
        // await Font.loadAsync({
        //   'Cinzel-Bold': require('./assets/fonts/Cinzel-Bold.ttf'),
        //   'Raleway-Regular': require('./assets/fonts/Raleway-Regular.ttf'),
        // });

        // For now, just mark as loaded (will use system fonts)
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue anyway with system fonts
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RizzK</Text>
      <Text style={styles.subtitle}>Take the Rizk. Meet through games, not swipes.</Text>
      <Text style={styles.status}>✅ Project initialized successfully!</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  status: {
    fontSize: 14,
    color: colors.success,
    marginTop: 20,
  },
});
