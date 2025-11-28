/**
 * useGameSession - Hook for managing multiplayer game sessions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import {
  GameSession, GamePlayer, GameAction, GameType,
  createGameSession, joinGameSession, getGamePlayers, getActiveSession,
  startGame, advanceRound, endGame, submitAction, getRoundActions,
  updatePlayerScore, subscribeToSession, subscribeToPlayers,
  subscribeToActions, unsubscribe, assignTeamsByGender,
} from '../services/gameSession';
import { useAuth } from '../contexts/AuthContext';

interface UseGameSessionOptions {
  eventId: string;
  gameType: GameType;
  autoJoin?: boolean;
}

export function useGameSession({ eventId, gameType, autoJoin = true }: UseGameSessionOptions) {
  const { user } = useAuth();
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [actions, setActions] = useState<GameAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelsRef = useRef<RealtimeChannel[]>([]);
  const userId = user?.id;
  const isHost = session?.host_id === userId;
  const currentPlayer = players.find(p => p.user_id === userId) || null;

  const cleanup = useCallback(() => {
    channelsRef.current.forEach(ch => unsubscribe(ch));
    channelsRef.current = [];
  }, []);

  useEffect(() => {
    if (!eventId || !userId) return;
    const init = async () => {
      setIsLoading(true);
      try {
        const existing = await getActiveSession(eventId, gameType);
        if (existing) {
          setSession(existing);
          const existingPlayers = await getGamePlayers(existing.id);
          setPlayers(existingPlayers);
          if (autoJoin && !existingPlayers.find(p => p.user_id === userId)) {
            await joinGameSession(existing.id, userId);
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    init();
    return cleanup;
  }, [eventId, gameType, userId, autoJoin, cleanup]);

  useEffect(() => {
    if (!session?.id) return;
    const sessionChannel = subscribeToSession(session.id, setSession);
    const playersChannel = subscribeToPlayers(session.id, setPlayers);
    channelsRef.current = [sessionChannel, playersChannel];
    return cleanup;
  }, [session?.id, cleanup]);

  useEffect(() => {
    if (!session?.id || session.status !== 'playing') return;
    const channel = subscribeToActions(session.id, session.current_round, (action) => {
      setActions(prev => [...prev, action]);
    });
    channelsRef.current.push(channel);
    getRoundActions(session.id, session.current_round).then(setActions);
    return () => unsubscribe(channel);
  }, [session?.id, session?.current_round, session?.status]);

  const createSession = useCallback(async (totalRounds = 5) => {
    if (!userId || !eventId) return;
    setIsLoading(true);
    try {
      const newSession = await createGameSession(eventId, gameType, userId, totalRounds);
      if (newSession) {
        setSession(newSession);
        await joinGameSession(newSession.id, userId);
      }
    } catch (e: any) { setError(e.message); }
    finally { setIsLoading(false); }
  }, [userId, eventId, gameType]);

  const joinSession = useCallback(async () => {
    if (!session?.id || !userId) return;
    await joinGameSession(session.id, userId);
  }, [session?.id, userId]);

  const start = useCallback(async () => {
    if (!session?.id || !isHost) return;
    await startGame(session.id);
  }, [session?.id, isHost]);

  const submitAnswer = useCallback(async (
    actionType: GameAction['action_type'], data: Record<string, any>
  ) => {
    if (!session?.id || !userId) return;
    await submitAction(session.id, userId, session.current_round, actionType, data);
  }, [session?.id, session?.current_round, userId]);

  const nextRound = useCallback(async () => {
    if (!session?.id || !isHost) return;
    setActions([]);
    await advanceRound(session.id, session.current_round);
  }, [session?.id, session?.current_round, isHost]);

  const finish = useCallback(async () => {
    if (!session?.id) return;
    await endGame(session.id);
  }, [session?.id]);

  const addScore = useCallback(async (points: number, chips: number) => {
    if (!session?.id || !userId) return;
    await updatePlayerScore(session.id, userId, points, chips);
  }, [session?.id, userId]);

  const assignTeams = useCallback(async () => {
    if (!session?.id) return;
    await assignTeamsByGender(session.id);
    setPlayers(await getGamePlayers(session.id));
  }, [session?.id]);

  const teams = { men: players.filter(p => p.team === 'men'), women: players.filter(p => p.team === 'women') };

  return {
    session, players, currentPlayer, actions, isHost, isLoading, error,
    createSession, joinSession, start, submitAnswer, nextRound, finish, addScore, assignTeams, teams,
  };
}

export default useGameSession;