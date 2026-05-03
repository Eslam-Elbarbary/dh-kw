const STORAGE_KEY = 'dh_compare_product_ids';
const MAX_ITEMS = 4;

const parseProductId = (raw) => {
  const n = Number(String(raw ?? '').trim());
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const getCompareIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.map(parseProductId).filter(Boolean))].slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
};

/**
 * @param {unknown[]} ids
 * @param {{ notify?: boolean }} [options] - Set notify:false when Compare page syncs state→storage (avoids infinite self-loop).
 */
export const saveCompareIds = (ids, options = {}) => {
  const { notify = true } = options;
  const clean = [...new Set(ids.map(parseProductId).filter(Boolean))].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  if (notify) {
    window.dispatchEvent(new CustomEvent('dh-compare-updated', { detail: clean }));
  }
  return clean;
};

/** @returns {{ ok: boolean, added?: boolean, reason?: 'invalid'|'full', ids: number[] }} */
export const addCompareProductId = (rawId) => {
  const id = parseProductId(rawId);
  if (!id) return { ok: false, reason: 'invalid', ids: getCompareIds() };
  const cur = getCompareIds();
  if (cur.includes(id)) return { ok: true, added: false, ids: cur };
  if (cur.length >= MAX_ITEMS) return { ok: false, reason: 'full', ids: cur };
  const next = [...cur, id];
  saveCompareIds(next);
  return { ok: true, added: true, ids: next };
};

export const removeCompareProductId = (rawId) => {
  const id = parseProductId(rawId);
  const next = getCompareIds().filter((x) => x !== id);
  saveCompareIds(next);
  return next;
};

export const clearCompareIds = () => {
  saveCompareIds([]);
  return [];
};

export const MAX_COMPARE_ITEMS = MAX_ITEMS;
