import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import styles from "./ProjectCard.module.css";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {/* title link covers the whole card via ::before pseudo-element */}
        <Link to={`/projects/${project.slug}`} className={styles.name}>
          {project.name}
        </Link>
        <div className={styles.badges}>
          {project.status === "active" && (
            <span className={styles.dot} aria-label="active" />
          )}
          {project.status === "experimental" && (
            <span className={styles.badge} data-status="experimental">
              experimental
            </span>
          )}
          {project.status === "fork" && (
            <span className={styles.badge} data-status="fork">
              fork
            </span>
          )}
        </div>
      </div>

      <p className={styles.tagline}>{project.tagline}</p>

      <div className={styles.divider} aria-hidden />

      <div className={styles.links}>
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          Repo ↗
        </a>
        {project.webUrl && (
          <a
            href={project.webUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Web ↗
          </a>
        )}
      </div>
    </div>
  );
}
