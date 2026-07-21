"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./ImageUploader.module.css";

interface Props {
  onImageReady: (file: File, dataUrl: string) => void;
  disabled?: boolean;
}

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/jpg"];
const MAX_DIM = 1024;

function compressImage(file: File): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;

        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) {
            h = Math.round((h * MAX_DIM) / w);
            w = MAX_DIM;
          } else {
            w = Math.round((w * MAX_DIM) / h);
            h = MAX_DIM;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            const compressed = new File([blob], file.name, {
              type: "image/jpeg",
            });
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            resolve({ file: compressed, dataUrl });
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => reject(new Error("Invalid image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ onImageReady, disabled }: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setPreview(null);

    if (!ALLOWED.includes(file.type)) {
      setError(t("Only JPG, JPEG, and PNG images are supported.", "केवल JPG, JPEG और PNG चित्र समर्थित हैं।"));
      return;
    }

    if (file.size > MAX_SIZE) {
      setError(t("Image must be under 5MB.", "चित्र 5MB से कम होना चाहिए।"));
      return;
    }

    setProcessing(true);
    try {
      const { file: compressed, dataUrl } = await compressImage(file);
      setPreview(dataUrl);
      onImageReady(compressed, dataUrl);
    } catch {
      setError(t("Failed to process image. Please try another.", "चित्र प्रोसेस करने में विफल। कृपया दूसरा प्रयास करें।"));
    } finally {
      setProcessing(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ""} ${preview ? styles.hasPreview : ""} ${disabled ? styles.disabled : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className={styles.input}
          onChange={onChange}
          disabled={disabled}
        />

        {processing ? (
          <div className={styles.processing}>
            <div className={styles.spinner} />
            <p>{t("Compressing image...", "चित्र संपीड़ित हो रहा है...")}</p>
          </div>
        ) : preview ? (
          <div className={styles.previewContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <div className={styles.previewOverlay}>
              <span>📷 {t("Click to change", "बदलने के लिए क्लिक करें")}</span>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.uploadIcon}>📸</div>
            <p className={styles.uploadTitle}>
              {t("Drop your leaf image here", "अपनी पत्ती की छवि यहां डालें")}
            </p>
            <p className={styles.uploadSub}>
              {t("or click to browse • JPG, PNG • Max 5MB", "या ब्राउज़ करने के लिए क्लिक करें • JPG, PNG • अधिकतम 5MB")}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          <span>⚠️</span> {error}
        </div>
      )}
    </div>
  );
}
