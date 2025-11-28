/**
 * ChatScreen - Chat with a match
 * Simple chat interface
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Avatar, Icon } from '../components/common';
import { colors, spacing, borderRadius , fonts } from '../theme';
import { HapticService } from '../services/haptics';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

interface ChatScreenProps {
  matchId: string;
  matchName: string;
  matchGender?: 'male' | 'female';
  onBack: () => void;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'Hey! Great meeting you last night', sender: 'them', timestamp: '10:30 AM' },
  { id: '2', text: 'You too! That two truths game was hilarious', sender: 'me', timestamp: '10:32 AM' },
  { id: '3', text: 'I still can\'t believe you\'ve never had coffee!', sender: 'them', timestamp: '10:33 AM' },
];

export const ChatScreen: React.FC<ChatScreenProps> = ({
  matchId,
  matchName = 'Maya',
  matchGender = 'female',
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    HapticService.light();

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color={colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Avatar name={matchName} size={36} gender={matchGender} />
            <Text style={styles.headerName}>{matchName}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={10}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <Animated.View
                key={message.id}
                entering={FadeInDown.delay(index * 50).duration(300)}
                style={[
                  styles.messageBubble,
                  message.sender === 'me' ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.timestamp}>{message.timestamp}</Text>
              </Animated.View>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <LinearGradient
                colors={inputText.trim() ? [colors.primary, colors.primaryLight] : ['#333', '#333']}
                style={styles.sendButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="send" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 5 },
  backText: { color: colors.primary, fontSize: 16 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerName: { fontSize: 18, fontWeight: '600', color: colors.text },
  headerSpacer: { width: 60 },
  keyboardView: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: spacing.lg, gap: 12 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: borderRadius.lg },
  myMessage: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.cardBorder, borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, color: colors.text, lineHeight: 22 },
  timestamp: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md, gap: 10, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  input: { flex: 1, backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: borderRadius.lg, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: colors.text, maxHeight: 100 },
  sendButton: { width: 44, height: 44 },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

export default ChatScreen;



