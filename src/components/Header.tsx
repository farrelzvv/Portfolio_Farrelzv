import React from "react";
import { createClient } from "@/prismicio";
import NavBar from "@/components/NavBar";

export default async function Header() {
  const client = createClient();
  const settings = await client.getSingle("settings");
  
  return (
    // INI BAGIAN KUNCINYA: Semua kelas untuk efek kaca ada di sini
    <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4 rounded-xl bg-slate-900/50 backdrop-blur-md border-b border-slate-500/20">
      <NavBar settings={settings} />
    </header>
  );
}
