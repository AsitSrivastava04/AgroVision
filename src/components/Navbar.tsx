"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌿</span>
          <span className={styles.logoText}>
            Agro<span className={styles.logoAccent}>Vision</span> AI
          </span>
        </Link>

        <div className={`${styles.links} ${mobileOpen ? styles.linksOpen : ""}`}>
          <Link
            href="/"
            className={styles.link}
            onClick={() => setMobileOpen(false)}
          >
            {t("Home", "होम")}
          </Link>
          <Link
            href="/analyze"
            className={styles.link}
            onClick={() => setMobileOpen(false)}
          >
            {t("Analyze", "विश्लेषण")}
          </Link>
          <Link
            href="/history"
            className={styles.link}
            onClick={() => setMobileOpen(false)}
          >
            {t("History", "इतिहास")}
          </Link>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.langToggle}
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            aria-label="Toggle language"
          >
            {language === "en" ? "हिं" : "EN"}
          </button>

          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${mobileOpen ? styles.bar1Open : ""}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.bar2Open : ""}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.bar3Open : ""}`} />
          </button>
        </div>
      </div>
    </nav>
  );
}
