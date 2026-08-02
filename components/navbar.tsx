"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Platform", "#platform"],
  ["Proof", "#demo"],
  ["Signals", "#signals"],
  ["About", "#about"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="floating-nav" aria-label="Main navigation">
        <a
          className="brand focus-ring"
          href="#top"
          aria-label="Autonomous Giving Incorporated, home"
        >
          AGI<span className="brand-mark">/</span>
        </a>
        <div className="desktop-links">
          {links.map(([label, href]) => (
            <a className="nav-link focus-ring" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <a className="nav-action focus-ring" href="#contact">
          Request demo
        </a>
        <button
          className="menu-toggle focus-ring"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
        </button>
        {open ? (
          <div className="mobile-menu" id="mobile-navigation">
            {links.map(([label, href]) => (
              <a
                className="nav-link focus-ring"
                href={href}
                key={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              className="nav-link focus-ring"
              href="#contact"
              onClick={() => setOpen(false)}
            >
              Request demo
            </a>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
