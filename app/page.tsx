"use client";

import { Inter } from "@next/font/google";
import Header from "./components/Header";
import BarberCard from "./components/BarberCard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Header /> {/* CARDS */}
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        <BarberCard />
      </div>
      {/* CARDS */}
    </main>
  );
}
