"use client";

import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <div className="h-64 bg-gradient-to-r from-[#2ecc71] via-[#a9df85] to-[#f39c12] p-2">
      <div className="text-center mt-10">
        <h1 className="text-white text-5xl font-bold mb-2">
          Find your baber for any occasion
        </h1>
        <SearchBar />
      </div>
    </div>
  );
};

export default Header;
