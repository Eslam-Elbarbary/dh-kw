// Digital categories index — GET /api/digital-categories

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDigitalCategories } from '../services/digitalProducts.service';
import { useCountry } from '../context/CountryContext';
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrow = arrowDownIcon;
const INITIAL_VISIBLE_CATEGORIES = 3;

export default function DigitalCategoriesList() {
  const { countryId } = useCountry();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const list = await getDigitalCategories({ countryId });
        if (!cancelled) setCategories(list);
      } catch (e) {
        if (!cancelled) {
          setCategories([]);
          setError(e?.response?.data?.message || e?.message || 'Failed to load digital categories.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [countryId]);

  useEffect(() => {
    setShowAll(false);
  }, [countryId]);

  const visibleCategories = useMemo(
    () => (showAll ? categories : categories.slice(0, INITIAL_VISIBLE_CATEGORIES)),
    [categories, showAll],
  );

  const hasMoreCategories = categories.length > INITIAL_VISIBLE_CATEGORIES;

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
      <div className="relative overflow-hidden bg-[#0e1c47] dark:bg-[#0a1529] text-white">
        <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,#eea137,transparent)]" aria-hidden />
        <div className="relative max-w-[1240px] lg:max-w-[1400px] mx-auto px-[16px] sm:px-[24px] md:px-[40px] py-[40px] sm:py-[48px] md:py-[56px]">
          <div className="flex flex-wrap gap-[8px] items-center text-[13px] sm:text-[14px] text-white/75 mb-[20px]">
            <Link to="/" className="hover:text-[#eea137] transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <Link to="/digital-products" className="hover:text-[#eea137] transition-colors">Digital products</Link>
            <span className="opacity-50">/</span>
            <span className="text-[#eea137] font-medium">Categories</span>
          </div>
          <p className="font-['Poppins'] text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#eea137] mb-[10px]">
            Browse by provider
          </p>
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[44px] leading-[1.1] tracking-tight max-w-[720px]">
            Digital categories
          </h1>
          <p className="font-['Poppins'] text-[15px] sm:text-[16px] text-white/80 mt-[14px] max-w-[560px] leading-relaxed">
            Choose a brand or provider to see vouchers and digital products in that catalog. Each category opens a dedicated page with all items.
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-[16px] sm:px-[24px] md:px-[40px] py-[32px] sm:py-[40px] md:py-[48px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[24px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[16px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden animate-pulse h-[280px]" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[12px] border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-[20px] py-[16px]" role="alert">
            <p className="font-['Poppins'] text-[15px] text-red-800 dark:text-red-200">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <p className="font-['Poppins'] text-[16px] text-[#64748b] dark:text-[#94a3b8] text-center py-[48px]">
            No digital categories available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[24px]">
            {visibleCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/digital-category/${cat.id}`}
                className="group relative flex flex-col rounded-[16px] overflow-hidden bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-[0_4px_24px_rgba(14,28,71,0.06)] hover:shadow-[0_20px_40px_rgba(14,28,71,0.12)] hover:border-[#eea137]/35 transition-all duration-300 hover:-translate-y-[4px]"
              >
                <div className="relative h-[200px] sm:h-[220px] bg-gradient-to-br from-[#e8edf5] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#1a2744]">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-[28px] sm:p-[32px] group-hover:scale-[1.05] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-['Poppins'] text-[14px] text-[#94a3b8]">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 dark:opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-[16px] sm:p-[20px]">
                    <span className="inline-flex items-center gap-[6px] font-['Poppins'] text-[12px] font-semibold text-white drop-shadow-md">
                      View catalog
                      <img alt="" className="size-[14px] rotate-[-90deg] brightness-0 invert opacity-90 group-hover:translate-x-[3px] transition-transform" src={imgArrow} />
                    </span>
                  </div>
                </div>
                <div className="p-[18px] sm:p-[22px] flex flex-col gap-[8px] flex-1">
                  <h2 className="font-['Poppins'] font-bold text-[#0f172a] dark:text-white text-[18px] sm:text-[20px] leading-snug group-hover:text-[#0e1c47] dark:group-hover:text-[#eea137] transition-colors">
                    {cat.name}
                  </h2>
                  {cat.productsCount != null ? (
                    <p className="font-['Poppins'] text-[13px] text-[#64748b] dark:text-[#94a3b8]">
                      {cat.productsCount} {cat.productsCount === 1 ? 'product' : 'products'}
                    </p>
                  ) : (
                    <p className="font-['Poppins'] text-[13px] text-[#64748b] dark:text-[#94a3b8]">
                      Digital vouchers &amp; codes
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && hasMoreCategories && !showAll ? (
          <div className="mt-[40px] flex flex-wrap justify-center gap-[12px]">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="font-['Poppins'] font-semibold text-[14px] px-[22px] py-[11px] rounded-[10px] bg-[#eea137] text-[#0e1c47] hover:bg-[#d8902f] transition-colors"
            >
              All digital categories
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
