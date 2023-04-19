import Link from "next/link";
import React from "react";
import AuthModal from "./AuthModal";

const Navbar = () => {
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
          <AuthModal isSignin={true} />
          <AuthModal isSignin={false} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
