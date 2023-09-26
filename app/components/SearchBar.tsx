"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
      <input
        className="rounded-full  mr-3 p-2 w-96"
        type="text"
        placeholder="State, city, zip code or salon name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <button
        className="rounded-full bg-orange-600  text-white  "
        onClick={() => {
          if (searchTerm === "") return;
          router.push(`/search?searchTerm=${searchTerm}`);
          setSearchTerm("");
        }}
      >
        <BiSearch size={48} />
      </button>
    </div>
  );
};

export default SearchBar;
