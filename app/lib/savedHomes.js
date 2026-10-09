import { FALLBACK_PROPERTIES, enrichProperty, fetchPropertyById } from "@/app/lib/propertiesData";

const STORAGE_KEY = "fieldhouse_saved_homes";
const CACHE_KEY = "fieldhouse_saved_properties_cache";

/**
 * Get list of saved property IDs from localStorage
 */
export function getSavedPropertyIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Check if a specific property ID is saved
 */
export function isPropertySaved(propertyId) {
  if (!propertyId) return false;
  const list = getSavedPropertyIds();
  return list.includes(String(propertyId));
}

/**
 * Toggle saved status for a property
 * Can accept a property object or an ID string/number
 */
export function toggleSaveProperty(propertyOrId) {
  if (typeof window === "undefined" || !propertyOrId) return false;
  
  const idStr = String(typeof propertyOrId === "object" ? propertyOrId.id : propertyOrId);
  if (!idStr) return false;

  const current = getSavedPropertyIds();
  let updated;
  let isNowSaved = false;

  // Retrieve existing cached property objects
  let cache = {};
  try {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    if (cacheRaw) cache = JSON.parse(cacheRaw);
  } catch (e) {}

  if (current.includes(idStr)) {
    // Unsave
    updated = current.filter((id) => id !== idStr);
    delete cache[idStr];
    isNowSaved = false;
  } else {
    // Save
    updated = [idStr, ...current];
    if (typeof propertyOrId === "object" && propertyOrId.id) {
      cache[idStr] = propertyOrId;
    }
    isNowSaved = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

    // Also sync count in fieldhouse_user if present
    const userRaw = localStorage.getItem("fieldhouse_user");
    if (userRaw) {
      const u = JSON.parse(userRaw);
      u.savedCount = updated.length;
      localStorage.setItem("fieldhouse_user", JSON.stringify(u));
    }

    // Dispatch storage and custom events
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(
      new CustomEvent("saved_homes_updated", {
        detail: { id: idStr, saved: isNowSaved, count: updated.length },
      })
    );
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }

  return isNowSaved;
}

/**
 * Get full property objects synchronously for all saved IDs
 * Uses cache and fallback dataset
 */
export function getSavedPropertiesList() {
  const ids = getSavedPropertyIds();
  if (!ids || ids.length === 0) return [];

  let cache = {};
  if (typeof window !== "undefined") {
    try {
      const cacheRaw = localStorage.getItem(CACHE_KEY);
      if (cacheRaw) cache = JSON.parse(cacheRaw);
    } catch (e) {}
  }

  const fallbackMap = new Map();
  FALLBACK_PROPERTIES.forEach((p, idx) => {
    fallbackMap.set(String(p.id), enrichProperty(p));
    fallbackMap.set(String(idx + 1), enrichProperty(p));
  });

  return ids
    .map((id) => {
      const idStr = String(id);
      if (cache[idStr]) return cache[idStr];
      if (fallbackMap.has(idStr)) return fallbackMap.get(idStr);
      return null;
    })
    .filter(Boolean);
}

/**
 * Asynchronously fetch all saved properties, resolving any missing ones
 * from backend API or fallback database
 */
export async function fetchSavedPropertiesList() {
  const ids = getSavedPropertyIds();
  if (!ids || ids.length === 0) return [];

  const localList = getSavedPropertiesList();
  const localMap = new Map();
  localList.forEach((p) => localMap.set(String(p.id), p));

  let cache = {};
  if (typeof window !== "undefined") {
    try {
      const cacheRaw = localStorage.getItem(CACHE_KEY);
      if (cacheRaw) cache = JSON.parse(cacheRaw);
    } catch (e) {}
  }

  let cacheChanged = false;

  const resolved = await Promise.all(
    ids.map(async (id) => {
      const idStr = String(id);
      if (localMap.has(idStr)) return localMap.get(idStr);

      try {
        const fetched = await fetchPropertyById(idStr);
        if (fetched) {
          cache[idStr] = fetched;
          cacheChanged = true;
          return fetched;
        }
      } catch (e) {}

      return null;
    })
  );

  if (cacheChanged && typeof window !== "undefined") {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {}
  }

  return resolved.filter(Boolean);
}
