import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/useCart';
import { useCountry } from '../context/CountryContext';
import { CART_ITEM_TYPE } from '../services/cart.service';
import {
  createDigitalOrderFromCart,
  formatDigitalOrderErrorMessage,
  parseDigitalOrderProfileGate,
} from '../services/digitalProducts.service';
import {
  extractDigitalOrderPaymentUrl,
  launchDigitalOrderPayment,
  openPaymentGatewayPlaceholderTab,
  payDigitalOrder,
} from '../services/digitalOrders.service';
import { getCountries } from '../services/meta.service';
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

const extractCreatedDigitalOrderId = (payload) => {
  if (!payload || typeof payload !== 'object') return null;
  const id =
    payload?.order_id
    ?? payload?.data?.digital_order?.id
    ?? payload?.data?.order?.id
    ?? payload?.digital_order?.id
    ?? payload?.order?.id
    ?? payload?.data?.id
    ?? payload?.id;
  return id != null ? String(id) : null;
};

export default function DigitalCheckout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { countryId } = useCountry();
  const { cart, loadingCart, loadCart, isDigitalCart } = useCart();

  const [countries, setCountries] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [profileGate, setProfileGate] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('sadad');

  const selectedCountryCode = useMemo(
    () => countries.find((c) => String(c.id) === String(countryId))?.code || '',
    [countries, countryId],
  );

  const closeProfileGate = useCallback(() => setProfileGate(null), []);
  const closeSuccess = useCallback(() => setSuccessInfo(null), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getCountries();
        if (!cancelled) setCountries(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setCountries([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('signInRedirect', '/digital-checkout');
      navigate('/sign-in');
      return;
    }
    loadCart({ force: true }).catch(() => {});
  }, [isAuthenticated, loadCart, navigate]);

  useEffect(() => {
    if (!profileGate && !successInfo) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (profileGate) closeProfileGate();
        if (successInfo) closeSuccess();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [profileGate, successInfo, closeProfileGate, closeSuccess]);

  const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

  const handlePlaceOrder = async () => {
    if (!cart.items.length) {
      setCheckoutError('Your digital cart is empty.');
      return;
    }
    if (!isDigitalCart && cart.itemType !== CART_ITEM_TYPE.DIGITAL) {
      setCheckoutError('This checkout is only for digital products. Please use the standard checkout for physical items.');
      return;
    }

    const paymentTab = openPaymentGatewayPlaceholderTab();
    try {
      setCheckoutLoading(true);
      setCheckoutError('');

      const latestCart = await loadCart({ force: true }).catch(() => cart);
      if (!latestCart?.items?.length) {
        paymentTab?.close();
        setCheckoutError('Your cart is empty on the server. Please refresh and try again.');
        return;
      }

      const data = await createDigitalOrderFromCart({
        countryId,
        countryCode: selectedCountryCode,
      });
      const orderId = extractCreatedDigitalOrderId(data);
      if (!orderId) {
        paymentTab?.close();
        throw new Error('Order created but order id was not returned.');
      }

      try {
        const payResponse = await payDigitalOrder({
          orderId,
          paymentMethod,
        });
        const paymentUrl = extractDigitalOrderPaymentUrl(payResponse);
        await loadCart({ force: true }).catch(() => {});
        if (paymentUrl) {
          launchDigitalOrderPayment({ payload: payResponse, preOpenedTab: paymentTab });
          navigate(`/digital-order/${encodeURIComponent(orderId)}`);
          return;
        }
        paymentTab?.close();
      } catch (paymentError) {
        paymentTab?.close();
        const paymentMessage = paymentError?.response?.data?.message || '';
        setSuccessInfo({
          orderId,
          message: paymentMessage
            ? `${String(data?.message || 'Digital order created.')} ${paymentMessage}`
            : (String(data?.message || '').trim() || 'Digital order created. You can pay from order details.'),
          paymentPending: true,
        });
        await loadCart({ force: true }).catch(() => {});
        return;
      }

      await loadCart({ force: true }).catch(() => {});
      setSuccessInfo({
        orderId,
        message: String(data?.message || '').trim() || 'Your digital order was created.',
      });
    } catch (e) {
      paymentTab?.close();
      const gate = parseDigitalOrderProfileGate(e);
      if (gate) {
        setProfileGate(gate);
        return;
      }
      const raw = e?.response?.data?.message || e?.message || 'Could not complete digital checkout.';
      setCheckoutError(formatDigitalOrderErrorMessage(raw));
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-white min-h-screen px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] py-[24px]">
      {profileGate ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px]" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-[#0e1c47]/45 cursor-default" aria-label="Close" onClick={closeProfileGate} />
          <div className="relative w-full max-w-[520px] bg-white rounded-[8px] border p-[24px] max-h-[90vh] overflow-y-auto">
            <h2 className="font-['Poppins'] font-semibold text-[18px] text-[#0e1c47] mb-[8px]">Complete your profile first</h2>
            <p className="font-['Poppins'] text-[14px] text-[#57534e] mb-[16px]">{profileGate.message}</p>
            <div className="flex gap-[10px] justify-end">
              <button type="button" onClick={closeProfileGate} className="font-['Poppins'] px-[16px] py-[10px] border rounded-[4px]">Not now</button>
              <Link to="/my-profile?focus=digital-order" onClick={closeProfileGate} className="font-['Poppins'] px-[16px] py-[10px] bg-[#eea137] text-white rounded-[4px]">Complete profile</Link>
            </div>
          </div>
        </div>
      ) : null}

      {successInfo ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px]" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-[#0e1c47]/45 cursor-default" aria-label="Close" onClick={closeSuccess} />
          <div className="relative w-full max-w-[480px] bg-white rounded-[8px] border p-[24px] text-center">
            <h2 className="font-['Poppins'] font-semibold text-[20px] text-[#0e1c47] mb-[8px]">Order placed</h2>
            <p className="font-['Poppins'] text-[14px] text-[#666] mb-[16px]">{successInfo.message}</p>
            {successInfo.orderId ? (
              <Link to={`/digital-order/${successInfo.orderId}`} onClick={closeSuccess} className="inline-block font-['Poppins'] font-semibold px-[20px] py-[10px] bg-[#eea137] text-white rounded-[4px]">
                View order
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="max-w-[900px] mx-auto">
        <div className="flex gap-[8px] items-center mb-[20px]">
          <Link to="/" className="font-['Poppins'] text-[14px] text-[#666] hover:text-[#eea137]">Home</Link>
          <img alt="" className="size-[18px] rotate-[270deg]" src={imgArrowDown} />
          <Link to="/shopping-cart" className="font-['Poppins'] text-[14px] text-[#666] hover:text-[#eea137]">Cart</Link>
          <img alt="" className="size-[18px] rotate-[270deg]" src={imgArrowDown} />
          <span className="font-['Poppins'] text-[14px] text-[#eea137]">Digital checkout</span>
        </div>

        <h1 className="font-['Poppins'] font-semibold text-[24px] text-[#191c1f] mb-[8px]">Digital checkout</h1>
        <p className="font-['Poppins'] text-[14px] text-[#666] mb-[20px]">
          Instant delivery — no shipping address. Each unit receives its own code after fulfillment.
        </p>

        {checkoutError ? (
          <p className="font-['Poppins'] text-[14px] text-[#b42318] mb-[12px]" role="alert">{checkoutError}</p>
        ) : null}

        {!isDigitalCart && cart.items.length > 0 ? (
          <div className="rounded-[8px] border border-[#fecaca] bg-[#fef2f2] px-[14px] py-[12px] mb-[16px]">
            <p className="font-['Poppins'] text-[14px] text-[#991b1b]">
              Your cart contains physical products. Please use{' '}
              <Link to="/checkout" className="underline font-semibold">standard checkout</Link>.
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[20px]">
          <div className="border border-[#e4e7e9] rounded-[12px] p-[20px]">
            {loadingCart ? (
              <p className="font-['Poppins'] text-[#666]">Loading cart…</p>
            ) : cart.items.length === 0 ? (
              <div>
                <p className="font-['Poppins'] text-[#666] mb-[12px]">Your digital cart is empty.</p>
                <Link to="/digital-products" className="font-['Poppins'] text-[#0e1c47] font-semibold hover:underline">Browse digital products</Link>
              </div>
            ) : (
              <ul className="space-y-[14px]">
                {cart.items.map((item) => (
                  <li key={`${item.id}-${item.productId}`} className="flex gap-[12px] border-b border-[#f1f5f9] pb-[14px] last:border-0 last:pb-0">
                    <div className="size-[64px] rounded-[4px] bg-[#f5f5f5] overflow-hidden shrink-0">
                      {item.image ? <img src={item.image} alt="" className="size-full object-contain" /> : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins'] font-medium text-[14px] line-clamp-2">{item.name}</p>
                      <p className="font-['Poppins'] text-[13px] text-[#666]">Qty: {item.quantity} × {formatMoney(item.unitPrice)}</p>
                      {item.serials?.length > 0 ? (
                        <p className="font-['Poppins'] text-[12px] text-[#059669] mt-[4px]">
                          {item.serials.length} code(s) reserved for this line
                        </p>
                      ) : null}
                    </div>
                    <p className="font-['Poppins'] font-semibold text-[14px] shrink-0">{formatMoney(item.subtotal)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-[#e4e7e9] rounded-[12px] p-[20px] h-fit">
            <h2 className="font-['Poppins'] font-semibold text-[18px] mb-[12px]">Summary</h2>
            <div className="space-y-[8px] mb-[16px] font-['Poppins'] text-[14px]">
              <div className="flex justify-between"><span className="text-[#666]">Sub-total</span><span>{formatMoney(cart.summary?.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[#666]">Shipping</span><span>Free</span></div>
              <div className="border-t pt-[8px] flex justify-between font-semibold text-[16px]">
                <span>Total</span><span>{formatMoney(cart.summary?.total)}</span>
              </div>
            </div>

            <label className="font-['Poppins'] text-[13px] text-[#666] block mb-[6px]">Payment method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-[#e4e7e9] rounded-[4px] px-[10px] py-[9px] font-['Poppins'] text-[14px] mb-[14px]"
            >
              <option value="sadad">Sadad</option>
              <option value="tabby">Tabby</option>
            </select>

            <button
              type="button"
              disabled={checkoutLoading || loadingCart || !cart.items.length || !isDigitalCart}
              onClick={handlePlaceOrder}
              className="w-full bg-[#eea137] text-white font-['Poppins'] font-semibold py-[12px] rounded-[4px] disabled:opacity-50"
            >
              {checkoutLoading ? 'Processing…' : 'Place digital order'}
            </button>
            <Link to="/shopping-cart" className="block text-center mt-[12px] font-['Poppins'] text-[13px] text-[#666] hover:text-[#eea137]">
              Back to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
