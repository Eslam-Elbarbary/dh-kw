import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { CART_ITEM_TYPE } from '../constants/cart';

const typeLabels = {
  [CART_ITEM_TYPE.DIGITAL]: {
    title: 'Digital products',
    badge: 'Digital',
    short: 'Gift cards & codes — delivered instantly, no shipping',
    cartPath: '/shopping-cart',
    shopPath: '/digital-products',
    shopLabel: 'Browse digital products',
    accent: 'bg-[#0e1c47] text-white',
    border: 'border-[#0e1c47]/25',
    panel: 'bg-[#f0f4ff] dark:bg-[#0f172a]',
  },
  [CART_ITEM_TYPE.PHYSICAL]: {
    title: 'Physical products',
    badge: 'Physical',
    short: 'Shipped to your delivery address',
    cartPath: '/shopping-cart',
    shopPath: '/search',
    shopLabel: 'Continue shopping',
    accent: 'bg-[#eea137] text-white',
    border: 'border-[#eea137]/40',
    panel: 'bg-[#fffbeb] dark:bg-[#422006]/30',
  },
};

function TypeBadge({ label, accentClass }) {
  return (
    <span className={`inline-flex items-center rounded-[4px] px-[8px] py-[3px] text-[11px] font-semibold uppercase tracking-wide ${accentClass}`}>
      {label}
    </span>
  );
}

export default function CartTypeConflictModal({
  open,
  conflict,
  clearing,
  onClose,
  onClearAndContinue,
}) {
  if (!open || !conflict || typeof document === 'undefined') return null;

  const inCartType = conflict.cartHasType === CART_ITEM_TYPE.DIGITAL
    ? CART_ITEM_TYPE.DIGITAL
    : CART_ITEM_TYPE.PHYSICAL;
  const addingType = conflict.attemptedType === CART_ITEM_TYPE.DIGITAL
    ? CART_ITEM_TYPE.DIGITAL
    : CART_ITEM_TYPE.PHYSICAL;

  const inCart = typeLabels[inCartType];
  const adding = typeLabels[addingType];

  const content = (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-[16px] sm:p-[24px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-type-conflict-title"
      dir="ltr"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0e1c47]/55 dark:bg-black/65 backdrop-blur-[3px] cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[560px] bg-white dark:bg-[#1e293b] rounded-[10px] shadow-[0_24px_60px_rgba(14,28,71,0.22)] border border-[#e6e6e6] dark:border-[#334155] overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div className="bg-gradient-to-r from-[#0e1c47] to-[#1a3278] px-[22px] py-[18px] sm:px-[26px] sm:py-[20px]">
          <div className="flex gap-[12px] items-start">
            <span
              className="shrink-0 flex size-[44px] items-center justify-center rounded-full bg-white/15 text-white"
              aria-hidden
            >
              <svg className="size-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 5c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                />
              </svg>
            </span>
            <div className="min-w-0 flex-1 text-white">
              <h2 id="cart-type-conflict-title" className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] leading-snug">
                Different cart type required
              </h2>
              <p className="font-['Poppins'] text-[13px] sm:text-[14px] text-white/85 mt-[6px] leading-relaxed">
                Checkout uses one cart type at a time — switch by clearing the cart first.
              </p>
            </div>
          </div>
        </div>

        <div className="px-[22px] py-[20px] sm:px-[26px] sm:py-[22px]">
          <p className="font-['Poppins'] text-[14px] text-[#444] dark:text-[#cbd5e1] leading-relaxed mb-[16px]">
            {conflict.message}
          </p>

          {conflict.actionError ? (
            <p className="font-['Poppins'] text-[13px] text-[#dc2626] dark:text-[#f87171] mb-[14px] leading-relaxed rounded-[6px] bg-[#fef2f2] dark:bg-[#450a0a]/40 px-[12px] py-[10px]">
              {conflict.actionError}
            </p>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mb-[20px]">
            <div className={`rounded-[8px] border ${inCart.border} ${inCart.panel} px-[14px] py-[12px]`}>
              <p className="font-['Poppins'] text-[11px] font-semibold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8] mb-[8px]">
                Currently in cart
              </p>
              <TypeBadge label={inCart.badge} accentClass={inCart.accent} />
              <p className="font-['Poppins'] font-semibold text-[15px] text-[#0e1c47] dark:text-white mt-[8px]">
                {inCart.title}
              </p>
              <p className="font-['Poppins'] text-[12px] text-[#666] dark:text-[#94a3b8] mt-[4px]">
                {inCart.short}
              </p>
            </div>
            <div className={`rounded-[8px] border ${adding.border} ${adding.panel} px-[14px] py-[12px]`}>
              <p className="font-['Poppins'] text-[11px] font-semibold uppercase tracking-wide text-[#b45309] dark:text-[#fdba74] mb-[8px]">
                Product you selected
              </p>
              <TypeBadge label={adding.badge} accentClass={adding.accent} />
              <p className="font-['Poppins'] font-semibold text-[15px] text-[#0e1c47] dark:text-white mt-[8px]">
                {adding.title}
              </p>
              <p className="font-['Poppins'] text-[12px] text-[#666] dark:text-[#94a3b8] mt-[4px]">
                {adding.short}
              </p>
            </div>
          </div>

          <p className="font-['Poppins'] text-[13px] text-[#57534e] dark:text-[#a8a29e] mb-[18px] leading-relaxed">
            To add this
            {' '}
            <span className="font-semibold text-[#0e1c47] dark:text-white">{adding.badge.toLowerCase()}</span>
            {' '}
            item, clear your
            {' '}
            <span className="font-semibold text-[#0e1c47] dark:text-white">{inCart.badge.toLowerCase()}</span>
            {' '}
            cart first, or finish checkout with what you already have.
          </p>

          <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap sm:justify-end gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              disabled={clearing}
              className="font-['Poppins'] font-semibold px-[18px] py-[11px] rounded-[4px] border border-[#e6e6e6] dark:border-[#334155] text-[#0e1c47] dark:text-white hover:border-[#eea137] transition-colors disabled:opacity-60"
            >
              Keep {inCart.badge.toLowerCase()} cart
            </button>
            <Link
              to={inCart.cartPath}
              onClick={onClose}
              className="font-['Poppins'] font-semibold px-[18px] py-[11px] rounded-[4px] border border-[#0e1c47] text-[#0e1c47] dark:border-[#94a3b8] dark:text-white text-center hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              View {inCart.badge.toLowerCase()} cart
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearAndContinue?.();
              }}
              disabled={clearing}
              className="font-['Poppins'] font-semibold px-[18px] py-[11px] rounded-[4px] bg-[#eea137] text-white hover:bg-[#d8902f] transition-colors disabled:opacity-60"
            >
              {clearing
                ? 'Switching cart…'
                : `Switch to ${adding.badge.toLowerCase()} & add item`}
            </button>
          </div>

          <p className="font-['Poppins'] text-[12px] text-[#94a3b8] mt-[14px]">
            <Link to={adding.shopPath} onClick={onClose} className="text-[#0e1c47] dark:text-[#eea137] hover:underline">
              {adding.shopLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
