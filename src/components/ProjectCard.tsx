import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import styles from "./ProjectCard.module.css";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link to={`/projects/${project.slug}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.name}>{project.name}</span>
        {project.status === "fork" && (
          <span className={styles.badge} data-status="fork">fork</span>
        )}
        {project.status === "experimental" && (
          <span className={styles.badge} data-status="experimental">experimental</span>
        )}
      </div>
      <p className={styles.tagline}>{project.tagline}</p>
      <div className={styles.links}>
        <span className={styles.link}>Repo ↗</span>
        {project.webUrl && <span className={styles.link}>Web ↗</span>}
      </div>
    </Link>
  );
}
