import { useState, useEffect, useCallback } from 'react';
import type { EmailSession } from '@workspace/api-client-react';

const SESSION_KEY = 'khmer_temp_email_session';

export function useEmailSession() {
  const [session, setSession] = useState<EmailSession | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as EmailSession;
        // Check if expired
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse stored session", e);
    }
    return null;
  });

  const saveSession = useCallback((newSession: EmailSession | null) => {
    setSession(newSession);
    if (newSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const restoreSession = useCallback((sessionId: string) => {
    const restoredSession: EmailSession = {
      sessionId,
      email: "ស្ដារពីមុន...",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };
    saveSession(restoredSession);
    return restoredSession;
  }, [saveSession]);

  return { session, saveSession, restoreSession };
}