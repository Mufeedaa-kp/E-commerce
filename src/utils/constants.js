// App-wide constants

export const API_BASE_URL = "http://localhost:5000";

export const CATEGORIES = [
  "Clothing",
  
  "Diapering",
  "Teethers",
  "Blankets",
  "Furniture",
  "Skincare"
];

export const AGE_GROUPS = [
  "Newborn",
  "0-6 months",
  "6-12 months",
  "12+ months",
];

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "rating_desc", label: "Rating: High to Low" },
];

export const ORDER_STATUS = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const SHIPPING_COST = 5.99;
export const FREE_SHIPPING_THRESHOLD = 50;

export const LOCAL_STORAGE_KEYS = {
  user: "momcare_user",
};
