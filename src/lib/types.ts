export interface PredictionResult {
  crop_name: string;
  is_healthy: boolean;
  disease_name: string | null;
  confidence_percent: number;
  symptoms: string[];
  causes: string;
  spread_pattern: string;
  treatment: {
    immediate_actions: string[];
    preventive_measures: string[];
    recommended_products: string[];
  };
  severity: "low" | "medium" | "high" | "critical";
}

export interface PredictionError {
  error: string;
  message: string;
}

export interface StoredPrediction {
  id: string;
  timestamp: number;
  imageDataUrl: string; // base64 thumbnail
  cropType?: string;
  language: string;
  result: PredictionResult;
}

export type Language = "en" | "hi";

export interface AnalyzeFormData {
  image: File;
  cropType?: string;
  language: Language;
}
