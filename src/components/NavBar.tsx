"use client";

import clsx from "clsx";
import React, { useState, useEffect, useRef } from "react";
import { Content, KeyTextField, asLink } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import { MdMenu, MdClose, MdArrowDropDown } from "react-icons/md";
import Button from "./Button";
import { usePathname } from "next/navigation";

// Daftar kategori proyek Anda
const projectCategories = [
  { name: "Digital Marketing", uid: "digital-marketing" },
  { name: "Software Development", uid: "software-development" },
  { name: "Graphic Designer", uid: "graphic-designer" },
  { name: "Project & Program Management", uid: "project-program-management" },
];

export default function NavBar({
  settings,
}: {
  settings: Content.SettingsDocument;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="relative z-50">
      {/* Navbar utama untuk Desktop */}
      <div className="mx-auto max-w-7xl">
        {/* Latar belakang putih dihapus dari sini agar efek glass dari parent terlihat */}
        <ul className="flex flex-col justify-between px-4 py-2 md:flex-row md:items-center">
          <div className="flex items-center justify-between">
            <NameLogo name={settings.data.name} />
            <button
              aria-expanded={open}
              aria-label="Open menu"
              // Warna ikon diubah menjadi terang
              className="block p-2 text-2xl text-slate-100 md:hidden"
              onClick={() => setOpen(true)}
            >
              <MdMenu />
            </button>
          </div>
          <DesktopMenu settings={settings} pathname={pathname} />
        </ul>
      </div>

      {/* Panel Menu Mobile (dipisahkan dari navbar utama) */}
      <div
        className={clsx(
          // Latar belakang diubah menjadi gelap dan transparan
          "fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-end gap-4 bg-slate-900/90 backdrop-blur-xl pr-4 pt-14 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-[100%]",
        )}
      >
        <button
          aria-label="Close menu"
          aria-expanded={open}
          // Warna ikon diubah menjadi terang
          className="fixed right-4 top-3 block p-2 text-2xl text-slate-100 md:hidden "
          onClick={() => setOpen(false)}
        >
          <MdClose />
        </button>
        <MobileMenu settings={settings} pathname={pathname} setOpen={setOpen} />
      </div>
    </nav>
  );
}

function NameLogo({ name }: { name: KeyTextField }) {
  return (
    <Link
      href="/"
      aria-label="Home page"
      // Warna teks diubah menjadi terang
      className="text-xl font-extrabold tracking-tighter text-slate-100"
    >
      {name}
    </Link>
  );
}

function DesktopMenu({
  settings,
  pathname,
}: {
  settings: Content.SettingsDocument;
  pathname: string;
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50 hidden flex-row items-center gap-1 bg-transparent py-0 md:flex">
      {settings.data.nav_item.map(({ link, label }, index) => (
        <React.Fragment key={label}>
          {label === "Projects" ? (
            <li ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                // Warna teks diubah menjadi terang
                className="group relative flex items-center gap-1 overflow-hidden rounded px-3 py-1 text-base font-bold text-slate-100"
              >
                <span className="relative">Projects</span>
                <MdArrowDropDown className={clsx("transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              <div
                className={clsx(
                  // Latar belakang dropdown diubah menjadi gelap dan transparan
                  "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 origin-top rounded-md bg-slate-800/90 backdrop-blur-sm shadow-lg ring-1 ring-white/10 transition-all duration-300",
                  isDropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                )}
              >
                <div className="py-1">
                  {projectCategories.map((category) => (
                    <Link
                      key={category.uid}
                      href={`/projects/${category.uid}`}
                      onClick={() => setDropdownOpen(false)}
                      // Warna teks dropdown diubah menjadi terang
                      className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/80"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ) : (
            <li>
              <PrismicNextLink
                className={clsx(
                  // Warna teks diubah menjadi terang
                  "group relative block overflow-hidden rounded px-3 py-1 text-base font-bold text-slate-100",
                )}
                field={link}
                aria-current={
                  pathname.includes(asLink(link) as string) ? "page" : undefined
                }
              >
                <span
                  className={clsx(
                    "absolute inset-0 z-0 h-full rounded bg-yellow-300 transition-transform  duration-300 ease-in-out group-hover:translate-y-0",
                    pathname.includes(asLink(link) as string)
                      ? "translate-y-6"
                      : "translate-y-8",
                  )}
                />
                <span className="relative">{label}</span>
              </PrismicNextLink>
            </li>
          )}
          {index < settings.data.nav_item.length - 1 && (
            <span
              className="hidden text-4xl font-thin leading-[0] text-slate-400 md:inline"
              aria-hidden="true"
            >
              /
            </span>
          )}
        </React.Fragment>
      ))}
      <li>
        <Button
          linkField={settings.data.cta_link}
          label={settings.data.cta_label}
          className="ml-3"
        />
      </li>
    </div>
  );
}

function MobileMenu({
  settings,
  pathname,
  setOpen
}: {
  settings: Content.SettingsDocument;
  pathname: string;
  setOpen: (value: boolean) => void;
}) {
  const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  return (
    <ul className="flex flex-col items-end gap-4 w-full">
      {settings.data.nav_item.map(({ link, label }) => (
        <React.Fragment key={label}>
          {label === "Projects" ? (
            <li className="w-full text-right">
              <button
                onClick={() => setMobileDropdownOpen((prev) => !prev)}
                // Warna teks diubah menjadi terang
                className="group relative flex items-center justify-end w-full overflow-hidden rounded px-3 text-3xl font-bold text-slate-100"
              >
                <span className="relative">Projects</span>
                <MdArrowDropDown className={clsx("transition-transform duration-300", isMobileDropdownOpen && "rotate-180")} />
              </button>
              <div className={clsx("overflow-hidden transition-all duration-300 ease-in-out", isMobileDropdownOpen ? "max-h-96" : "max-h-0")}>
                {/* Latar belakang dropdown diubah menjadi gelap */}
                <div className="mt-2 flex flex-col items-end pr-4 bg-slate-800/50 rounded-lg py-2">
                  {projectCategories.map((category) => (
                    <Link
                      key={category.uid}
                      href={`/projects/${category.uid}`}
                      onClick={() => setOpen(false)}
                      // Warna teks dropdown diubah menjadi terang
                      className="block py-2 text-lg text-slate-300 hover:text-slate-100"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ) : (
            <li className="first:mt-8">
              <PrismicNextLink
                className={clsx(
                  // Warna teks diubah menjadi terang
                  "group relative block overflow-hidden rounded px-3 text-3xl font-bold text-slate-100 ",
                )}
                field={link}
                onClick={() => setOpen(false)}
                aria-current={
                  pathname.includes(asLink(link) as string)
                    ? "page"
                    : undefined
                }
              >
                <span
                  className={clsx(
                    "absolute inset-0 z-0 h-full translate-y-12 rounded bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
                    pathname.includes(asLink(link) as string)
                      ? "translate-y-6"
                      : "translate-y-18",
                  )}
                />
                <span className="relative">{label}</span>
              </PrismicNextLink>
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
}
