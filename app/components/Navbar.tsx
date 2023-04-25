"use client";

import Link from "next/link";
import React, { useContext } from "react";
import AuthModal from "./AuthModal";
import { AuthenticationContext } from "../context/AuthContext";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { data, loading } = useContext(AuthenticationContext);
  const { signout } = useAuth();
  console.log(data);
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link
        href="/"
        className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#11998e]  to-[#38ef7d] text-2xl"
      >
        Kukata
      </Link>
      <div>
        <div className="flex">
          {loading ? null : (
            <div className="flex">
              {data ? (
                <button
                  className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
                  onClick={signout}
                >
                  Sign out
                </button>
              ) : (
                <>
                  <AuthModal isSignin={true} />
                  <AuthModal isSignin={false} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
