"use client";
// @flow strict
// Navbar: one row on desktop (logo · links · theme switcher, all vertically centred),
// and a menu button with a drop-down list on tablets and phones.
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import ThemeSwitcher from "./helper/theme-switcher";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#terminal", label: ">_ Terminal", mono: true },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#education", label: "Education" },
  { href: "/#posts", label: "Posts" },
  { href: "/#videos", label: "Videos" },
];

function NavLink({ link, onClick }) {
  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={`block whitespace-nowrap rounded-md px-3 py-2 text-sm uppercase no-underline outline-none transition-colors duration-300 hover:text-accent hover:no-underline focus-visible:ring-2 focus-visible:ring-accent ${
        link.mono ? "font-mono text-accent" : "text-white"
      }`}
    >
      {link.label}
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  // close the phone menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="relative z-[60] bg-transparent">
      <div className="flex items-center justify-between gap-4 py-5">
        <Link href="/" className="shrink-0 whitespace-nowrap text-2xl font-bold text-accent lg:text-3xl">
          Sachin Jadhav
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          <ul className="flex items-center">
            {LINKS.map((link) => (
              <li key={link.href}>
                <NavLink link={link} />
              </li>
            ))}
          </ul>
          <ThemeSwitcher />
        </div>

        {/* tablet + phone */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="m-btn rounded-md border border-line p-2 text-white transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            {open ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <ul
          id="mobile-menu"
          className="absolute left-0 right-0 top-full grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface/95 p-3 shadow-xl shadow-black/40 backdrop-blur lg:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <NavLink link={link} onClick={() => setOpen(false)} />
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
