const toArray = (value) => (Array.isArray(value) ? value : []);

/**
 * Build variant option groups from API `product.variants` (same rules as Product detail page).
 * @param {object|null|undefined} product
 * @returns {Array<{ name: string, values: Array<{ value: string, variantId: * }> }>}
 */
export function buildVariantGroups(product) {
  const groups = {};
  const variants = toArray(product?.variants);
  variants.forEach((variant) => {
    const key = variant?.attribute || variant?.type || variant?.group || 'Option';
    const optionsSource = Array.isArray(variant?.options)
      ? variant.options
      : Array.isArray(variant?.values)
        ? variant.values
        : variant?.value
          ? [variant.value]
          : [];
    const values = optionsSource
      .map((item) => {
        if (typeof item === 'string') {
          return { value: item, variantId: variant?.id ?? variant?.variant_id ?? null };
        }
        const value = item?.value || item?.name;
        if (!value) return null;
        return {
          value,
          variantId:
            variant?.id
            ?? variant?.variant_id
            ?? item?.variant_id
            ?? item?.variant?.id
            ?? item?.variant_option?.variant_id
            ?? item?.id
            ?? null,
        };
      })
      .filter(Boolean);

    if (values.length === 0 && variant?.name) {
      if (!groups.Option) groups.Option = new Set();
      groups.Option.add(JSON.stringify({
        value: String(variant.name),
        variantId: variant?.id ?? variant?.variant_id ?? null,
      }));
      return;
    }

    if (!groups[key]) groups[key] = new Set();
    values.forEach((valueObj) => groups[key].add(JSON.stringify(valueObj)));
  });

  return Object.entries(groups).map(([name, set]) => ({
    name,
    values: [...set]
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return { value: String(item), variantId: null };
        }
      })
      .filter((item) => item?.value),
  }));
}

/**
 * Resolve the variant id to send to the cart API from current UI selection.
 */
export function getSelectedVariantId(variantGroups, selectedVariants, productVariants) {
  const variants = Array.isArray(productVariants) ? productVariants : [];
  const selectedIds = variantGroups
    .map((group) => {
      const selectedValue = selectedVariants[group.name] || group.values[0]?.value;
      const selectedOption = group.values.find((item) => item.value === selectedValue);
      return selectedOption?.variantId;
    })
    .filter((value) => value !== null && value !== undefined && value !== '');

  if (selectedIds.length === 0) {
    const firstVariant = variants[0] || null;
    return firstVariant?.id ?? firstVariant?.variant_id ?? null;
  }
  return selectedIds[0];
}

export function productNeedsVariantPick(product) {
  return buildVariantGroups(product).length > 0;
}
