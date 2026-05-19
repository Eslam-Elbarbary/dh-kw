const toArray = (value) => (Array.isArray(value) ? value : []);

/** Collect variant rows from any common API field name. */
export function collectProductVariants(product) {
  const sources = [
    product?.variants,
    product?.product_variants,
    product?.productVariants,
    product?.variant_products,
    product?.variantProducts,
  ];
  for (const source of sources) {
    const list = toArray(source);
    if (list.length > 0) return list;
  }
  return [];
}

export function productHasVariantsFlag(product) {
  if (!product) return false;
  if (product.hasVariants === true || product.has_variants === true) return true;
  if (product.is_variable === true || product.isVariable === true) return true;
  return collectProductVariants(product).length > 0;
}

function buildFlatVariantGroup(variants) {
  const values = variants
    .map((variant) => {
      const variantId = variant?.id ?? variant?.variant_id ?? variant?.product_variant_id ?? null;
      if (variantId == null || variantId === '') return null;
      const label =
        variant?.name
        || variant?.title
        || variant?.label
        || variant?.sku
        || variant?.size
        || variant?.color
        || `Option ${variantId}`;
      return { value: String(label), variantId };
    })
    .filter(Boolean);

  if (!values.length) return [];
  return [{ name: 'Option', values }];
}

/**
 * Build variant option groups from API `product.variants` (same rules as Product detail page).
 * @param {object|null|undefined} product
 * @returns {Array<{ name: string, values: Array<{ value: string, variantId: * }> }>}
 */
export function buildVariantGroups(product) {
  const variants = collectProductVariants(product);
  const flatGroup = buildFlatVariantGroup(variants);
  if (flatGroup.length > 0 && variants.every((v) => !toArray(v?.options).length && !toArray(v?.values).length)) {
    const hasNestedOptions = variants.some(
      (v) => toArray(v?.options).length > 0 || toArray(v?.values).length > 0 || (v?.value && !v?.name),
    );
    if (!hasNestedOptions) return flatGroup;
  }

  const groups = {};  variants.forEach((variant) => {
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
  const variants = Array.isArray(productVariants) ? productVariants : toArray(productVariants);
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
  if (buildVariantGroups(product).length > 0) return true;
  return productHasVariantsFlag(product);
}
