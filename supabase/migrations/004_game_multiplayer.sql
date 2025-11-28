-- Game Multiplayer Tables
-- Run this in Supabase SQL Editor

-- Game Sessions - Active game instances
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL, -- 'two_truths', 'hot_take', 'never_have_i_ever', 'spark', 'dare_or_drink', 'battle_of_sexes', 'who_said_it'
  host_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'playing', 'finished'
  current_round INTEGER DEFAULT 1,
  total_rounds INTEGER DEFAULT 5,
  config JSONB DEFAULT '{}', -- game-specific config
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

-- Game Players - Players in a game session
CREATE TABLE IF NOT EXISTS game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team TEXT, -- 'men', 'women', or null for non-team games
  score INTEGER DEFAULT 0,
  chips_earned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'joined', -- 'joined', 'ready', 'playing', 'finished'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Game Actions - Individual player actions (answers, votes, choices)
CREATE TABLE IF NOT EXISTS game_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'answer', 'vote', 'choice', 'guess', 'confession'
  action_data JSONB NOT NULL, -- { selectedIndex: 1, value: 'something', etc }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game Prompts/Questions - Store game content (optional, can use hardcoded)
CREATE TABLE IF NOT EXISTS game_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  options JSONB, -- for multiple choice
  metadata JSONB DEFAULT '{}', -- { forTeam: 'men', answer: 2, etc }
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_game_sessions_event ON game_sessions(event_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_game_players_session ON game_players(session_id);
CREATE INDEX idx_game_players_user ON game_players(user_id);
CREATE INDEX idx_game_actions_session ON game_actions(session_id);
CREATE INDEX idx_game_actions_round ON game_actions(session_id, round);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read game sessions for events they attend
CREATE POLICY "Read game sessions" ON game_sessions
  FOR SELECT USING (true);

CREATE POLICY "Create game sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Update own game sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = host_id);

-- Game players policies
CREATE POLICY "Read game players" ON game_players
  FOR SELECT USING (true);

CREATE POLICY "Join games" ON game_players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update own player" ON game_players
  FOR UPDATE USING (auth.uid() = user_id);

-- Game actions policies
CREATE POLICY "Read game actions" ON game_actions
  FOR SELECT USING (true);

CREATE POLICY "Create own actions" ON game_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Prompts are public read
CREATE POLICY "Read prompts" ON game_prompts
  FOR SELECT USING (is_active = true);

-- Enable realtime for game tables
ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE game_players;
ALTER PUBLICATION supabase_realtime ADD TABLE game_actions;

-- Insert some sample prompts for games
INSERT INTO game_prompts (game_type, prompt_text, options, metadata) VALUES
-- Hot Takes
('hot_take', 'Pineapple belongs on pizza', NULL, '{}'),
('hot_take', 'Texting back immediately is a green flag', NULL, '{}'),
('hot_take', 'Long-distance relationships can work', NULL, '{}'),
('hot_take', 'It''s okay to ghost someone after one date', NULL, '{}'),
('hot_take', 'Being friends with an ex is a red flag', NULL, '{}'),
-- Battle of Sexes
('battle_of_sexes', 'What''s the average number of shoes a woman owns?', '["12", "19", "27", "35"]', '{"answer": 2, "forTeam": "men"}'),
('battle_of_sexes', 'What percentage of men cry at movies?', '["15%", "35%", "55%", "75%"]', '{"answer": 1, "forTeam": "women"}'),
('battle_of_sexes', 'What''s the #1 thing women notice first about men?', '["Eyes", "Smile", "Height", "Hands"]', '{"answer": 1, "forTeam": "men"}'),
-- Never Have I Ever
('never_have_i_ever', 'Never have I ever ghosted someone', NULL, '{}'),
('never_have_i_ever', 'Never have I ever stalked an ex on social media', NULL, '{}'),
('never_have_i_ever', 'Never have I ever been on a blind date', NULL, '{}'),
-- Spark questions
('spark', 'What''s one thing you''ve never told anyone on a first date?', NULL, '{}'),
('spark', 'What''s your biggest relationship deal-breaker?', NULL, '{}'),
('spark', 'Describe your perfect lazy Sunday with a partner', NULL, '{}'),
-- Dare or Drink
('dare_or_drink', 'Do your best impression of someone in this room', NULL, '{}'),
('dare_or_drink', 'Share the most embarrassing photo on your phone', NULL, '{}'),
('dare_or_drink', 'Send a flirty text to your most recent contact', NULL, '{}');

