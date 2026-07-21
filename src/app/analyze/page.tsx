"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ImageUploader from "@/components/ImageUploader";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ResultCards from "@/components/ResultCards";
import { PredictionResult } from "@/lib/types";
import { savePrediction, generateId } from "@/lib/historyStorage";
import styles from "./analyze.module.css";

const CROP_OPTIONS = [
  "Tomato",
  "Potato",
  "Wheat",
  "Rice",
  "Corn",
  "Grape",
  "Apple",
  "Pepper",
  "Cotton",
  "Soybean",
];

type Status = "idle" | "analyzing" | "done" | "error";

export default function AnalyzePage() {
  const { language, t } = useLanguage();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [cropType, setCropType] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);

  function handleImageReady(file: File, dataUrl: string) {
    setImageFile(file);
    setImageDataUrl(dataUrl);
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
    setSaved(false);
  }

  async function handleAnalyze() {
    if (!imageFile) return;

    setStatus("analyzing");
    setResult(null);
    setErrorMsg("");
    setSaved(false);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("language", language);
      if (cropType) formData.append("cropType", cropType);

      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.message || t("Something went wrong.", "कुछ गलत हो गया।"));
        setStatus("error");
        return;
      }

      setResult(data as PredictionResult);
      setStatus("done");
    } catch {
      setErrorMsg(
        t(
          "Analysis temporarily unavailable. Please try again.",
          "विश्लेषण अस्थायी रूप से अनुपलब्ध है। कृपया पुनः प्रयास करें।"
        )
      );
      setStatus("error");
    }
  }

  function handleSave() {
    if (!result || saved) return;
    savePrediction({
      id: generateId(),
      timestamp: Date.now(),
      imageDataUrl,
      cropType: cropType || undefined,
      language,
      result,
    });
    setSaved(true);
  }

  function handleReset() {
    setImageFile(null);
    setImageDataUrl("");
    setCropType("");
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setSaved(false);
  }

  function handleShare() {
    if (!result) return;
    const text = `AgroVision AI Diagnosis\n\nCrop: ${result.crop_name}\nDisease: ${result.is_healthy ? "Healthy" : result.disease_name}\nConfidence: ${result.confidence_percent}%\nSeverity: ${result.severity}\n\nTreatment:\n${result.treatment.immediate_actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}`;
    navigator.clipboard.writeText(text);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            🔬 {t("Analyze Your Crop", "अपनी फसल का विश्लेषण करें")}
          </h1>
          <p className={styles.subtitle}>
            {t(
              "Upload a clear photo of the affected leaf for instant AI diagnosis",
              "तत्काल AI निदान के लिए प्रभावित पत्ती की स्पष्ट तस्वीर अपलोड करें"
            )}
          </p>
        </div>

        <div className={styles.layout}>
          {/* ─── Left: Upload ─── */}
          <div className={styles.uploadSection}>
            <ImageUploader
              onImageReady={handleImageReady}
              disabled={status === "analyzing"}
            />

            <div className={styles.options}>
              <label className={styles.label}>
                {t("Crop Type (optional)", "फसल प्रकार (वैकल्पिक)")}
              </label>
              <select
                className={styles.select}
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                disabled={status === "analyzing"}
              >
                <option value="">
                  {t("Auto-detect", "स्वचालित पहचान")}
                </option>
                {CROP_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={handleAnalyze}
              disabled={!imageFile || status === "analyzing"}
            >
              <span>
                {status === "analyzing"
                  ? t("🔄 Analyzing...", "🔄 विश्लेषण हो रहा है...")
                  : t("🔬 Analyze Leaf", "🔬 पत्ती का विश्लेषण करें")}
              </span>
            </button>
          </div>

          {/* ─── Right: Results ─── */}
          <div className={styles.resultsSection}>
            {status === "idle" && !result && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🍃</div>
                <p className={styles.emptyTitle}>
                  {t(
                    "Upload a leaf image to begin",
                    "शुरू करने के लिए पत्ती की छवि अपलोड करें"
                  )}
                </p>
                <p className={styles.emptySub}>
                  {t(
                    "Our AI will analyze it in seconds",
                    "हमारा AI सेकंड में इसका विश्लेषण करेगा"
                  )}
                </p>
              </div>
            )}

            {status === "analyzing" && <LoadingSkeleton />}

            {status === "error" && (
              <div className={styles.errorCard}>
                <div className={styles.errorIcon}>❌</div>
                <p className={styles.errorTitle}>
                  {t("Analysis Failed", "विश्लेषण विफल")}
                </p>
                <p className={styles.errorMsg}>{errorMsg}</p>
                <button className="btn-secondary" onClick={handleAnalyze}>
                  {t("Try Again", "पुनः प्रयास करें")}
                </button>
              </div>
            )}

            {status === "done" && result && (
              <>
                <ResultCards result={result} imageUrl={imageDataUrl} />
                <div className={styles.actions}>
                  <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saved}
                  >
                    <span>
                      {saved
                        ? t("✅ Saved", "✅ सहेजा गया")
                        : t("💾 Save to History", "💾 इतिहास में सहेजें")}
                    </span>
                  </button>
                  <button className="btn-secondary" onClick={handleShare}>
                    {t("📋 Copy Summary", "📋 सारांश कॉपी करें")}
                  </button>
                  <button className="btn-secondary" onClick={handleReset}>
                    {t("🔄 Analyze Another", "🔄 एक और विश्लेषण करें")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
