import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Back to home">
          <img src="/logo.svg" alt="FS" className={styles.logo} width="24" height="24" />
          <span className={styles.name}>Flopsstuff</span>
        </Link>
        <div className={styles.links}>
          <a
            href="https://github.com/Flopsstuff"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
          <span className={styles.sep} aria-hidden>·</span>
          <span className={styles.copy}>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
