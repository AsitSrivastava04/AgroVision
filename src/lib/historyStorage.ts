import { StoredPrediction } from "./types";

const STORAGE_KEY = "agrovision_history";
const MAX_ITEMS = 50;

export function savePrediction(prediction: StoredPrediction): void {
  const existing = getPredictions();
  existing.unshift(prediction);
  if (existing.length > MAX_ITEMS) {
    existing.splice(MAX_ITEMS);
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}

export function getPredictions(): StoredPrediction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredPrediction[];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
