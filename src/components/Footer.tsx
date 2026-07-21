"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>🌿 AgroVision AI</span>
          <p className={styles.tagline}>
            {t(
              "Detect crop diseases before they destroy your harvest.",
              "फसल रोगों का पता लगाएं इससे पहले कि वे आपकी फसल नष्ट कर दें।"
            )}
          </p>
        </div>
        <div className={styles.disclaimer}>
          <p>
            ⚠️{" "}
            {t(
              "This is an AI-powered tool and not a substitute for professional agricultural advice. Always consult an expert for critical decisions.",
              "यह एक AI-संचालित उपकरण है और पेशेवर कृषि सलाह का विकल्प नहीं है। महत्वपूर्ण निर्णयों के लिए हमेशा विशेषज्ञ से परामर्श लें।"
            )}
          </p>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} AgroVision AI</span>
          <span className={styles.dot}>·</span>
          <span>{t("Powered by Gemini AI", "Gemini AI द्वारा संचालित")}</span>
        </div>
      </div>
    </footer>
  );
}
