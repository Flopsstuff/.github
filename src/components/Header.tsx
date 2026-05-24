import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function Header() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Flopsstuff home">
          <img
            src="/logo.svg"
            alt="FS"
            className={styles.logo}
            width="36"
            height="36"
          />
          <span className={styles.wordmark}>Flopsstuff</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink to="/" className={styles.navLink} end>
            Projects
          </NavLink>
          <a
            href="https://github.com/Flopsstuff"
            target="_blank"
            rel="noreferrer"
            className={styles.navLink}
          >
            GitHub ↗
          </a>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </nav>
      </div>
    </header>
  );
}
