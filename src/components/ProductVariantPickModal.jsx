import { useEffect, useMemo, useState } from 'react';
import {
  buildVariantGroups,
  getSelectedVariantId,
} from '../utils/productVariants';

/**
 * Listing-card modal: quick view (all products), variant pick when applicable, add to cart or open PDP.
 */
export function ProductVariantPickModal({
  open,
  intent,
  product,
  onClose,
  onConfirm,
  isSubmitting = false,
}) {
  const [selectedVariants, setSelectedVariants] = useState({});
  const [localError, setLocalError] = useState('');

  const variantGroups = useMemo(() => (product ? buildVariantGroups(product) : []), [product]);

  useEffect(() => {
    if (!open || !product) return;
    setLocalError('');
    const initial = {};
    const groups = buildVariantGroups(product);
    groups.forEach((g) => {
      if (g.values[0]?.value) initial[g.name] = g.values[0].value;
    });
    setSelectedVariants(initial);
  }, [open, product?.id]);

  const resolvedVariantId = useMemo(
    () => getSelectedVariantId(variantGroups, selectedVariants, product?.variants),
    [variantGroups, selectedVariants, product?.variants],
  );

  if (!open || !product) return null;

  const handleConfirm = async () => {
    setLocalError('');
    if (variantGroups.length > 0 && !resolvedVariantId) {
      setLocalError('Please select an option for each variant.');
      return;
    }
    try {
      await onConfirm({
        intent,
        productId: product.id,
        variantId: resolvedVariantId,
      });
    } catch {
      setLocalError('Something went wrong. Please try again.');
    }
  };

  const primaryLabel = intent === 'cart' ? 'Add to cart' : 'View full page';

  const helperText =
    intent === 'cart'
      ? variantGroups.length > 0
        ? 'Choose options before adding this item to your cart.'
        : 'Review this item, then add it to your cart.'
      : variantGroups.length > 0
        ? 'Choose any options you need, then open the full product page for specs, reviews, and more.'
        : 'Preview this item here. Open the full product page for complete details, specs, and reviews.';

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-[16px] bg-black/45 backdrop-blur-[1px]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="variant-pick-title"
        className="relative w-full max-w-[420px] rounded-[12px] border border-[#e4e7e9] bg-white shadow-2xl dark:border-[#334155] dark:bg-[#1e293b]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[12px] top-[12px] inline-flex size-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f3f4f6] dark:text-[#cbd5e1] dark:hover:bg-[#334155]"
          aria-label="Close"
        >
          <span className="text-[20px] leading-none">&times;</span>
        </button>

        <div className="max-h-[min(80vh,640px)] overflow-y-auto p-[20px] sm:p-[24px]">
          <div className="flex gap-[14px] mb-[16px]">
            {product.image ? (
              <div className="size-[72px] shrink-0 overflow-hidden rounded-[8px] border border-[#e4e7e9] bg-[#f9fafb] dark:border-[#334155]">
                <img src={product.image} alt="" className="size-full object-cover" />
              </div>
            ) : null}
            <div className="min-w-0 flex-1 pr-[28px]">
              <h2 id="variant-pick-title" className="font-['Poppins'] font-semibold text-[15px] sm:text-[16px] text-[#0e1c47] dark:text-white leading-snug">
                {product.name}
              </h2>
              {product.brand ? (
                <p className="mt-[4px] font-['Poppins'] text-[12px] text-[#666] dark:text-[#9ca3af]">{product.brand}</p>
              ) : null}
              {product.salePrice || product.price ? (
                <p className="mt-[6px] font-['Poppins'] font-semibold text-[14px] text-[#00a651]">
                  {product.salePrice || product.price}
                </p>
              ) : null}
            </div>
          </div>

          <p className="font-['Poppins'] text-[13px] text-[#666] dark:text-[#9ca3af] mb-[14px]">
            {helperText}
          </p>

          {variantGroups.length > 0 ? (
            <div className="flex flex-col gap-[14px] mb-[16px]">
              {variantGroups.map((group) => (
                <div key={group.name}>
                  <label className="block font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[13px] mb-[8px]">
                    {group.name}
                  </label>
                  {group.values.length <= 6 ? (
                    <div className="flex flex-wrap gap-[8px]">
                      {group.values.map((value) => {
                        const current = selectedVariants[group.name] || group.values[0]?.value;
                        const isSelected = current === value.value;
                        return (
                          <button
                            key={`${group.name}-${value.value}`}
                            type="button"
                            onClick={() => setSelectedVariants((prev) => ({ ...prev, [group.name]: value.value }))}
                            className={`px-[10px] py-[8px] rounded-[6px] border text-[12px] font-['Poppins'] transition-colors ${
                              isSelected
                                ? 'bg-[#0e1c47] text-white border-[#0e1c47] dark:bg-[#eea137] dark:border-[#eea137] dark:text-[#0f172a]'
                                : 'bg-white text-[#191c1f] border-[#d0d7de] hover:border-[#0e1c47] dark:bg-[#0f172a] dark:text-white dark:border-[#475569]'
                            }`}
                          >
                            {value.value}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <select
                      value={selectedVariants[group.name] || group.values[0]?.value || ''}
                      onChange={(e) => setSelectedVariants((prev) => ({ ...prev, [group.name]: e.target.value }))}
                      className="w-full border border-[#d0d7de] rounded-[6px] px-[12px] py-[10px] font-['Poppins'] text-[13px] focus:outline-none focus:border-[#0e1c47] bg-white dark:bg-[#0f172a] dark:text-white dark:border-[#475569]"
                    >
                      {group.values.map((value) => (
                        <option key={`${group.name}-${value.value}`} value={value.value}>
                          {value.value}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          ) : intent === 'cart' ? (
            <p className="font-['Poppins'] text-[13px] text-[#666] dark:text-[#9ca3af] mb-[16px]">
              No separate options are listed for this product. You can add it to your cart as shown.
            </p>
          ) : (
            <p className="font-['Poppins'] text-[13px] text-[#666] dark:text-[#9ca3af] mb-[16px]">
              This is a simple product with no options to pick on the card.
            </p>
          )}

          {localError ? (
            <div className="mb-[12px] rounded-[6px] border border-[#fecaca] bg-[#fff5f5] px-[10px] py-[8px]">
              <p className="font-['Poppins'] text-[12px] text-[#b42318]">{localError}</p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse sm:flex-row gap-[10px] sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="font-['Poppins'] font-medium rounded-[6px] border border-[#e4e7e9] px-[16px] py-[10px] text-[13px] text-[#333] hover:bg-[#f9fafb] dark:border-[#475569] dark:text-white dark:hover:bg-[#334155]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="font-['Poppins'] font-semibold rounded-[6px] bg-[#0e1c47] px-[18px] py-[10px] text-[13px] text-white hover:bg-[#1a2f5c] disabled:opacity-60 dark:bg-[#eea137] dark:text-[#0f172a] dark:hover:bg-[#f5b02e]"
            >
              {isSubmitting ? 'Please wait…' : primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
