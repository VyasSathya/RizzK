/**
 * RizzK Mobile App - Entry point with fonts
 */

import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Raleway_400Regular, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold } from '@expo-google-fonts/raleway';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from './src/theme';
import { LandingScreen, SignUpScreen, LoginScreen, OnboardingScreen, PhotoUploadScreen, PersonalityQuizScreen, EventsScreen, EventDetailScreen, GameLobbyScreen, GameSelectScreen, MatchSelectionScreen, MatchesScreen, ChatScreen, SparkGameScreen, HotTakeGameScreen, TwoTruthsGameScreen, NeverHaveIEverScreen, DareOrDrinkScreen, BattleOfSexesScreen, WhoSaidItScreen } from './src/screens';
import { GameType } from './src/screens/GameSelectScreen';

SplashScreen.preventAutoHideAsync();

type Screen = 'landing' | 'onboarding' | 'signup' | 'login' | 'photos' | 'quiz' | 'events' | 'eventDetail' | 'lobby' | 'gameSelect' | 'spark' | 'hottake' | 'twotruths' | 'never' | 'dare' | 'battle' | 'whosaid' | 'matchSelection' | 'matches' | 'chat';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedEventId, setSelectedEventId] = useState<string>('1');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('1');

  const [fontsLoaded] = useFonts({ Raleway_400Regular, Raleway_500Medium, Raleway_600SemiBold, Raleway_700Bold });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) { await SplashScreen.hideAsync(); }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const handleGameSelect = (game: GameType) => { setCurrentScreen(game as Screen); };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing': return <LandingScreen onGetStarted={() => setCurrentScreen('onboarding')} onLogin={() => setCurrentScreen('login')} />;
      case 'onboarding': return <OnboardingScreen onComplete={() => setCurrentScreen('signup')} onSkip={() => setCurrentScreen('signup')} />;
      case 'signup': return <SignUpScreen onContinue={() => setCurrentScreen('photos')} onBack={() => setCurrentScreen('landing')} />;
      case 'login': return <LoginScreen onLogin={() => setCurrentScreen('events')} onBack={() => setCurrentScreen('landing')} />;
      case 'photos': return <PhotoUploadScreen onContinue={() => setCurrentScreen('quiz')} onBack={() => setCurrentScreen('signup')} />;
      case 'quiz': return <PersonalityQuizScreen onComplete={() => setCurrentScreen('events')} />;
      case 'events': return <EventsScreen onEventPress={(id) => { setSelectedEventId(id); setCurrentScreen('eventDetail'); }} />;
      case 'eventDetail': return <EventDetailScreen eventId={selectedEventId} onRegister={() => setCurrentScreen('lobby')} onBack={() => setCurrentScreen('events')} />;
      case 'lobby': return <GameLobbyScreen players={[]} onGameStart={() => setCurrentScreen('gameSelect')} />;
      case 'gameSelect': return <GameSelectScreen onGameSelect={handleGameSelect} onBack={() => setCurrentScreen('lobby')} />;
      case 'spark': return <SparkGameScreen onComplete={() => setCurrentScreen('gameSelect')} onBack={() => setCurrentScreen('gameSelect')} />;
      case 'hottake': return <HotTakeGameScreen onComplete={() => setCurrentScreen('gameSelect')} onBack={() => setCurrentScreen('gameSelect')} />;
      case 'twotruths': return <TwoTruthsGameScreen onComplete={() => setCurrentScreen('gameSelect')} onBack={() => setCurrentScreen('gameSelect')} />;
      case 'never': return <NeverHaveIEverScreen onComplete={() => setCurrentScreen('gameSelect')} onBack={() => setCurrentScreen('gameSelect')} />;
      case 'dare': return <DareOrDrinkScreen onComplete={() => setCurrentScreen('gameSelect')} onBack={() => setCurrentScreen('gameSelect')} />;
      case 'battle': return <BattleOfSexesScreen onComplete={() => setCurrentScreen('gameSelect')} onBack={() => setCurrentScreen('gameSelect')} />;
      case 'whosaid': return <WhoSaidItScreen onComplete={() => setCurrentScreen('gameSelect')} onBack={() => setCurrentScreen('gameSelect')} />;
      case 'matchSelection': return <MatchSelectionScreen onSubmit={() => setCurrentScreen('matches')} />;
      case 'matches': return <MatchesScreen onMatchPress={(id) => { setSelectedMatchId(id); setCurrentScreen('chat'); }} />;
      case 'chat': return <ChatScreen matchId={selectedMatchId} matchName="Maya" matchAvatar="M" onBack={() => setCurrentScreen('matches')} />;
      default: return <LandingScreen onGetStarted={() => setCurrentScreen('onboarding')} onLogin={() => setCurrentScreen('login')} />;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      {renderScreen()}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
});
