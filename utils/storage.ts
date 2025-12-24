// utils/storage.ts (GÜNCEL HALİ)

export const STORAGE_KEY_PRODUCTS = "aura_products_db";
export const STORAGE_KEY_TRANSACTIONS = "aura_transactions_db";
export const STORAGE_KEY_WORKSHOP = "aura_workshop_db"; // YENİ EKLENDİ

// --- DOSYA ÇEVİRİCİ ---
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// --- ÜRÜN & KASA FONKSİYONLARI ---
export const saveProductsToStorage = (data: any[]) => { if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data)); };
export const getProductsFromStorage = () => { if (typeof window !== "undefined") return JSON.parse(localStorage.getItem(STORAGE_KEY_PRODUCTS) || "[]"); return []; };

export const saveTransactionsToStorage = (data: any[]) => { if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(data)); };
export const getTransactionsFromStorage = () => { if (typeof window !== "undefined") return JSON.parse(localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || "[]"); return []; };

// --- ATÖLYE FONKSİYONLARI (YENİ) ---
export const saveWorkshopToStorage = (data: any[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_WORKSHOP, JSON.stringify(data));
  }
};

export const getWorkshopFromStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY_WORKSHOP);
    return data ? JSON.parse(data) : [];
  }
  return [];
};