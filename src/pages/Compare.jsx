// Compare page — real products from API + persistent list (localStorage + shareable ?ids=)

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProduct } from '../services/catalog.service';
import { useCountry } from '../context/CountryContext';
import {
  clearCompareIds,
  getCompareIds,
  MAX_COMPARE_ITEMS,
  saveCompareIds,
} from '../utils/compareStorage';

import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

const parseIdsParam = (value) => {
  if (!value || typeof value !== 'string') return [];
  return [
    ...new Set(
      value
        .split(/[,;\s]+/)
        .map((s) => Number(String(s).trim()))
        .filter((n) => Number.isFinite(n) && n > 0),
    ),
  ].slice(0, MAX_COMPARE_ITEMS);
};

const buildRowModel = (p) => {
  const origNum = Number(String(p.originalPrice || '').replace(/[^0-9.]/g, '')) || 0;
  const showStrike = origNum > 0 && origNum > p.priceValue + 0.001;
  return {
    id: p.id,
    name: p.name,
    vendorName: p.vendorName || p.brand || '—',
    category: p.category || '—',
    sku: p.sku || '—',
    stock: Number(p.stock ?? 0),
    rating: Number(p.rating ?? 0),
    ratingCount: Number(p.ratingCount ?? 0),
    priceValue: Number(p.priceValue ?? 0),
    showStrike,
    strikePrice: origNum,
    image: p.image || '',
    tag: p.tag || '',
    variantsCount: Array.isArray(p.variants) ? p.variants.length : 0,
  };
};

const SPEC_ROWS = [
  {
    key: 'vendor',
    label: 'Vendor / store',
    value: (row) => row.vendorName,
  },
  {
    key: 'category',
    label: 'Category',
    value: (row) => row.category,
  },
  {
    key: 'sku',
    label: 'SKU',
    value: (row) => row.sku,
  },
  {
    key: 'availability',
    label: 'Availability',
    value: (row) => (row.stock > 0 ? `In stock (${row.stock})` : 'Out of stock'),
  },
  {
    key: 'rating',
    label: 'Customer rating',
    value: (row) => (row.rating > 0 ? `${row.rating.toFixed(1)} (${row.ratingCount} reviews)` : 'No reviews yet'),
  },
  {
    key: 'type',
    label: 'Product type',
    value: (row) => row.tag || '—',
  },
  {
    key: 'variants',
    label: 'Variants',
    value: (row) => (row.variantsCount > 0 ? `${row.variantsCount} option(s)` : 'Simple product'),
  },
];

export default function Compare() {
  const { countryId } = useCountry();
  const [searchParams, setSearchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') || '';

  const [compareIds, setCompareIds] = useState(getCompareIds);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [sharePageUrl, setSharePageUrl] = useState('');

  useEffect(() => {
    setSharePageUrl(`${window.location.origin}/compare`);
  }, []);

  const handleCopyCompareLink = async () => {
    if (!sharePageUrl) return;
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(sharePageUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2200);
    } catch {
      // Clipboard may be blocked; stay silent.
    }
  };

  useEffect(() => {
    const fromUrl = parseIdsParam(idsParam);
    if (!fromUrl.length) return;
    setCompareIds((prev) => {
      const merged = [...new Set([...fromUrl, ...prev])].slice(0, MAX_COMPARE_ITEMS);
      if (JSON.stringify(merged) === JSON.stringify(prev)) return prev;
      return merged;
    });
  }, [idsParam]);

  useEffect(() => {
    saveCompareIds(compareIds, { notify: false });
    const next = compareIds.length ? compareIds.join(',') : '';
    if (next !== idsParam) {
      setSearchParams(next ? { ids: next } : {}, { replace: true });
    }
  }, [compareIds, idsParam, setSearchParams]);

  useEffect(() => {
    const syncFromStorage = () => {
      setCompareIds((prev) => {
        const incoming = getCompareIds();
        if (JSON.stringify(prev) === JSON.stringify(incoming)) return prev;
        return incoming;
      });
    };
    const onStorage = (e) => {
      if (e.key === 'dh_compare_product_ids' || e.key === null) {
        syncFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('dh-compare-updated', syncFromStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('dh-compare-updated', syncFromStorage);
    };
  }, []);

  const compareIdsKey = compareIds.join(',');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!compareIds.length) {
        setRows([]);
        setLoadError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError('');

      const settled = await Promise.allSettled(
        compareIds.map((id) => getProduct({ id, countryId })),
      );

      if (cancelled) return;

      const nextRows = [];
      const missingIds = [];
      let rateLimited = false;

      settled.forEach((result, index) => {
        const id = compareIds[index];
        if (result.status === 'fulfilled' && result.value?.id != null) {
          nextRows.push(buildRowModel(result.value));
          return;
        }
        const status = result.status === 'rejected' ? result.reason?.response?.status : null;
        if (status === 429) {
          rateLimited = true;
          return;
        }
        missingIds.push(id);
      });

      if (rateLimited) {
        setLoadError('Too many requests. Please wait a moment and refresh the page.');
      }

      if (missingIds.length) {
        const remaining = compareIds.filter((id) => !missingIds.includes(id));
        setCompareIds(remaining);
        if (!nextRows.length && !rateLimited) {
          setLoadError('Some products could not be loaded and were removed from your list.');
        }
      }

      setRows(nextRows);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [compareIdsKey, countryId]);

  const removeItem = (id) => {
    setCompareIds((prev) => prev.filter((x) => String(x) !== String(id)));
  };

  const handleClearAll = () => {
    clearCompareIds();
    setCompareIds([]);
    setRows([]);
  };

  const colCount = rows.length + 1;

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
      <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] items-start relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[24px] sm:py-[32px] md:py-[40px]">

        <div className="flex gap-[8px] items-center relative w-full" data-name="Breadcrumb">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] dark:text-[#e5e7eb] text-[14px] hover:text-[#eea137] transition-colors cursor-pointer">
            Home
          </Link>
          <div className="flex items-center justify-center relative size-[18px]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[18px]" data-name="arrow-down">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgArrowDown} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </div>
            </div>
          </div>
          <p className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px]">
            Compare Products
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-[20px] sm:gap-[24px]">
          <div>
            <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47] dark:text-white mb-[8px]">
              Compare Products
            </h1>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] dark:text-[#e5e7eb]">
              Compare up to {MAX_COMPARE_ITEMS} products side by side — from your browsing list or a shared link.
            </p>
          </div>
          {compareIds.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#dc2626] hover:text-[#b91c1c] transition-colors self-start"
            >
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="w-full bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center transition-colors duration-300">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">Loading products…</p>
          </div>
        ) : null}

        {!loading && loadError && rows.length > 0 ? (
          <div className="w-full bg-[#fef2f2] dark:bg-[#450a0a]/40 border border-[#fecaca] dark:border-[#7f1d1d] border-solid rounded-[6px] p-[16px] sm:p-[20px]" role="alert">
            <p className="font-['Poppins'] text-[14px] text-[#991b1b] dark:text-[#fecaca]">{loadError}</p>
          </div>
        ) : null}

        {!loading && compareIds.length > 0 && rows.length === 0 ? (
          <div className="w-full bg-[#fffbeb] dark:bg-[#422006]/50 border border-[#fde68a] dark:border-[#854d0e] border-solid rounded-[6px] p-[20px] sm:p-[24px]" role="status">
            <p className="font-['Poppins'] text-[14px] sm:text-[15px] text-[#92400e] dark:text-[#fde68a]">
              {loadError || 'Unable to load these products right now. You can try again in a few seconds or remove items and add different ones.'}
            </p>
          </div>
        ) : null}

        {!loading && rows.length > 0 ? (
          <div className="w-full overflow-x-auto pb-[8px]">
            <div className="min-w-[720px]">
              <div
                className="grid gap-[16px] sm:gap-[20px]"
                style={{ gridTemplateColumns: `repeat(${colCount}, minmax(180px, 1fr))` }}
              >
                <div className="bg-[#f8f9fa] dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[16px] sm:p-[20px] transition-colors duration-300">
                  <h3 className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47] dark:text-white">
                    Specifications
                  </h3>
                </div>

                {rows.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[16px] sm:p-[20px] relative transition-colors duration-300 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="absolute top-[12px] right-[12px] z-[1] rounded-full p-[4px] text-[#666] dark:text-[#e5e7eb] hover:text-[#dc2626] dark:hover:text-[#f87171] transition-colors"
                      aria-label={`Remove ${item.name} from compare`}
                    >
                      <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex flex-col items-center gap-[12px] sm:gap-[16px] pt-[4px]">
                      <div className="w-full aspect-square max-h-[200px] bg-[#f8f9fa] dark:bg-[#0f172a] rounded-[4px] overflow-hidden transition-colors duration-300">
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.opacity = '0.35';
                          }}
                        />
                      </div>
                      <div className="w-full text-center">
                        <p className="font-['Poppins'] font-medium text-[12px] sm:text-[13px] text-[#666] dark:text-[#e5e7eb] mb-[6px] line-clamp-1">
                          {item.vendorName}
                        </p>
                        <h3 className="font-['Poppins'] font-semibold text-[14px] sm:text-[15px] text-[#0e1c47] dark:text-white mb-[10px] line-clamp-3 min-h-[3.6em]">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-center gap-[10px] mb-[14px] flex-wrap">
                          <span className="font-['Poppins'] font-bold text-[17px] sm:text-[18px] text-[#0e1c47] dark:text-white">
                            ${item.priceValue.toFixed(2)}
                          </span>
                          {item.showStrike ? (
                            <span className="font-['Poppins'] font-normal text-[14px] text-[#9ca3af] line-through">
                              ${item.strikePrice.toFixed(2)}
                            </span>
                          ) : null}
                        </div>
                        <Link
                          to={`/product/${item.id}`}
                          className="inline-block w-full text-center bg-[#eea137] text-white font-['Poppins'] font-semibold px-[16px] py-[10px] rounded-[4px] hover:bg-[#d8902f] transition-colors text-[13px] sm:text-[14px]"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-[20px] sm:mt-[24px] space-y-[10px] sm:space-y-[12px]">
                {SPEC_ROWS.map((spec) => (
                  <div
                    key={spec.key}
                    className="grid gap-[10px] sm:gap-[12px]"
                    style={{ gridTemplateColumns: `repeat(${colCount}, minmax(180px, 1fr))` }}
                  >
                    <div className="bg-[#f8f9fa] dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] px-[14px] py-[12px] sm:py-[14px] transition-colors duration-300 flex items-center">
                      <p className="font-['Poppins'] font-medium text-[13px] sm:text-[14px] text-[#0e1c47] dark:text-white">
                        {spec.label}
                      </p>
                    </div>
                    {rows.map((item) => (
                      <div
                        key={`${item.id}-${spec.key}`}
                        className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] px-[14px] py-[12px] sm:py-[14px] transition-colors duration-300 flex items-center"
                      >
                        <p className="font-['Poppins'] font-normal text-[13px] sm:text-[14px] text-[#444] dark:text-[#e5e7eb] leading-snug">
                          {spec.value(item)}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {!loading && !compareIds.length ? (
          <div className="w-full max-w-[640px] mx-auto bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[8px] shadow-sm px-[28px] sm:px-[40px] py-[40px] sm:py-[48px] text-center transition-colors duration-300">
            <div
              className="mx-auto mb-[24px] flex size-[72px] items-center justify-center rounded-full bg-[#f0f4ff] dark:bg-[#0e1c47]/80 border border-[#e2e8f0] dark:border-[#334155]"
              aria-hidden
            >
              <svg className="size-[34px] text-[#0e1c47] dark:text-[#eea137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
              </svg>
            </div>
            <p className="font-['Poppins'] font-medium text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-[#eea137] mb-[10px]">
              Product comparison
            </p>
            <h3 className="font-['Poppins'] font-bold text-[22px] sm:text-[26px] text-[#0e1c47] dark:text-white mb-[12px] leading-tight">
              Your compare list is empty
            </h3>
            <p className="font-['Poppins'] text-[15px] sm:text-[16px] text-[#555] dark:text-[#cbd5e1] mb-[24px] max-w-[480px] mx-auto leading-relaxed">
              Add up to four products to view prices, availability, and details in one place—so you can decide faster.
            </p>
            <ul className="text-left max-w-[420px] mx-auto mb-[24px] space-y-[14px] font-['Poppins'] text-[14px] text-[#444] dark:text-[#e2e8f0]">
              <li className="flex gap-[12px]">
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#0e1c47] text-[11px] font-bold text-white">1</span>
                <span>
                  On any product page, select <strong className="font-semibold text-[#0e1c47] dark:text-white">Add to Compare</strong> in the actions under the price.
                </span>
              </li>
              <li className="flex gap-[12px]">
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#0e1c47] text-[11px] font-bold text-white">2</span>
                <span>
                  Open <strong className="font-semibold text-[#0e1c47] dark:text-white">Compare</strong> from the header anytime, or use <strong className="font-semibold text-[#0e1c47] dark:text-white">Copy link</strong> below to open this page elsewhere.
                </span>
              </li>
            </ul>
            <div className="w-full max-w-[440px] mx-auto mb-[28px] rounded-[8px] border border-[#e6e6e6] dark:border-[#334155] bg-gradient-to-b from-[#fafbfd] to-white dark:from-[#1e293b] dark:to-[#0f172a] p-[20px] sm:p-[22px] text-left shadow-[0_1px_3px_rgba(14,28,71,0.06)]">
              <div className="flex items-start gap-[14px] mb-[16px]">
                <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#0e1c47] text-white dark:bg-[#eea137] dark:text-[#0e1c47]" aria-hidden>
                  <svg className="size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="min-w-0 pt-[2px]">
                  <p className="font-['Poppins'] font-semibold text-[15px] text-[#0e1c47] dark:text-white leading-snug">
                    Share this page
                  </p>
                  <p className="font-['Poppins'] text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-[4px] leading-relaxed">
                    Anyone with the link can open your compare workspace. After you add products, copy the URL from the address bar to share the full list (up to {MAX_COMPARE_ITEMS} items).
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-[10px] sm:items-stretch">
                <div className="flex-1 min-w-0 flex items-center rounded-[6px] border border-[#d0d7de] dark:border-[#475569] bg-white dark:bg-[#0f172a] px-[14px] py-[11px]">
                  <p
                    className="font-['Poppins'] text-[13px] text-[#0e1c47] dark:text-[#e2e8f0] truncate"
                    title={sharePageUrl || 'Loading…'}
                  >
                    {sharePageUrl || 'Loading…'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCompareLink}
                  disabled={!sharePageUrl}
                  className="shrink-0 font-['Poppins'] font-semibold text-[13px] px-[22px] py-[11px] rounded-[6px] bg-[#0e1c47] dark:bg-[#eea137] text-white dark:text-[#0e1c47] hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eea137] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {shareCopied ? 'Copied' : 'Copy link'}
                </button>
              </div>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center justify-center min-w-[200px] bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors shadow-sm"
            >
              Browse products
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
