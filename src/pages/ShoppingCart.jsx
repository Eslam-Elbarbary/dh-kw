import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

export default function ShoppingCart() {
  const {
    cart,
    loadingCart,
    cartError,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    applyCartCoupon,
  } = useCart();

  const [busyItemId, setBusyItemId] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const summary = useMemo(
    () => cart?.summary || { subtotal: 0, shipping: 0, discount: 0, tax: 0, total: 0 },
    [cart?.summary]
  );

  const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

  const handleQuantityChange = async (item, delta) => {
    const currentQuantity = Math.max(1, Number(item.quantity || 1));
    if (delta < 0 && currentQuantity <= 1) {
      await handleRemove(item);
      return;
    }
    const nextQuantity = Math.max(1, currentQuantity + delta);
    try {
      setBusyItemId(item.id || item.productId);
      setActionError('');
      setActionSuccess('');
      await updateCartItemQuantity({
        cartItemId: item.id,
        productId: item.productId,
        quantity: nextQuantity,
        variantId: item.variantId,
      });
    } catch (error) {
      setActionError(error?.response?.data?.message || 'Failed to update quantity.');
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemove = async (item) => {
    try {
      setBusyItemId(item.id || item.productId);
      setActionError('');
      setActionSuccess('');
      await removeCartItem({ cartItemId: item.id, productId: item.productId, variantId: item.variantId });
    } catch (error) {
      setActionError(error?.response?.data?.message || 'Failed to remove item.');
    } finally {
      setBusyItemId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setActionError('');
      setActionSuccess('');
      await clearCart();
      setActionSuccess('Cart cleared successfully.');
    } catch (error) {
      setActionError(error?.response?.data?.message || 'Failed to clear cart.');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setCouponBusy(true);
      setActionError('');
      setActionSuccess('');
      await applyCartCoupon({ code: couponCode.trim() });
      setActionSuccess('Coupon applied successfully.');
    } catch (error) {
      setActionError(error?.response?.data?.message || 'Failed to apply coupon.');
    } finally {
      setCouponBusy(false);
    }
  };

  return (
    <div className="bg-white min-h-screen px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] py-[24px]">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex gap-[8px] items-center mb-[20px]">
          <Link to="/" className="font-['Poppins'] text-[#666] text-[14px] hover:text-[#eea137]">Home</Link>
          <div className="flex-none rotate-[270deg]"><img alt="" className="size-[18px]" src={imgArrowDown} /></div>
          <span className="font-['Poppins'] text-[#eea137] text-[14px]">Shopping Cart</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-[20px]">
          <div className="flex-1 border border-[#e4e7e9] rounded-[12px]">
            <div className="px-[20px] py-[16px] border-b border-[#e4e7e9]">
              <h1 className="font-['Poppins'] font-semibold text-[20px] text-[#191c1f]">Shopping Cart</h1>
            </div>

            {(cartError || actionError) ? (
              <p className="mx-[20px] mt-[12px] text-[14px] text-[#b42318] font-['Poppins']">{cartError || actionError}</p>
            ) : null}
            {actionSuccess ? (
              <p className="mx-[20px] mt-[12px] text-[14px] text-[#027a48] font-['Poppins']">{actionSuccess}</p>
            ) : null}

            {loadingCart ? (
              <p className="p-[20px] font-['Poppins'] text-[#666]">Loading cart...</p>
            ) : cart.items.length === 0 ? (
              <div className="p-[20px]">
                <p className="font-['Poppins'] text-[#666] mb-[12px]">Your cart is empty.</p>
                <Link to="/search" className="inline-block bg-[#0e1c47] text-white px-[16px] py-[10px] rounded-[4px] font-['Poppins'] text-[14px]">Continue Shopping</Link>
              </div>
            ) : (
              <div className="p-[20px] space-y-[14px]">
                {cart.items.map((item) => {
                  return (
                    <div key={`${item.id}-${item.productId}`} className="border border-[#e4e7e9] rounded-[8px] p-[12px] flex flex-col sm:flex-row sm:items-center gap-[12px]">
                      <div className="size-[72px] rounded-[4px] overflow-hidden bg-[#f5f5f5] shrink-0">
                        {item.image ? <img src={item.image} alt={item.name} className="size-full object-cover" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-['Poppins'] text-[14px] text-[#191c1f] line-clamp-2">{item.name}</p>
                        <p className="font-['Poppins'] text-[13px] text-[#666] mt-[2px]">Unit: {formatMoney(item.unitPrice)}</p>
                        <p className="font-['Poppins'] text-[13px] text-[#0e1c47] mt-[2px]">Sub-total: {formatMoney(item.subtotal)}</p>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <button type="button" onClick={() => handleQuantityChange(item, -1)} className="w-[30px] h-[30px] border rounded-[4px] cursor-pointer">-</button>
                        <span className="font-['Poppins'] text-[14px] w-[28px] text-center">{item.quantity}</span>
                        <button type="button" onClick={() => handleQuantityChange(item, 1)} className="w-[30px] h-[30px] border rounded-[4px] cursor-pointer">+</button>
                      </div>
                      <button type="button" onClick={() => handleRemove(item)} className="text-[#dc2626] font-['Poppins'] text-[13px] hover:underline cursor-pointer">Remove</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-full lg:w-[360px] border border-[#e4e7e9] rounded-[12px] p-[20px] h-fit">
            <h2 className="font-['Poppins'] font-semibold text-[18px] text-[#191c1f] mb-[12px]">Cart Totals</h2>
            <div className="space-y-[8px] mb-[16px]">
              <div className="flex justify-between font-['Poppins'] text-[14px]"><span className="text-[#666]">Sub-total</span><span>{formatMoney(summary.subtotal)}</span></div>
              <div className="flex justify-between font-['Poppins'] text-[14px]"><span className="text-[#666]">Shipping</span><span>{summary.shipping > 0 ? formatMoney(summary.shipping) : 'Free'}</span></div>
              <div className="flex justify-between font-['Poppins'] text-[14px]"><span className="text-[#666]">Discount</span><span>{formatMoney(summary.discount)}</span></div>
              <div className="flex justify-between font-['Poppins'] text-[14px]"><span className="text-[#666]">Tax</span><span>{formatMoney(summary.tax)}</span></div>
              <div className="border-t pt-[8px] flex justify-between font-['Poppins'] font-semibold text-[16px]"><span>Total</span><span>{formatMoney(summary.total)} USD</span></div>
            </div>

            <div className="flex gap-[8px] mb-[12px]">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 border border-[#e4e7e9] rounded-[4px] px-[10px] py-[9px] font-['Poppins'] text-[13px]"
              />
              <button type="button" disabled={couponBusy} onClick={handleApplyCoupon} className="bg-[#eea137] text-white px-[12px] rounded-[4px] font-['Poppins'] text-[13px] disabled:opacity-60">
                {couponBusy ? 'Applying...' : 'Apply'}
              </button>
            </div>

            <div className="flex gap-[8px]">
              <button type="button" onClick={handleClearCart} className="flex-1 border border-[#dc2626] text-[#dc2626] rounded-[4px] py-[10px] font-['Poppins'] text-[13px]">Clear Cart</button>
              <Link to="/checkout" className="flex-1 bg-[#0e1c47] text-white text-center rounded-[4px] py-[10px] font-['Poppins'] text-[13px]">Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
