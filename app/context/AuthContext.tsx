"use client";

import { useState, createContext } from "react";
interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface State {
  data: Customer | null;
  loading: boolean;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  data: null,
  loading: true,
  error: null,
  setAuthState: () => ({}),
});

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [AuthState, setAuthState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  return (
    <AuthenticationContext.Provider value={{ ...AuthState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthContext;
