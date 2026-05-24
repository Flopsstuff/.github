import { useParams, Link } from "react-router-dom";
import {
  getProjectBySlug,
  getProjectsByCategory,
  CATEGORY_LABELS,
} from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import styles from "./ProjectDetail.module.css";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return (
      <div className={styles.notFound}>
        <img
          src="/logo.svg"
          alt=""
          className={styles.notFoundLogo}
          width="80"
          height="80"
        />
        <h1 className={styles.notFoundTitle}>No such project (yet).</h1>
        <p className={styles.notFoundSub}>
          {slug ? `"${slug}"` : "That slug"} doesn't match anything here.
        </p>
        <Link to="/" className={styles.notFoundBack}>
          ← Back to all projects
        </Link>
      </div>
    );
  }

  const related = getProjectsByCategory(project.category)
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.back}>
          ← All projects
        </Link>
      </nav>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.category}>
            {CATEGORY_LABELS[project.category]}
          </span>
          {project.status === "active" && (
            <span className={styles.chip} data-status="active">
              <span className={styles.chipDot} aria-hidden />
              active
            </span>
          )}
          {project.status === "experimental" && (
            <span className={styles.chip} data-status="experimental">
              experimental
            </span>
          )}
          {project.status === "fork" && (
            <span className={styles.chip} data-status="fork">
              fork
            </span>
          )}
        </div>
        <h1 className={styles.title}>{project.name}</h1>
        <p className={styles.tagline}>{project.tagline}</p>
      </header>

      <main className={styles.main}>
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

        <p className={styles.description}>{project.description}</p>

        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>
              More in {CATEGORY_LABELS[project.category]}
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
