"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getPredictions, clearHistory } from "@/lib/historyStorage";
import { StoredPrediction } from "@/lib/types";
import styles from "./history.module.css";

export default function HistoryPage() {
  const { t } = useLanguage();
  const [predictions, setPredictions] = useState<StoredPrediction[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setPredictions(getPredictions());
  }, []);

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearHistory();
    setPredictions([]);
    setConfirmClear(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              📋 {t("Diagnosis History", "निदान इतिहास")}
            </h1>
            <p className={styles.subtitle}>
              {t(
                `${predictions.length} diagnosis${predictions.length !== 1 ? "es" : ""} stored locally on this device`,
                `इस डिवाइस पर ${predictions.length} निदान स्थानीय रूप से संग्रहीत`
              )}
            </p>
          </div>
          {predictions.length > 0 && (
            <button
              className={`btn-secondary ${styles.clearBtn}`}
              onClick={handleClear}
            >
              {confirmClear
                ? t("⚠️ Confirm Clear", "⚠️ पुष्टि करें")
                : t("🗑️ Clear All", "🗑️ सब हटाएं")}
            </button>
          )}
        </div>

        {predictions.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🌱</div>
            <h2 className={styles.emptyTitle}>
              {t("No diagnoses yet", "अभी तक कोई निदान नहीं")}
            </h2>
            <p className={styles.emptySub}>
              {t(
                "Analyze your first crop to see results here",
                "यहां परिणाम देखने के लिए अपनी पहली फसल का विश्लेषण करें"
              )}
            </p>
            <a href="/analyze" className="btn-primary">
              <span>🔬 {t("Start Analyzing", "विश्लेषण शुरू करें")}</span>
            </a>
          </div>
        ) : (
          <div className={styles.list}>
            {predictions.map((pred) => {
              const expanded = expandedId === pred.id;
              return (
                <div
                  key={pred.id}
                  className={`glass-card ${styles.card} ${expanded ? styles.cardExpanded : ""}`}
                  onClick={() => setExpandedId(expanded ? null : pred.id)}
                >
                  <div className={styles.cardRow}>
                    <div className={styles.cardImage}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pred.imageDataUrl}
                        alt={pred.result.crop_name}
                      />
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardCrop}>
                        {pred.result.crop_name}
                      </div>
                      <div
                        className={styles.cardDisease}
                        style={{
                          color: pred.result.is_healthy
                            ? "var(--severity-healthy)"
                            : "var(--color-orange-500)",
                        }}
                      >
                        {pred.result.is_healthy
                          ? t("Healthy", "स्वस्थ")
                          : pred.result.disease_name}
                      </div>
                    </div>
                    <div className={styles.cardMeta}>
                      <span
                        className={`severity-badge severity-${pred.result.is_healthy ? "low" : pred.result.severity}`}
                      >
                        {pred.result.is_healthy
                          ? t("Healthy", "स्वस्थ")
                          : pred.result.severity}
                      </span>
                      <span className={styles.cardConfidence}>
                        {pred.result.confidence_percent}%
                      </span>
                    </div>
                    <div className={styles.cardDate}>
                      {new Date(pred.timestamp).toLocaleDateString(
                        pred.language === "hi" ? "hi-IN" : "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                    <div className={styles.chevron}>{expanded ? "▲" : "▼"}</div>
                  </div>

                  {expanded && (
                    <div
                      className={styles.expandedContent}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.expandedGrid}>
                        {!pred.result.is_healthy && (
                          <>
                            <div className={styles.expandedSection}>
                              <h4>{t("Symptoms", "लक्षण")}</h4>
                              <ul>
                                {pred.result.symptoms.map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                            <div className={styles.expandedSection}>
                              <h4>{t("Treatment", "उपचार")}</h4>
                              <ol>
                                {pred.result.treatment.immediate_actions.map(
                                  (a, i) => (
                                    <li key={i}>{a}</li>
                                  )
                                )}
                              </ol>
                            </div>
                            <div className={styles.expandedSection}>
                              <h4>{t("Cause", "कारण")}</h4>
                              <p>{pred.result.causes}</p>
                            </div>
                            <div className={styles.expandedSection}>
                              <h4>{t("Spread Pattern", "प्रसार पैटर्न")}</h4>
                              <p>{pred.result.spread_pattern}</p>
                            </div>
                          </>
                        )}
                        {pred.result.is_healthy && (
                          <div className={styles.expandedSection}>
                            <p style={{ color: "var(--severity-healthy)" }}>
                              ✅{" "}
                              {t(
                                "This leaf was identified as healthy with no signs of disease.",
                                "इस पत्ती को स्वस्थ पहचाना गया, रोग का कोई संकेत नहीं।"
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
