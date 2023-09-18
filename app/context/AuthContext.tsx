"use client";

import { useState, createContext, useEffect } from "react";

import { User } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../lib/database.types";

interface State {
  data: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  data: null,
  loading: false,
  error: null,
  setAuthState: () => ({}),
});

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [AuthState, setAuthState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });
  const supabase = createClientComponentClient<Database>();
  const fetchUser = async () => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }

      setAuthState({
        data: session.user as any,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response?.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <AuthenticationContext.Provider value={{ ...AuthState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthContext;
