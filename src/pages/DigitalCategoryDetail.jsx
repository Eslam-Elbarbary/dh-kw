// Single digital category — GET /api/digital-categories/:id (includes products[])

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDigitalCategory } from '../services/digitalProducts.service';
import { useCountry } from '../context/CountryContext';
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrow = arrowDownIcon;

function ProductTile({ item }) {
  return (
    <Link
      to={`/digital-product/${item.id}`}
      className="group flex flex-col rounded-[14px] overflow-hidden bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] shadow-[0_2px_16px_rgba(14,28,71,0.06)] hover:shadow-[0_12px_32px_rgba(14,28,71,0.12)] hover:border-[#eea137]/40 transition-all duration-300 hover:-translate-y-[2px]"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#eef2f9] to-[#f8fafc] dark:from-[#1a2744] dark:to-[#0f172a]">
        <span className="absolute top-[10px] left-[10px] z-[1] font-['Poppins'] text-[9px] font-bold uppercase tracking-wider px-[7px] py-[2px] rounded-[5px] bg-[#0e1c47]/90 text-white">
          Digital
        </span>
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className="absolute inset-0 w-full h-full object-contain p-[12px] sm:p-[14px] group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#94a3b8] text-[13px] font-['Poppins']">No image</div>
        )}
      </div>
      <div className="p-[14px] sm:p-[16px] flex flex-col gap-[6px] flex-1">
        <h3 className="font-['Poppins'] font-semibold text-[#0f172a] dark:text-white text-[13px] sm:text-[14px] leading-snug line-clamp-2 min-h-[2.4rem]">
          {item.name}
        </h3>
        {item.companyName ? (
          <p className="font-['Poppins'] text-[11px] text-[#64748b] dark:text-[#94a3b8] line-clamp-1">{item.companyName}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-[8px] pt-[8px] border-t border-[#f1f5f9] dark:border-[#334155]">
          <span className="font-['Poppins'] font-bold text-[#059669] dark:text-[#34d399] text-[15px] tabular-nums">
            {item.priceFormatted}
          </span>
          <span className="font-['Poppins'] font-semibold text-[11px] text-[#0e1c47] dark:text-[#eea137] inline-flex items-center gap-[4px] shrink-0 group-hover:gap-[6px] transition-all">
            Order
            <img alt="" className="size-[13px] rotate-[-90deg] opacity-85 group-hover:translate-x-[2px] transition-transform" src={imgArrow} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function DigitalCategoryDetail() {
  const { id } = useParams();
  const { countryId } = useCountry();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) {
        setError('Missing category.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await getDigitalCategory({ id, countryId });
        if (cancelled) return;
        if (!res.category?.id) {
          setError('Category not found.');
          setCategory(null);
          setProducts([]);
        } else {
          setCategory(res.category);
          setProducts(res.products);
        }
      } catch (e) {
        if (cancelled) return;
        setCategory(null);
        setProducts([]);
        setError(e?.response?.data?.message || e?.message || 'Failed to load category.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, countryId]);

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
      {loading ? (
        <div className="h-[320px] bg-[#e2e8f0] dark:bg-[#1e293b] animate-pulse" />
      ) : error || !category ? (
        <div className="max-w-[720px] mx-auto px-[20px] py-[48px]">
          <div className="rounded-[12px] border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-[20px] py-[18px]">
            <p className="font-['Poppins'] text-[15px] text-red-800 dark:text-red-200">{error || 'Category not found.'}</p>
            <Link to="/digital-categories" className="inline-block mt-[14px] font-['Poppins'] font-semibold text-[#0e1c47] dark:text-[#eea137] text-[14px] hover:underline">
              ← Back to categories
            </Link>
          </div>
        </div>
      ) : (
        <>
          <header className="relative overflow-hidden bg-[#0e1c47] dark:bg-[#0a1529] text-white">
            {category.image ? (
              <>
                <img
                  src={category.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-25 blur-[2px] scale-105"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0e1c47] via-[#0e1c47]/92 to-[#0e1c47]/85 dark:from-[#0a1529] dark:via-[#0a1529]/95 dark:to-[#0a1529]/88" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0e1c47] to-[#1a2d5a] dark:from-[#0a1529] dark:to-[#0f172a]" />
            )}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,#eea137,transparent)]" aria-hidden />

            <div className="relative max-w-[1240px] lg:max-w-[1400px] mx-auto px-[16px] sm:px-[24px] md:px-[40px] py-[36px] sm:py-[44px] md:py-[52px]">
              <div className="flex flex-wrap gap-[8px] items-center text-[13px] text-white/70 mb-[20px]">
                <Link to="/" className="hover:text-[#eea137] transition-colors">Home</Link>
                <span>/</span>
                <Link to="/digital-products" className="hover:text-[#eea137] transition-colors">Digital products</Link>
                <span>/</span>
                <Link to="/digital-categories" className="hover:text-[#eea137] transition-colors">Categories</Link>
                <span>/</span>
                <span className="text-[#eea137] font-medium line-clamp-1">{category.name}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-[24px] md:gap-[36px]">
                {category.image ? (
                  <div className="shrink-0 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-[20px] bg-white p-[12px] shadow-xl flex items-center justify-center">
                    <img src={category.image} alt="" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-['Poppins'] text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.18em] text-[#eea137] mb-[8px]">
                    Digital category
                  </p>
                  <h1 className="font-['Poppins'] font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-[1.1] tracking-tight">
                    {category.name}
                  </h1>
                  <p className="font-['Poppins'] text-[15px] text-white/85 mt-[12px] max-w-[640px] leading-relaxed">
                    {products.length} {products.length === 1 ? 'product' : 'products'} available. Order on the product page — no shopping cart for digital items.
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-[16px] sm:px-[24px] md:px-[40px] py-[32px] sm:py-[40px] md:py-[48px]">
            {products.length === 0 ? (
              <div className="rounded-[16px] bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] px-[28px] py-[40px] text-center">
                <p className="font-['Poppins'] text-[16px] text-[#64748b] dark:text-[#94a3b8]">
                  No products in this category yet.
                </p>
                <Link
                  to="/digital-categories"
                  className="inline-block mt-[16px] font-['Poppins'] font-semibold text-[#0e1c47] dark:text-[#eea137] text-[14px] hover:underline"
                >
                  Browse other categories
                </Link>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[12px] mb-[24px]">
                  <div>
                    <h2 className="font-['Poppins'] font-bold text-[#0f172a] dark:text-white text-[20px] sm:text-[22px]">
                      Products
                    </h2>
                    <p className="font-['Poppins'] text-[14px] text-[#64748b] dark:text-[#94a3b8] mt-[4px]">
                      Select an item to view details and place a direct order.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px] sm:gap-[20px] md:gap-[22px]">
                  {products.map((item) => (
                    <ProductTile key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </main>
        </>
      )}
    </div>
  );
}
