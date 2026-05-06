import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { extractOrderPaymentUrl, navigateToPaymentGateway, openPaymentGatewayPlaceholderTab, payOrder } from '../services/orders.service';
import { extractDigitalOrderPaymentUrl, payDigitalOrder } from '../services/digitalOrders.service';

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const scope = searchParams.get('scope') || 'store';
  const paymentMethod = searchParams.get('paymentMethod') || 'sadad';
  const [retrying, setRetrying] = useState(false);
  const [retryDone, setRetryDone] = useState(false);
  const [retryError, setRetryError] = useState('');
  const retryStorageKey = useMemo(() => `paymentRetry:${scope}:${orderId}`, [scope, orderId]);

  useEffect(() => {
    if (!orderId) return;
    if (sessionStorage.getItem(retryStorageKey) === 'done') {
      setRetryDone(true);
      return;
    }

    const autoRetry = async () => {
      setRetrying(true);
      setRetryError('');
      const paymentTab = openPaymentGatewayPlaceholderTab();
      try {
        if (scope === 'digital') {
          const result = await payDigitalOrder({ orderId, paymentMethod });
          const paymentUrl = extractDigitalOrderPaymentUrl(result);
          if (!paymentUrl) throw new Error('No redirect url returned by payment gateway.');
          navigateToPaymentGateway(paymentUrl, paymentTab);
        } else {
          const result = await payOrder({ orderId, paymentMethod });
          const paymentUrl = extractOrderPaymentUrl(result);
          if (!paymentUrl) throw new Error('No redirect url returned by payment gateway.');
          navigateToPaymentGateway(paymentUrl, paymentTab);
        }
        sessionStorage.setItem(retryStorageKey, 'done');
      } catch (err) {
        paymentTab?.close();
        setRetryError(String(err?.response?.data?.message || err?.message || 'Retry payment failed.'));
      } finally {
        setRetrying(false);
        setRetryDone(true);
      }
    };

    autoRetry();
  }, [orderId, paymentMethod, retryStorageKey, scope]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] rounded-[12px] border border-[#fecaca] bg-white p-6 text-center">
        <h1 className="font-['Poppins'] text-[26px] font-semibold text-[#b42318]">Payment Failed</h1>
        <p className="mt-2 font-['Poppins'] text-[14px] text-[#444]">
          We could not complete your payment. Please try again.
        </p>
        {retrying ? (
          <p className="mt-2 font-['Poppins'] text-[13px] text-[#92400e]">
            Retrying payment one more time...
          </p>
        ) : retryDone ? (
          <p className="mt-2 font-['Poppins'] text-[13px] text-[#666]">
            We already tried one automatic retry for this order.
          </p>
        ) : null}
        {retryError ? (
          <p className="mt-2 font-['Poppins'] text-[13px] text-[#b42318]">{retryError}</p>
        ) : null}
        {orderId ? (
          <p className="mt-2 font-['Poppins'] text-[13px] text-[#666]">
            Order ID: <span className="font-medium text-[#0e1c47]">{orderId}</span>
          </p>
        ) : null}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={orderId ? `/track-order?orderId=${encodeURIComponent(orderId)}` : '/my-orders'}
            className="inline-flex items-center justify-center rounded-[6px] bg-[#0e1c47] px-5 py-2.5 font-['Poppins'] text-[14px] font-medium text-white hover:bg-[#1a2f5c] transition-colors"
          >
            Go To Order
          </Link>
          <Link
            to="/checkout"
            className="inline-flex items-center justify-center rounded-[6px] border border-[#e4e7e9] px-5 py-2.5 font-['Poppins'] text-[14px] font-medium text-[#0e1c47] hover:bg-[#f8fafc] transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
