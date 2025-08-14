"use client";

import clsx from "clsx";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM untuk Portal
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

// Komponen baru untuk Panel Menu Mobile yang akan di-render di Portal
function MobileMenuPanel({ settings, pathname, open, setOpen }: { settings: Content.SettingsDocument; pathname: string; open: boolean; setOpen: (open: boolean) => void; }) {
  const [isMobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true); // Pastikan kode hanya berjalan di browser
  }, []);

  const menuContent = (
    <>
      {/* Backdrop untuk menu mobile */}
      <div
        className={clsx(
          "fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Panel Menu Mobile yang bergeser */}
      <div
        className={clsx(
          "fixed bottom-0 right-0 top-0 z-[999] flex h-full w-full max-w-sm flex-col p-6 pt-16 transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-[100%]",
        )}
      >
        <button
          aria-label="Close menu"
          aria-expanded={open}
          className="absolute right-4 top-3 block p-2 text-2xl text-slate-100 md:hidden"
          onClick={() => setOpen(false)}
        >
          <MdClose />
        </button>
        <ul className="flex w-full flex-col gap-6 rounded-xl bg-slate-900 p-6 shadow-xl">
          {settings.data.nav_item.map(({ link, label }) => (
            <React.Fragment key={label}>
              {label === "Projects" ? (
                <li className="w-full">
                  <button
                    onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    className="group relative flex w-full items-center justify-between overflow-hidden rounded px-3 text-3xl font-bold text-slate-100"
                  >
                    <span className="relative">Projects</span>
                    <MdArrowDropDown className={clsx("transition-transform duration-300", isMobileDropdownOpen && "rotate-180")} />
                  </button>
                  <div className={clsx("overflow-hidden transition-all duration-300 ease-in-out", isMobileDropdownOpen ? "max-h-96" : "max-h-0")}>
                    <div className="mt-4 flex flex-col items-start rounded-lg bg-slate-800 p-4 pl-6">
                      {projectCategories.map((category) => (
                        <Link
                          key={category.uid}
                          href={`/projects/${category.uid}`}
                          onClick={() => setOpen(false)}
                          className="block w-full py-2 text-left text-lg text-slate-300 hover:text-slate-100"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li className="w-full">
                  <PrismicNextLink
                    className={clsx("group relative block overflow-hidden rounded px-3 text-3xl font-bold text-slate-100 ")}
                    field={link}
                    onClick={() => setOpen(false)}
                    aria-current={pathname.includes(asLink(link) as string) ? "page" : undefined}
                  >
                    <span className={clsx("absolute inset-0 z-0 h-full translate-y-12 rounded bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0", pathname.includes(asLink(link) as string) ? "translate-y-6" : "translate-y-18")} />
                    <span className="relative">{label}</span>
                  </PrismicNextLink>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(menuContent, document.body);
  } else {
    return null;
  }
}

export default function NavBar({
  settings,
}: {
  settings: Content.SettingsDocument;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      {/* Navbar utama untuk Desktop */}
      <div className="mx-auto max-w-7xl">
        <ul className="flex flex-col justify-between px-4 py-2 md:flex-row md:items-center">
          <div className="flex items-center justify-between">
            <NameLogo name={settings.data.name} />
            <button
              aria-expanded={open}
              aria-label="Open menu"
              className="block p-2 text-2xl text-slate-100 md:hidden"
              onClick={() => setOpen(true)}
            >
              <MdMenu />
            </button>
          </div>
          <DesktopMenu settings={settings} pathname={pathname} />
        </ul>
      </div>

      {/* Memanggil komponen Portal untuk menu mobile */}
      <MobileMenuPanel settings={settings} pathname={pathname} open={open} setOpen={setOpen} />
    </nav>
  );
}

function NameLogo({ name }: { name: KeyTextField }) {
  return (
    <Link
      href="/"
      aria-label="Home page"
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
                className="group relative flex items-center gap-1 overflow-hidden rounded px-3 py-1 text-base font-bold text-slate-100"
              >
                <span className="relative">Projects</span>
                <MdArrowDropDown className={clsx("transition-transform", isDropdownOpen && "rotate-180")} />
              </button>
              <div
                className={clsx(
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
                  "group relative block overflow-hidden rounded px-3 py-1 text-base font-bold text-slate-100",
                )}
                field={link}
                aria-current={pathname.includes(asLink(link) as string) ? "page" : undefined}
              >
                <span className={clsx("absolute inset-0 z-0 h-full rounded bg-yellow-300 transition-transform  duration-300 ease-in-out group-hover:translate-y-0", pathname.includes(asLink(link) as string) ? "translate-y-6" : "translate-y-8")} />
                <span className="relative">{label}</span>
              </PrismicNextLink>
            </li>
          )}
          {index < settings.data.nav_item.length - 1 && (
            <span className="hidden text-4xl font-thin leading-[0] text-slate-400 md:inline" aria-hidden="true">
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
