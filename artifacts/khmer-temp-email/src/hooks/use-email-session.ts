import { useState, useEffect, useCallback } from 'react';
import type { EmailSession } from '@workspace/api-client-react';

const SESSION_KEY = 'khmer_temp_email_session';
const HISTORY_KEY = 'khmer_temp_email_history';

export interface EmailHistoryItem {
  sessionId: string;
  email: string;
  createdAt: string;
}

function loadHistory(): EmailHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistoryToStorage(history: EmailHistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function useEmailSession() {
  const [session, setSession] = useState<EmailSession | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        return JSON.parse(stored) as EmailSession;
      }
    } catch (e) {
      console.error("Failed to parse stored session", e);
    }
    return null;
  });

  const [history, setHistory] = useState<EmailHistoryItem[]>(() => loadHistory());

  const saveSession = useCallback((newSession: EmailSession | null) => {
    setSession(newSession);
    if (newSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setHistory(prev => {
        const exists = prev.some(h => h.sessionId === newSession.sessionId);
        if (exists) return prev;
        const updated = [
          { sessionId: newSession.sessionId, email: newSession.email, createdAt: new Date().toISOString() },
          ...prev,
        ];
        saveHistoryToStorage(updated);
        return updated;
      });
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const switchSession = useCallback((item: EmailHistoryItem) => {
    const restored: EmailSession = {
      sessionId: item.sessionId,
      email: item.email,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setSession(restored);
    localStorage.setItem(SESSION_KEY, JSON.stringify(restored));
  }, []);

  const removeFromHistory = useCallback((sessionId: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.sessionId !== sessionId);
      saveHistoryToStorage(updated);
      return updated;
    });
    setSession(prev => {
      if (prev?.sessionId === sessionId) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return prev;
    });
  }, []);

  return { session, saveSession, switchSession, removeFromHistory, history };
}
