import { useParams, Link, Navigate } from "react-router-dom";
import { getProjectBySlug, CATEGORY_LABELS } from "../data/projects";
import styles from "./ProjectDetail.module.css";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) return <Navigate to="/" replace />;

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.back}>
          ← All projects
        </Link>
      </nav>

      <header className={styles.header}>
        <span className={styles.category}>
          {CATEGORY_LABELS[project.category]}
        </span>
        <h1 className={styles.title}>{project.name}</h1>
        <p className={styles.tagline}>{project.tagline}</p>
      </header>

      <main className={styles.main}>
        <p className={styles.description}>{project.description}</p>

        <div className={styles.links}>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.linkBtn}
          >
            View on GitHub ↗
          </a>
          {project.webUrl && (
            <a
              href={project.webUrl}
              target="_blank"
              rel="noreferrer"
              className={`${styles.linkBtn} ${styles.linkBtnSecondary}`}
            >
              Website ↗
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
