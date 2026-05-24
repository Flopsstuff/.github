import { CATEGORY_LABELS, CATEGORY_ORDER, getProjectsByCategory } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-label="Introduction">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Open-source experiments<br />
            and <span className={styles.highlight}>tools</span>.
          </h1>
          <p className={styles.heroSubtitle}>
            AI developer tooling, agent orchestration,
            and a few hardware side quests.
          </p>
          <div className={styles.heroCtas}>
            <a href="#projects" className={styles.ctaPrimary}>
              Browse projects →
            </a>
            <a
              href="https://github.com/Flopsstuff"
              target="_blank"
              rel="noreferrer"
              className={styles.ctaGhost}
            >
              GitHub ↗
            </a>
          </div>
        </div>
        <div className={styles.heroDecor} aria-hidden>
          <img src="/logo.svg" alt="" className={styles.heroLogo} />
        </div>
      </section>

      <main id="projects" className={styles.main}>
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
    </div>
  );
}
