/**
 * RizzK Game Configurations
 * The 7 interactive games
 */

import { GameConfig } from '../types';

export const GAMES: Record<string, GameConfig> = {
  spark: {
    id: 'spark',
    name: 'Spark',
    description: 'Vote on who you\'d want to be stranded with on a deserted island',
    icon: '⚡',
    minPlayers: 5,
    maxPlayers: 7,
    rounds: 7,
    roundDuration: 30,
  },
  dare: {
    id: 'dare',
    name: 'Dare or Drink',
    description: 'Choose dare or drink for spicy prompts',
    icon: '🍺',
    minPlayers: 5,
    maxPlayers: 7,
    rounds: 7,
    roundDuration: 45,
  },
  hottake: {
    id: 'hottake',
    name: 'Hot Take',
    description: 'Vote on controversial opinions',
    icon: '🔥',
    minPlayers: 5,
    maxPlayers: 7,
    rounds: 7,
    roundDuration: 30,
  },
  never: {
    id: 'never',
    name: 'Never Have I Ever',
    description: 'Reveal your experiences',
    icon: '🙈',
    minPlayers: 5,
    maxPlayers: 7,
    rounds: 7,
    roundDuration: 30,
  },
  battle: {
    id: 'battle',
    name: 'Battle of the Sexes',
    description: 'Team trivia competition',
    icon: '⚔️',
    minPlayers: 6,
    maxPlayers: 7,
    rounds: 10,
    roundDuration: 20,
  },
  whosaid: {
    id: 'whosaid',
    name: 'Who Said It?',
    description: 'Match quotes to players',
    icon: '💬',
    minPlayers: 5,
    maxPlayers: 7,
    rounds: 7,
    roundDuration: 30,
  },
  twotruths: {
    id: 'twotruths',
    name: 'Two Truths and a Lie',
    description: 'Guess the lie',
    icon: '🤥',
    minPlayers: 5,
    maxPlayers: 7,
    rounds: 7,
    roundDuration: 45,
  },
};

export const GAME_ORDER: string[] = [
  'spark',
  'dare',
  'hottake',
  'never',
  'battle',
  'whosaid',
  'twotruths',
];

