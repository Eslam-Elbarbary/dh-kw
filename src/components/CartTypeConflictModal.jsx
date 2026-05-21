import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { CART_ITEM_TYPE } from '../constants/cart';

const typeConfig = {
  [CART_ITEM_TYPE.DIGITAL]: {
    title: 'Digital products',
    badge: 'Digital',
    short: 'Gift cards & codes — instant delivery, no shipping',
    cartPath: '/shopping-cart',
    shopPath: '/digital-products',
    shopLabel: 'Browse digital products',
    color: '#0e1c47',
    lightBg: 'from-[#eef2ff] to-[#f8fafc]',
    border: 'border-[#0e1c47]/20',
    badgeClass: 'bg-[#0e1c47] text-white shadow-[0_2px_8px_rgba(14,28,71,0.25)]',
    ring: 'ring-[#0e1c47]/15',
    icon: (
      <svg className="size-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  [CART_ITEM_TYPE.PHYSICAL]: {
    title: 'Physical products',
    badge: 'Physical',
    short: 'Shipped to your delivery address',
    cartPath: '/shopping-cart',
    shopPath: '/search',
    shopLabel: 'Continue shopping',
    color: '#eea137',
    lightBg: 'from-[#fff8eb] to-[#fffdf7]',
    border: 'border-[#eea137]/35',
    badgeClass: 'bg-[#eea137] text-white shadow-[0_2px_8px_rgba(238,161,55,0.35)]',
    ring: 'ring-[#eea137]/20',
    icon: (
      <svg className="size-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
};

function TypeCard({ config, label, highlighted }) {
  return (
    <div
      className={[
        'relative flex flex-col rounded-[12px] border bg-gradient-to-br p-[16px] sm:p-[18px] transition-shadow',
        config.border,
        config.lightBg,
        highlighted ? `ring-2 ${config.ring} shadow-[0_8px_24px_rgba(14,28,71,0.08)]` : 'shadow-sm',
      ].join(' ')}
    >
      <p className="font-['Poppins'] text-[10px] font-bold uppercase tracking-[0.08em] text-[#94a3b8] mb-[10px]">
        {label}
      </p>
      <div className="flex items-start gap-[12px]">
        <div
          className="flex size-[44px] shrink-0 items-center justify-center rounded-[10px] text-white"
          style={{ backgroundColor: config.color }}
        >
          {config.icon}
        </div>
        <div className="min-w-0 flex-1 pt-[2px]">
          <span className={`inline-flex items-center rounded-[6px] px-[9px] py-[4px] text-[10px] font-bold uppercase tracking-wide ${config.badgeClass}`}>
            {config.badge}
          </span>
          <p className="font-['Poppins'] font-semibold text-[15px] text-[#0e1c47] dark:text-white mt-[8px] leading-tight">
            {config.title}
          </p>
          <p className="font-['Poppins'] text-[12px] text-[#64748b] dark:text-[#94a3b8] mt-[5px] leading-relaxed">
            {config.short}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CartTypeConflictModal({
  open,
  conflict,
  clearing,
  onClose,
  onClearAndContinue,
}) {
  const handleClose = useCallback((event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (clearing || !onClose) return;
    onClose();
  }, [clearing, onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleClose(event);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, handleClose]);

  if (!open || !conflict || typeof document === 'undefined') return null;

  const inCartType = conflict.cartHasType === CART_ITEM_TYPE.DIGITAL
    ? CART_ITEM_TYPE.DIGITAL
    : CART_ITEM_TYPE.PHYSICAL;
  const addingType = conflict.attemptedType === CART_ITEM_TYPE.DIGITAL
    ? CART_ITEM_TYPE.DIGITAL
    : CART_ITEM_TYPE.PHYSICAL;

  const inCart = typeConfig[inCartType];
  const adding = typeConfig[addingType];

  const content = (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-[16px] sm:p-[24px] animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-type-conflict-title"
      dir="ltr"
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
      <button
        type="button"
        className="absolute inset-0 z-0 bg-[#0e1c47]/60 backdrop-blur-[6px] cursor-pointer"
        aria-label="Close dialog"
        onClick={handleClose}
      />
      <div
        className="relative z-10 w-full max-w-[600px] animate-[slideUp_0.25s_ease-out] overflow-hidden rounded-[16px] bg-white dark:bg-[#1e293b] shadow-[0_32px_64px_-12px_rgba(14,28,71,0.35)] ring-1 ring-black/5 dark:ring-white/10 text-left pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0e1c47] via-[#152a5c] to-[#1a3278] px-[24px] pt-[22px] pb-[20px] sm:px-[28px] sm:pt-[26px] sm:pb-[22px]">
          <div className="pointer-events-none absolute -right-[40px] -top-[40px] size-[140px] rounded-full bg-[#eea137]/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-[20px] bottom-0 size-[100px] rounded-full bg-white/5 blur-xl" />
          <button
            type="button"
            onClick={handleClose}
            disabled={clearing}
            className="absolute right-[14px] top-[14px] z-30 flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-white/15 text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-white/20 hover:bg-white/30 hover:ring-white/40 active:scale-95 active:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eea137] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1c47] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            aria-label="Close dialog"
          >
            <svg className="size-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative z-0 flex gap-[14px] items-start pr-[44px] pointer-events-none">
            <span className="flex size-[48px] shrink-0 items-center justify-center rounded-[12px] bg-[#eea137]/20 text-[#eea137] ring-1 ring-[#eea137]/30">
              <svg className="size-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 5c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="cart-type-conflict-title" className="font-['Poppins'] font-semibold text-[19px] sm:text-[21px] text-white leading-snug tracking-tight">
                Different cart type required
              </h2>
              <p className="font-['Poppins'] text-[13px] sm:text-[14px] text-white/75 mt-[6px] leading-relaxed max-w-[420px]">
                Your checkout supports one product type per order. Choose how to continue below.
              </p>
            </div>
          </div>
        </div>

        <div className="px-[20px] py-[22px] sm:px-[28px] sm:py-[26px]">
          {/* API message */}
          <div className="mb-[20px] rounded-[10px] border border-[#e8ecf4] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#0f172a]/80 px-[14px] py-[12px] flex gap-[10px] items-start">
            <span className="mt-[2px] flex size-[20px] shrink-0 items-center justify-center rounded-full bg-[#0e1c47]/10 text-[#0e1c47]">
              <svg className="size-[12px]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="font-['Poppins'] text-[13px] sm:text-[14px] text-[#475569] dark:text-[#cbd5e1] leading-relaxed">
              {conflict.message}
            </p>
          </div>

          {conflict.actionError ? (
            <div className="mb-[18px] flex gap-[10px] items-start rounded-[10px] border border-[#fecaca] bg-[#fef2f2] dark:bg-[#450a0a]/30 dark:border-[#7f1d1d] px-[14px] py-[12px]">
              <svg className="size-[18px] shrink-0 text-[#dc2626] mt-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-['Poppins'] text-[13px] text-[#b91c1c] dark:text-[#fca5a5] leading-relaxed">
                {conflict.actionError}
              </p>
            </div>
          ) : null}

          {/* Comparison with arrow */}
          <div className="mb-[20px] grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-[12px] sm:gap-[10px] items-stretch">
            <TypeCard config={inCart} label="Currently in cart" highlighted={false} />
            <div className="hidden sm:flex flex-col items-center justify-center px-[4px] text-[#cbd5e1]">
              <svg className="size-[28px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-['Poppins'] text-[10px] font-medium text-[#94a3b8] mt-[4px]">switch</span>
            </div>
            <div className="flex sm:hidden items-center justify-center gap-[8px] py-[2px]">
              <div className="h-px flex-1 bg-[#e2e8f0]" />
              <span className="font-['Poppins'] text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">to</span>
              <div className="h-px flex-1 bg-[#e2e8f0]" />
            </div>
            <TypeCard config={adding} label="Product you selected" highlighted />
          </div>

          <p className="font-['Poppins'] text-[13px] text-[#64748b] dark:text-[#94a3b8] mb-[22px] leading-relaxed text-center sm:text-left">
            Clear your
            {' '}
            <span className="font-semibold text-[#0e1c47] dark:text-white">{inCart.badge.toLowerCase()}</span>
            {' '}
            cart to add this
            {' '}
            <span className="font-semibold text-[#0e1c47] dark:text-white">{adding.badge.toLowerCase()}</span>
            {' '}
            item, or complete checkout with items already in your cart.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-[10px]">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearAndContinue?.();
              }}
              disabled={clearing}
              className="group w-full font-['Poppins'] font-semibold text-[14px] sm:text-[15px] px-[20px] py-[14px] rounded-[10px] bg-[#eea137] text-white shadow-[0_4px_14px_rgba(238,161,55,0.45)] hover:bg-[#e0922e] hover:shadow-[0_6px_20px_rgba(238,161,55,0.5)] active:scale-[0.99] transition-all duration-200 disabled:opacity-65 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-[8px]"
            >
              {clearing ? (
                <>
                  <span className="size-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Switching cart…
                </>
              ) : (
                <>
                  Switch to {adding.badge.toLowerCase()} & add item
                  <svg className="size-[18px] opacity-90 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
              <button
                type="button"
                onClick={handleClose}
                disabled={clearing}
                className="font-['Poppins'] font-medium text-[13px] sm:text-[14px] px-[16px] py-[12px] rounded-[10px] border border-[#e2e8f0] dark:border-[#475569] text-[#475569] dark:text-[#e2e8f0] bg-white dark:bg-transparent hover:border-[#cbd5e1] hover:bg-[#f8fafc] dark:hover:bg-[#334155]/50 transition-colors disabled:opacity-60"
              >
                Keep {inCart.badge.toLowerCase()} cart
              </button>
              <Link
                to={inCart.cartPath}
                onClick={handleClose}
                className="font-['Poppins'] font-medium text-[13px] sm:text-[14px] px-[16px] py-[12px] rounded-[10px] border border-[#0e1c47]/25 text-[#0e1c47] dark:text-white dark:border-[#64748b] text-center hover:bg-[#f0f4ff] dark:hover:bg-[#334155]/50 transition-colors flex items-center justify-center gap-[6px]"
              >
                <svg className="size-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View {inCart.badge.toLowerCase()} cart
              </Link>
            </div>
          </div>

          <div className="mt-[20px] pt-[18px] border-t border-[#f1f5f9] dark:border-[#334155]">
            <p className="font-['Poppins'] text-[11px] font-medium uppercase tracking-[0.06em] text-[#94a3b8] text-center sm:text-left mb-[10px]">
              Or explore instead
            </p>
            <Link
              to={adding.shopPath}
              onClick={handleClose}
              className={[
                'group flex w-full items-center justify-between gap-[12px] rounded-[10px] border px-[14px] py-[12px] sm:px-[16px] sm:py-[13px]',
                'font-["Poppins"] text-[13px] sm:text-[14px] font-semibold transition-all duration-200',
                'hover:shadow-[0_4px_16px_rgba(14,28,71,0.08)] active:scale-[0.995]',
                addingType === CART_ITEM_TYPE.DIGITAL
                  ? 'border-[#0e1c47]/15 bg-[#f0f4ff] text-[#0e1c47] hover:border-[#0e1c47]/30 hover:bg-[#e8eeff] dark:bg-[#0f172a] dark:border-[#334155] dark:text-white dark:hover:bg-[#1e293b]'
                  : 'border-[#eea137]/25 bg-[#fffbeb] text-[#0e1c47] hover:border-[#eea137]/45 hover:bg-[#fff4d6] dark:bg-[#422006]/20 dark:border-[#eea137]/30 dark:text-[#fde68a] dark:hover:bg-[#422006]/35',
              ].join(' ')}
            >
              <span className="flex items-center gap-[10px] min-w-0">
                <span
                  className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] text-white transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: adding.color }}
                >
                  {addingType === CART_ITEM_TYPE.DIGITAL ? (
                    <svg className="size-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ) : (
                    <svg className="size-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </span>
                <span className="truncate">{adding.shopLabel}</span>
              </span>
              <span
                className={[
                  'flex size-[28px] shrink-0 items-center justify-center rounded-full transition-all duration-200',
                  'group-hover:translate-x-0.5',
                  addingType === CART_ITEM_TYPE.DIGITAL
                    ? 'bg-[#0e1c47]/10 text-[#0e1c47] group-hover:bg-[#0e1c47] group-hover:text-white dark:group-hover:bg-[#eea137] dark:group-hover:text-[#0e1c47]'
                    : 'bg-[#eea137]/15 text-[#b45309] group-hover:bg-[#eea137] group-hover:text-white',
                ].join(' ')}
              >
                <svg className="size-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
