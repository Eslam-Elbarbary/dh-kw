import { Link } from 'react-router-dom';
import { ProductCardQuickActions } from './ProductCardQuickActions';
import { productNeedsVariantPick } from '../utils/productVariants';

const badgeClass = (badge) => {
  if (badge === '32% OFF') return 'bg-[#fc0]';
  if (badge === 'Only 10 Left') return 'bg-[#ff9500]';
  if (badge === 'HOT') return 'bg-[#ee5858] rounded-[1.856px]';
  return 'bg-[#0e1c47]';
};

const badgeTextClass = (badge) =>
  badge === '32% OFF' ? 'text-[#191c1f]' : 'text-white';

/**
 * Standard catalog product card (search, category, favorites, related products).
 */
export function ProductCard({
  product,
  className = '',
  isFavorite = false,
  inCompare = false,
  favoriteBusy = false,
  cartBusy = false,
  onToggleFavorite,
  onAddToCompare,
  onAddToCart,
  onVariantChoiceView,
  onVariantChoiceCart,
}) {
  if (!product?.id) return null;

  const badges = Array.isArray(product.badges) ? product.badges : [];
  const needsVariant = productNeedsVariantPick(product);

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group bg-white dark:bg-[#1e293b] border-[#e4e7e9] dark:border-[#334155] border-[0.849px] border-solid flex flex-col gap-[6.789px] items-start overflow-hidden p-[13.578px] rounded-[3.394px] hover:shadow-lg transition-all cursor-pointer ${className}`}
      data-name="Product"
    >
      <div className="h-[159.537px] relative w-full bg-[#f5f5f5] dark:bg-[#0f172a] flex items-center justify-center" data-name="Image">
        {product.image ? (
          <img
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            src={product.image}
          />
        ) : (
          <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[12px] text-center px-[8px]">
            No image
          </p>
        )}

        <ProductCardQuickActions
          variantChoiceRequired={needsVariant}
          onVariantChoiceView={onVariantChoiceView}
          onVariantChoiceCart={onVariantChoiceCart}
          isFavorite={isFavorite}
          inCompare={inCompare}
          favoriteBusy={favoriteBusy}
          cartBusy={cartBusy}
          onToggleFavorite={onToggleFavorite}
          onAddToCompare={onAddToCompare}
          onAddToCart={onAddToCart}
        />

        {badges.length > 0 ? (
          <div className="absolute flex flex-col gap-[6.789px] items-start left-[13.15px] top-[13.15px]" data-name="Badge">
            {badges.map((badge, badgeIdx) => (
              <div
                key={`${badge}-${badgeIdx}`}
                className={`flex items-start px-[8.486px] py-[4.243px] rounded-[3.394px] ${badgeClass(badge)}`}
              >
                <p className={`font-['Poppins'] font-semibold leading-[13.578px] text-[10.183px] ${badgeTextClass(badge)}`}>
                  {badge}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-[6.789px] items-start w-full" data-name="Content">
        <p className="font-['Poppins'] font-semibold leading-[16.972px] text-[#191c1f] dark:text-white text-[12px] w-full line-clamp-2">
          {product.name}
        </p>
        <p className="capitalize font-['Poppins'] font-medium leading-[18.563px] text-[#999] dark:text-[#9ca3af] text-[12px] line-clamp-1">
          {product.brand}
        </p>
        <div className="flex font-['Poppins'] font-semibold gap-[3.394px] items-start leading-[16.972px] text-[12px]" data-name="Price">
          {product.showStrike && product.originalPrice ? (
            <p className="line-through text-[#929fa5]">{product.originalPrice}</p>
          ) : null}
          <p className="text-[#00a651]">{product.salePrice || product.price}</p>
        </div>
      </div>
    </Link>
  );
}
