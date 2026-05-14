function IconEye({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconHeartSolid({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21s-6.716-4.438-9.193-8.11C1.205 10.518 1 8.41 1 7.5 1 4.462 3.462 2 6.5 2c2.06 0 3.854 1.133 4.5 2.81C11.646 3.133 13.44 2 15.5 2 18.538 2 21 4.462 21 7.5c0 .91-.205 3.018-1.807 5.39C18.716 16.562 12 21 12 21z" />
    </svg>
  );
}

function IconHeartOutline({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  );
}

function IconCompare({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M8 21H3v-5M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function IconCart({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

const stopCardNavigation = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

const baseBtn =
  'inline-flex size-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] focus-visible:ring-offset-1 disabled:opacity-55 disabled:cursor-not-allowed dark:focus-visible:ring-offset-[#0f172a]';

const neutralBtn = `${baseBtn} border-[#d8b4fe] bg-[#faf5ff] text-[#5b21b6] hover:bg-white hover:border-[#a855f7] hover:shadow-md dark:border-[#6d28d9] dark:bg-[#2e1065]/90 dark:text-[#e9d5ff] dark:hover:bg-[#3b0764]`;

/**
 * Quick actions for catalog product cards: quick view, wishlist, compare, add to cart.
 * Parent card should use `group` for hover-reveal on sm+; actions stay visible on small screens.
 *
 * The eye always calls `onVariantChoiceView` (quick-view / preview modal). Parents should open the same modal
 * for simple and variant products instead of navigating directly.
 *
 * When `variantChoiceRequired` is true, the cart action calls `onVariantChoiceCart` so the parent can open
 * the picker; otherwise it calls `onAddToCart`.
 */
export function ProductCardQuickActions({
  variantChoiceRequired = false,
  onVariantChoiceView,
  onVariantChoiceCart,
  isFavorite,
  inCompare,
  favoriteBusy,
  cartBusy,
  onToggleFavorite,
  onAddToCompare,
  onAddToCart,
}) {
  return (
    <div className="absolute bottom-[8px] left-1/2 z-20 w-[min(100%,220px)] -translate-x-1/2 px-[4px]">
      <div
        role="toolbar"
        aria-label="Product actions"
        className="flex items-center justify-center gap-[6px] rounded-full border border-[#ede9fe] bg-white/[0.94] px-[8px] py-[6px] shadow-[0_8px_28px_rgba(15,23,42,0.14)] backdrop-blur-[2px] opacity-100 sm:opacity-0 sm:translate-y-[2px] sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:transition-all sm:duration-200 dark:border-[#4c1d95]/45 dark:bg-[#1e293b]/96"
      >
        <button
          type="button"
          onClick={(e) => {
            stopCardNavigation(e);
            onVariantChoiceView?.(e);
          }}
          className={neutralBtn}
          aria-label="Quick view product"
          title="Quick view"
        >
          <IconEye className="size-[17px]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            stopCardNavigation(e);
            onToggleFavorite(e);
          }}
          disabled={favoriteBusy}
          className={`${baseBtn} ${
            isFavorite
              ? 'border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-500/60 dark:bg-rose-950/50 dark:text-rose-200'
              : neutralBtn
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isFavorite}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isFavorite ? <IconHeartSolid className="size-[17px]" /> : <IconHeartOutline className="size-[17px]" />}
        </button>
        <button
          type="button"
          onClick={(e) => {
            stopCardNavigation(e);
            onAddToCompare(e);
          }}
          className={`${baseBtn} ${
            inCompare
              ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-100'
              : neutralBtn
          }`}
          aria-label={inCompare ? 'Product is in compare list' : 'Add to compare'}
          aria-pressed={inCompare}
          title={inCompare ? 'In compare — open Compare in the header' : 'Add to compare'}
        >
          <IconCompare className="size-[17px]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            stopCardNavigation(e);
            if (variantChoiceRequired) {
              onVariantChoiceCart?.(e);
            } else {
              onAddToCart(e);
            }
          }}
          disabled={cartBusy}
          className={neutralBtn}
          aria-label="Add to cart"
          title={variantChoiceRequired ? 'Choose options and add to cart' : 'Add to cart'}
        >
          <IconCart className="size-[17px]" />
        </button>
      </div>
    </div>
  );
}
