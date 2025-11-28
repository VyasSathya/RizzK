/**
 * GamePhaseManager - Orchestrates game flow with smooth transitions
 * Phases: intro → playing → waiting → reveal → transition → results
 */

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from '../../shims/reanimated';
import { HapticService } from '../../services/haptics';

export type GamePhase = 'intro' | 'playing' | 'waiting' | 'reveal' | 'transition' | 'results';

interface GameState {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  currentPlayerIndex: number;
  totalPlayers: number;
  timeLeft: number;
  score: number;
  chipsEarned: number;
}

interface GamePhaseContextType extends GameState {
  setPhase: (phase: GamePhase) => void;
  nextRound: () => void;
  nextPlayer: () => void;
  addScore: (points: number) => void;
  addChips: (chips: number) => void;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  isLastRound: boolean;
  isLastPlayer: boolean;
}

const GamePhaseContext = createContext<GamePhaseContextType | null>(null);

export const useGamePhase = () => {
  const ctx = useContext(GamePhaseContext);
  if (!ctx) throw new Error('useGamePhase must be used within GamePhaseManager');
  return ctx;
};

interface GamePhaseManagerProps {
  children: React.ReactNode;
  totalRounds?: number;
  totalPlayers?: number;
  onComplete?: (score: number, chips: number) => void;
}

export const GamePhaseManager: React.FC<GamePhaseManagerProps> = ({
  children,
  totalRounds = 5,
  totalPlayers = 6,
  onComplete,
}) => {
  const [state, setState] = useState<GameState>({
    phase: 'intro',
    currentRound: 1,
    totalRounds,
    currentPlayerIndex: 0,
    totalPlayers,
    timeLeft: 0,
    score: 0,
    chipsEarned: 0,
  });

  const [timerActive, setTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!timerActive || state.timeLeft <= 0) return;
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          setTimerActive(false);
          HapticService.medium();
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, state.timeLeft]);

  const setPhase = useCallback((phase: GamePhase) => {
    if (phase === 'results') HapticService.success();
    else if (phase === 'reveal') HapticService.medium();
    setState(prev => ({ ...prev, phase }));
  }, []);

  const nextRound = useCallback(() => {
    HapticService.medium();
    setState(prev => {
      if (prev.currentRound >= prev.totalRounds) {
        onComplete?.(prev.score, prev.chipsEarned);
        return { ...prev, phase: 'results' };
      }
      return { ...prev, currentRound: prev.currentRound + 1, currentPlayerIndex: 0, phase: 'transition' };
    });
  }, [onComplete]);

  const nextPlayer = useCallback(() => {
    HapticService.light();
    setState(prev => ({ ...prev, currentPlayerIndex: prev.currentPlayerIndex + 1 }));
  }, []);

  const addScore = useCallback((points: number) => {
    setState(prev => ({ ...prev, score: prev.score + points }));
  }, []);

  const addChips = useCallback((chips: number) => {
    setState(prev => ({ ...prev, chipsEarned: prev.chipsEarned + chips }));
  }, []);

  const startTimer = useCallback((seconds: number) => {
    setState(prev => ({ ...prev, timeLeft: seconds }));
    setTimerActive(true);
  }, []);

  const stopTimer = useCallback(() => setTimerActive(false), []);

  const ctx: GamePhaseContextType = {
    ...state,
    setPhase,
    nextRound,
    nextPlayer,
    addScore,
    addChips,
    startTimer,
    stopTimer,
    isLastRound: state.currentRound >= state.totalRounds,
    isLastPlayer: state.currentPlayerIndex >= state.totalPlayers - 1,
  };

  return (
    <GamePhaseContext.Provider value={ctx}>
      <View style={styles.container}>{children}</View>
    </GamePhaseContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default GamePhaseManager;

