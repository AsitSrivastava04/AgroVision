"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getPredictions } from "@/lib/historyStorage";
import { StoredPrediction } from "@/lib/types";
import styles from "./page.module.css";

export default function HomePage() {
  const { t } = useLanguage();
  const [recent, setRecent] = useState<StoredPrediction[]>([]);

  useEffect(() => {
    setRecent(getPredictions().slice(0, 3));
  }, []);

  return (
    <div className={styles.page}>
      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            {t("AI-Powered Plant Diagnostics", "AI-संचालित पौधे निदान")}
          </div>
          <h1 className={styles.heroTitle}>
            {t(
              "Detect crop diseases ",
              "फसल रोगों का पता लगाएं "
            )}
            <span className={styles.heroGradient}>
              {t(
                "before they destroy your harvest",
                "इससे पहले कि वे आपकी फसल नष्ट कर दें"
              )}
            </span>
          </h1>
          <p className={styles.heroSub}>
            {t(
              "Upload a photo of your plant leaf and get instant AI-powered disease diagnosis with treatment recommendations. Free, fast, and accurate.",
              "अपने पौधे की पत्ती की फोटो अपलोड करें और उपचार सिफारिशों के साथ तुरंत AI-संचालित रोग निदान प्राप्त करें। मुफ्त, तेज़ और सटीक।"
            )}
          </p>
          <div className={styles.heroCta}>
            <Link href="/analyze" className="btn-primary">
              <span>🔬 {t("Analyze Your Crop", "अपनी फसल का विश्लेषण करें")}</span>
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              {t("How It Works", "यह कैसे काम करता है")}
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardHeader}>
              <span className={styles.heroCardDot} style={{ background: "#f44336" }} />
              <span className={styles.heroCardDot} style={{ background: "#ffca28" }} />
              <span className={styles.heroCardDot} style={{ background: "#4caf50" }} />
            </div>
            <div className={styles.heroCardBody}>
              <div className={styles.heroCardLeaf}>🍃</div>
              <div className={styles.heroCardResult}>
                <div className={styles.heroCardLabel}>{t("Disease Detected", "रोग पाया गया")}</div>
                <div className={styles.heroCardDisease}>Early Blight</div>
                <div className={styles.heroCardConfidence}>
                  <div className={styles.confidenceBar}>
                    <div className={styles.confidenceFill} style={{ width: "96%" }} />
                  </div>
                  <span>96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {t("How It Works", "यह कैसे काम करता है")}
        </h2>
        <p className={styles.sectionSub}>
          {t(
            "Three simple steps to protect your crops",
            "अपनी फसलों की सुरक्षा के लिए तीन सरल कदम"
          )}
        </p>
        <div className={styles.steps}>
          {[
            {
              icon: "📸",
              title: t("Upload Photo", "फोटो अपलोड करें"),
              desc: t(
                "Take a clear photo of the affected leaf and upload it.",
                "प्रभावित पत्ती की स्पष्ट फोटो लें और अपलोड करें।"
              ),
            },
            {
              icon: "🧠",
              title: t("AI Analysis", "AI विश्लेषण"),
              desc: t(
                "Our AI analyzes the image using advanced vision models.",
                "हमारा AI उन्नत विज़न मॉडल का उपयोग करके छवि का विश्लेषण करता है।"
              ),
            },
            {
              icon: "💊",
              title: t("Get Treatment", "उपचार प्राप्त करें"),
              desc: t(
                "Receive diagnosis, confidence scores, and treatment steps.",
                "निदान, विश्वास स्कोर और उपचार चरण प्राप्त करें।"
              ),
            },
          ].map((step, i) => (
            <div
              key={i}
              className={`glass-card ${styles.stepCard} animate-slide-up stagger-${i + 1}`}
            >
              <div className={styles.stepIcon}>{step.icon}</div>
              <div className={styles.stepNumber}>
                {t("Step", "चरण")} {i + 1}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className={styles.section}>
        <div className={styles.stats}>
          {[
            { value: "50+", label: t("Crop Diseases", "फसल रोग") },
            { value: "<5s", label: t("Analysis Time", "विश्लेषण समय") },
            { value: "2", label: t("Languages", "भाषाएं") },
            { value: "Free", label: t("To Use", "उपयोग करने के लिए") },
          ].map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Recent Diagnoses ─── */}
      {recent.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t("Recent Diagnoses", "हाल के निदान")}
          </h2>
          <div className={styles.recentGrid}>
            {recent.map((pred) => (
              <div key={pred.id} className={`glass-card ${styles.recentCard}`}>
                <div className={styles.recentImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pred.imageDataUrl} alt={pred.result.crop_name} />
                </div>
                <div className={styles.recentInfo}>
                  <div className={styles.recentCrop}>{pred.result.crop_name}</div>
                  <div className={styles.recentDisease}>
                    {pred.result.is_healthy
                      ? t("Healthy", "स्वस्थ")
                      : pred.result.disease_name}
                  </div>
                  <div className={styles.recentMeta}>
                    <span
                      className={`severity-badge severity-${pred.result.is_healthy ? "low" : pred.result.severity}`}
                    >
                      {pred.result.is_healthy
                        ? t("Healthy", "स्वस्थ")
                        : pred.result.severity}
                    </span>
                    <span className={styles.recentDate}>
                      {new Date(pred.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.recentCta}>
            <Link href="/history" className="btn-secondary">
              {t("View All History →", "सभी इतिहास देखें →")}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
