// Paginated catalog for API digital products only (separate from /search and /product).

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDigitalProducts } from '../services/digitalProducts.service';
import { useCountry } from '../context/CountryContext';
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;
const PER_PAGE = 15;

function DigitalProductCard({ item }) {
  const unavailable = !item.isAvailable;
  return (
    <Link
      to={`/digital-product/${item.id}`}
      className={`bg-white dark:bg-[#1e293b] border border-[#e4e7e9] dark:border-[#334155] border-solid flex flex-col gap-[12px] items-stretch overflow-hidden p-[14px] rounded-[6px] w-full hover:shadow-lg transition-shadow cursor-pointer ${
        unavailable ? 'opacity-75' : ''
      }`}
    >
      <div className="aspect-[4/3] w-full bg-[#f5f5f5] dark:bg-[#0f172a] rounded-[4px] overflow-hidden flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt="" className="w-full h-full object-contain" />
        ) : (
          <span className="font-['Poppins'] text-[12px] text-[#999] dark:text-[#64748b]">No image</span>
        )}
      </div>
      <div className="flex flex-col gap-[6px] min-h-0">
        <p className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[13px] sm:text-[14px] line-clamp-2 leading-snug">
          {item.name}
        </p>
        {item.merchantName ? (
          <p className="font-['Poppins'] text-[11px] sm:text-[12px] text-[#64748b] dark:text-[#94a3b8] line-clamp-1">
            {item.merchantName}
          </p>
        ) : null}
        <p className="font-['Poppins'] font-bold text-[#00a651] dark:text-[#4ade80] text-[15px]">
          {item.priceFormatted}
        </p>
        {unavailable ? (
          <span className="font-['Poppins'] text-[11px] text-[#b45309] dark:text-[#fbbf24]">Currently unavailable</span>
        ) : null}
      </div>
    </Link>
  );
}

export default function DigitalProductsList() {
  const { countryId, countryCode, countryCurrencyCode } = useCountry();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: PER_PAGE,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getDigitalProducts({
          countryId,
          countryCode,
          fallbackCurrencyCode: countryCurrencyCode,
          page,
          perPage: PER_PAGE,
        });
        if (cancelled) return;
        setItems(res.items);
        setMeta(res.meta);
      } catch (e) {
        if (cancelled) return;
        setItems([]);
        setError(e?.response?.data?.message || e?.message || 'Failed to load digital products.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [countryId, countryCode, countryCurrencyCode, page]);

  const goToPage = (next) => {
    const target = Math.max(1, next);
    if (target === page) return;
    if (target > page && target > meta.lastPage && !meta.hasNextPage) return;
    setSearchParams(target <= 1 ? {} : { page: String(target) }, { replace: false });
  };

  const showPagination =
    meta.lastPage > 1
    || meta.hasNextPage
    || meta.hasPrevPage
    || meta.currentPage > 1;

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
      <div className="flex flex-col gap-[28px] sm:gap-[36px] items-start w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="flex gap-[8px] items-center w-full flex-wrap">
          <Link to="/" className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#e5e7eb] hover:text-[#eea137]">
            Home
          </Link>
          <div className="flex items-center justify-center size-[18px] rotate-[270deg]">
            <img alt="" className="size-full" src={imgArrowDown} />
          </div>
          <span className="font-['Poppins'] text-[14px] text-[#eea137]">Digital products</span>
        </div>

        <div className="w-full flex flex-col lg:flex-row lg:items-end lg:justify-between gap-[16px]">
          <div>
            <div className="flex items-center gap-[8px] mb-[8px]">
              <span className="w-[4px] h-[28px] bg-[#eea137] rounded-[2px]" aria-hidden />
              <h1 className="font-['Poppins'] font-bold text-[#0e1c47] dark:text-white text-[28px] sm:text-[36px] md:text-[40px] leading-tight">
                Digital products
              </h1>
            </div>
            <p className="font-['Poppins'] text-[15px] sm:text-[16px] text-[#666] dark:text-[#94a3b8] max-w-[640px]">
              Gift cards, vouchers, and digital items from our partners. Ordering uses a separate checkout from regular store products.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-[10px] shrink-0">
            <Link
              to="/digital-categories"
              className="font-['Poppins'] font-semibold text-[14px] px-[18px] py-[10px] rounded-[8px] border-2 border-[#0e1c47] dark:border-[#eea137] text-[#0e1c47] dark:text-[#eea137] hover:bg-[#0e1c47] hover:text-white dark:hover:bg-[#eea137] dark:hover:text-[#0e1c47] transition-colors"
            >
              Browse by category
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="font-['Poppins'] text-[#666] dark:text-[#94a3b8]">Loading digital products…</p>
        ) : error ? (
          <div className="w-full rounded-[6px] border border-[#fecaca] dark:border-[#7f1d1d] bg-[#fef2f2] dark:bg-[#450a0a]/40 px-[16px] py-[12px]" role="alert">
            <p className="font-['Poppins'] text-[14px] text-[#991b1b] dark:text-[#fecaca]">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <p className="font-['Poppins'] text-[#666] dark:text-[#94a3b8]">No digital products available for your region.</p>
        ) : (
          <>
            <p className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#9ca3af]">
              Showing {(meta.currentPage - 1) * meta.perPage + 1}–
              {Math.min(meta.total, meta.currentPage * meta.perPage)} of {meta.total}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[16px] sm:gap-[20px] w-full">
              {items.map((item) => (
                <DigitalProductCard key={item.id} item={item} />
              ))}
            </div>

            {showPagination ? (
              <nav className="flex flex-wrap items-center justify-center gap-[8px] w-full pt-[8px] pb-[24px]" aria-label="Pagination">
                <button
                  type="button"
                  disabled={meta.currentPage <= 1}
                  onClick={() => goToPage(meta.currentPage - 1)}
                  className="font-['Poppins'] text-[14px] px-[14px] py-[8px] rounded-[4px] border border-[#e4e7e9] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#0e1c47] dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#eea137]"
                >
                  Previous
                </button>
                <span className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#94a3b8] px-[8px]">
                  Page {meta.currentPage} of {meta.lastPage}
                </span>
                <button
                  type="button"
                  disabled={meta.currentPage >= meta.lastPage && !meta.hasNextPage}
                  onClick={() => goToPage(meta.currentPage + 1)}
                  className="font-['Poppins'] text-[14px] px-[14px] py-[8px] rounded-[4px] border border-[#e4e7e9] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#0e1c47] dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#eea137]"
                >
                  Next
                </button>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
