import styles from "./LoadingSkeleton.module.css";

export default function LoadingSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={`skeleton ${styles.icon}`} />
        <div className={styles.headerText}>
          <div className={`skeleton ${styles.line} ${styles.lineWide}`} />
          <div className={`skeleton ${styles.line} ${styles.lineMed}`} />
        </div>
      </div>
      <div className={styles.cards}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.card}>
            <div className={`skeleton ${styles.cardTitle}`} />
            <div className={`skeleton ${styles.cardLine}`} />
            <div className={`skeleton ${styles.cardLine} ${styles.cardLineShort}`} />
            <div className={`skeleton ${styles.cardLine}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
