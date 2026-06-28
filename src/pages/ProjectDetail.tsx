import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getProjectBySlug,
  getProjectsByCategory,
  CATEGORY_LABELS,
} from "../data/projects";
import { getProjectContent } from "../content";
import NotFound from "../components/NotFound";
import ProjectCard from "../components/ProjectCard";
import styles from "./ProjectDetail.module.css";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return (
      <NotFound
        title="No such project (yet)."
        message={`"${slug ?? "That slug"}" doesn't match anything here.`}
      />
    );
  }

  const body = getProjectContent(project.slug);

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
          {project.npmUrl && (
            <a
              href={project.npmUrl}
              target="_blank"
              rel="noreferrer"
              className={`${styles.linkBtn} ${styles.linkBtnSecondary}`}
            >
              npm ↗
            </a>
          )}
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

        {body && (
          <article className={styles.body}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node: _node, ...props }) => (
                  <a target="_blank" rel="noreferrer" {...props} />
                ),
              }}
            >
              {body}
            </ReactMarkdown>
          </article>
        )}

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
