import axios from "axios";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const useAuth = () => {
  const { error, setAuthState } = useContext(AuthenticationContext);
  const router = useRouter();

  const signin = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const { data, error: errorAuth } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (errorAuth) {
        console.error("Error creating Supabase user:", errorAuth);
        throw errorAuth;
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        {
          email,
          password,
          data,
        }
      );

      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
      router.refresh();
      handleClose();
      router.refresh();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };
  const signup = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phoneNumber,
      role,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phoneNumber: string;
      role: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const { data, error: errorAuth } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/auth/callback",
          data: {
            firstName,
            lastName,
          },
        },
      });
      if (errorAuth) {
        console.error("Error creating Supabase user:", errorAuth);
        throw errorAuth;
      }
      router.refresh();
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          email,
          password,
          firstName,
          lastName,
          city,
          phoneNumber,
          role,
          data,
        }
      );

      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });

      if (!error) {
        handleClose();
      }
      router.refresh();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  const signout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };

  return {
    signin,
    signup,
    signout,
  };
};

export default useAuth;
