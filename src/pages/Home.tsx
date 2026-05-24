import { Link } from "react-router-dom";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  getProjectsByCategory,
} from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Link to="/" className={styles.logoLink}>
          <img src="/favicon.svg" alt="" className={styles.logo} />
        </Link>
        <h1 className={styles.title}>Flopsstuff</h1>
        <p className={styles.subtitle}>
          Open-source experiments and tools — AI developer tooling, agent
          orchestration, and a few hardware side quests.
        </p>
      </header>

      <main className={styles.main}>
        {CATEGORY_ORDER.map((category) => {
          const items = getProjectsByCategory(category);
          if (items.length === 0) return null;
          return (
            <section key={category} className={styles.section}>
              <h2 className={styles.categoryTitle}>
                {CATEGORY_LABELS[category]}
              </h2>
              <div className={styles.grid}>
                {items.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/Flopsstuff"
          target="_blank"
          rel="noreferrer"
        >
          github.com/Flopsstuff
        </a>
      </footer>
    </div>
  );
}
