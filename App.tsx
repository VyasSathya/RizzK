/**
 * RizzK Mobile App
 * Entry point with navigation
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './src/theme';
import { LandingScreen, SignUpScreen, LoginScreen } from './src/screens';

type Screen = 'landing' | 'signup' | 'login' | 'main';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  useEffect(() => {
    // Initialize app
    const init = async () => {
      // TODO: Load fonts, check auth state, etc.
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return (
          <LandingScreen
            onGetStarted={() => setCurrentScreen('signup')}
            onLogin={() => setCurrentScreen('login')}
          />
        );
      case 'signup':
        return (
          <SignUpScreen
            onContinue={(data) => {
              console.log('Sign up data:', data);
              // TODO: Navigate to photo upload
              setCurrentScreen('landing');
            }}
            onBack={() => setCurrentScreen('landing')}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onLogin={(email, password) => {
              console.log('Login:', email);
              // TODO: Navigate to main app
              setCurrentScreen('landing');
            }}
            onBack={() => setCurrentScreen('landing')}
          />
        );
      default:
        return (
          <LandingScreen
            onGetStarted={() => setCurrentScreen('signup')}
            onLogin={() => setCurrentScreen('login')}
          />
        );
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {renderScreen()}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
