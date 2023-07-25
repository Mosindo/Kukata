"use client";

import { useState, createContext, useEffect } from "react";
import { USERCATEGORY } from "@prisma/client";
import { supabase } from "../../lib/supabase";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: USERCATEGORY;
}
interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: USERCATEGORY;
}
interface Stylist {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  role: USERCATEGORY;
}
interface State {
  data: Customer | Owner | Stylist | null;
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
      console.log("session!!! :", session);

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
        error: error.response.data.errorMessage,
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
