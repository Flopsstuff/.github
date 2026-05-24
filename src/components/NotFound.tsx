import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

interface Props {
  title?: string;
  message?: string;
}

export default function NotFound({
  title = "Page not found.",
  message = "That path doesn't exist here.",
}: Props) {
  return (
    <div className={styles.root}>
      <img
        src="/logo.svg"
        alt=""
        className={styles.logo}
        width="80"
        height="80"
      />
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.sub}>{message}</p>
      <Link to="/" className={styles.back}>
        ← Back to all projects
      </Link>
    </div>
  );
}
