function stripHtml(text) {
  return String(text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Client-side search refinement — backend may return loose matches (e.g. "used" matching "use").
 */
export function productMatchesSearch(product, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;

  const fields = [
    product?.name,
    product?.brand,
    product?.vendorName,
    product?.category,
    product?.tag,
    product?.description,
    product?.howToUse,
    product?.sku,
    product?.slug,
    product?.companyName,
  ];

  const haystack = fields
    .map((value) => stripHtml(value))
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}
