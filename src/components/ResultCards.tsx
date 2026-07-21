"use client";

import { PredictionResult } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./ResultCards.module.css";

interface Props {
  result: PredictionResult;
  imageUrl: string;
}

function ConfidenceRing({ percent }: { percent: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const color =
    percent >= 80
      ? "var(--color-green-400)"
      : percent >= 60
        ? "var(--color-amber-400)"
        : "var(--color-red-400)";

  return (
    <div className={styles.ring}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(102,187,106,0.1)"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          className={styles.ringProgress}
        />
      </svg>
      <div className={styles.ringLabel}>
        <span className={styles.ringValue}>{percent}</span>
        <span className={styles.ringPercent}>%</span>
      </div>
    </div>
  );
}

export default function ResultCards({ result, imageUrl }: Props) {
  const { t } = useLanguage();

  return (
    <div className={styles.wrapper}>
      {/* ─── Main Diagnosis Card ─── */}
      <div className={`glass-card ${styles.diagnosisCard} animate-slide-up`}>
        <div className={styles.diagnosisTop}>
          <div className={styles.diagnosisImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Analyzed leaf" />
          </div>
          <div className={styles.diagnosisInfo}>
            <div className={styles.cropName}>{result.crop_name}</div>
            <div
              className={styles.diseaseName}
              style={{
                color: result.is_healthy
                  ? "var(--severity-healthy)"
                  : "var(--color-orange-500)",
              }}
            >
              {result.is_healthy
                ? t("✅ Healthy Leaf", "✅ स्वस्थ पत्ती")
                : result.disease_name}
            </div>
            <span
              className={`severity-badge severity-${result.is_healthy ? "low" : result.severity}`}
            >
              {result.is_healthy
                ? t("Healthy", "स्वस्थ")
                : result.severity.toUpperCase()}
            </span>
          </div>
          <ConfidenceRing percent={result.confidence_percent} />
        </div>
      </div>

      {/* ─── Symptoms & Cause Card ─── */}
      {!result.is_healthy && (
        <div className={`glass-card ${styles.card} animate-slide-up stagger-2`}>
          <h3 className={styles.cardTitle}>
            🔍 {t("Symptoms & Causes", "लक्षण और कारण")}
          </h3>
          <div className={styles.cardSection}>
            <h4 className={styles.subTitle}>{t("Symptoms", "लक्षण")}</h4>
            <ul className={styles.list}>
              {result.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className={styles.cardSection}>
            <h4 className={styles.subTitle}>{t("Cause", "कारण")}</h4>
            <p className={styles.text}>{result.causes}</p>
          </div>
          <div className={styles.cardSection}>
            <h4 className={styles.subTitle}>
              {t("Spread Pattern", "प्रसार पैटर्न")}
            </h4>
            <p className={styles.text}>{result.spread_pattern}</p>
          </div>
        </div>
      )}

      {/* ─── Treatment Card ─── */}
      {!result.is_healthy && (
        <div className={`glass-card ${styles.card} animate-slide-up stagger-3`}>
          <h3 className={styles.cardTitle}>
            💊 {t("Treatment Plan", "उपचार योजना")}
          </h3>
          <div className={styles.cardSection}>
            <h4 className={styles.subTitle}>
              {t("Immediate Actions", "तत्काल कार्रवाई")}
            </h4>
            <ol className={styles.orderedList}>
              {result.treatment.immediate_actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ol>
          </div>
          <div className={styles.cardSection}>
            <h4 className={styles.subTitle}>
              {t("Preventive Measures", "निवारक उपाय")}
            </h4>
            <ul className={styles.list}>
              {result.treatment.preventive_measures.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
          {result.treatment.recommended_products.length > 0 && (
            <div className={styles.cardSection}>
              <h4 className={styles.subTitle}>
                {t("Recommended Products", "अनुशंसित उत्पाद")}
              </h4>
              <div className={styles.tags}>
                {result.treatment.recommended_products.map((p, i) => (
                  <span key={i} className={styles.tag}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
