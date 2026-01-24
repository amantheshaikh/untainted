import { supabase } from "./supabaseClient";

// Use local proxy
const API_BASE_URL = "/api";

export type AnalysisResult = {
  status: "safe" | "not_safe" | "caution" | "unknown";
  verdict_title: string;
  verdict_description: string;
  flagged_ingredients: string[];
  health_insights?: string[];
  reasons: string[];
  product_name?: string;
  product_image?: string;
  ingredients?: string[];
  taxonomy?: Record<string, any>[];
  active_diets?: string[];
  diet_hits?: string[];
  allergy_hits?: string[];
  allergy_preferences?: string[];
  confidence?: {
    average: number;
    ingredients: {
      ingredient: string;
      confidence: number;
      match_type: string;
      position: number;
    }[];
  };
};

export type OCRExtractionResult = {
  text: string;
  confidence: number;
};

export type Product = {
  code: string;
  name: string;
  image_url?: string;
  ingredients?: string[];
}

async function getAuthHeaders(accessToken?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
}

export async function analyzeIngredients(ingredientsText: string, customerUid: string, accessToken?: string): Promise<AnalysisResult> {
  // Proxy handles auth forwarding if provided
  const headers = await getAuthHeaders(accessToken);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer_uid: customerUid,
      ingredients_text: ingredientsText,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Analysis failed: ${response.statusText}`);
  }

  return response.json();
}

export async function extractIngredientsFromImage(base64Image: string, accessToken?: string): Promise<OCRExtractionResult> {
  const cleanBase64 = base64Image.split(",")[1] || base64Image;
  const headers = await getAuthHeaders(accessToken);

  const response = await fetch(`${API_BASE_URL}/extract/ingredients`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      images: [cleanBase64],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Extraction failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.ingredients_text,
    confidence: 1.0
  };
}

export async function lookupProductByBarcode(barcode: string, accessToken?: string): Promise<Product> {
  const headers = await getAuthHeaders(accessToken);

  const response = await fetch(`${API_BASE_URL}/product/lookup`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      barcode: barcode
    }),
  });

  if (response.status === 404) {
    throw new Error("Product not found");
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Lookup failed: ${response.statusText}`);
  }

  return response.json();
}
