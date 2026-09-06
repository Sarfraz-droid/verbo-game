import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface VerboUser {
  id: string;
  name: string;
}

const STORAGE_KEY = 'verbo_user';

export function useAuth() {
  const [user, setUser] = useState<VerboUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const { data: existing, error: fetchError } = await supabase
      .from('verbo_users')
      .select('id, name')
      .eq('name', trimmed)
      .maybeSingle();

    if (fetchError) throw fetchError;

    let verboUser: VerboUser;
    if (existing) {
      verboUser = existing;
    } else {
      const { data: created, error: insertError } = await supabase
        .from('verbo_users')
        .insert({ name: trimmed })
        .select('id, name')
        .single();
      if (insertError) throw insertError;
      verboUser = created;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(verboUser));
    setUser(verboUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
