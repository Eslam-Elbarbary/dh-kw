import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notifyPaymentReturnUrl } from '../services/orders.service';

const SUCCESS_HINTS = ['success', 'paid', 'approved', 'captured', 'completed', 'ok'];
const FAILED_HINTS = ['fail', 'failed', 'declined', 'cancel', 'error', 'rejected', 'denied'];

const parseStatusFromParams = (params) => {
  const keys = [
    'status',
    'payment_status',
    'result',
    'payment_result',
    'response_status',
    'resp_status',
  ];

  const values = keys
    .map((k) => String(params.get(k) || '').trim().toLowerCase())
    .filter(Boolean);

  const merged = values.join(' ');
  if (SUCCESS_HINTS.some((w) => merged.includes(w))) return 'success';
  if (FAILED_HINTS.some((w) => merged.includes(w))) return 'failed';

  const successFlag = String(params.get('success') || '').trim().toLowerCase();
  if (['1', 'true', 'yes'].includes(successFlag)) return 'success';
  if (['0', 'false', 'no'].includes(successFlag)) return 'failed';

  return 'pending';
};

export default function PaymentLogic() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(true);

  const status = useMemo(() => parseStatusFromParams(searchParams), [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const paramsObject = Object.fromEntries(searchParams.entries());
        await notifyPaymentReturnUrl({
          orderId: searchParams.get('orderId') || '',
          status,
          paymentMethod: searchParams.get('paymentMethod') || 'sadad',
          returnUrl: window.location.href,
          params: paramsObject,
        });
      } catch (err) {
        if (isMounted) {
          setError(String(err?.response?.data?.message || err?.message || 'Could not notify backend.'));
        }
      } finally {
        if (!isMounted) return;
        setProcessing(false);

        const orderId = searchParams.get('orderId') || '';
        const targetBase = status === 'success' ? '/payment/success' : '/payment/failed';
        const target = `${targetBase}${orderId ? `?orderId=${encodeURIComponent(orderId)}` : ''}`;
        setTimeout(() => navigate(target, { replace: true }), 300);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [navigate, searchParams, status]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] rounded-[12px] border border-[#e4e7e9] bg-white p-6 text-center">
        <h1 className="font-['Poppins'] text-[24px] font-semibold text-[#0e1c47]">Finalizing your payment...</h1>
        <p className="mt-2 font-['Poppins'] text-[14px] text-[#666]">
          Please wait while we verify the gateway response and update your order.
        </p>
        {processing ? (
          <p className="mt-4 font-['Poppins'] text-[13px] text-[#0e1c47]">Processing return URL and payment status.</p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-[6px] border border-[#fde68a] bg-[#fffbeb] p-3 font-['Poppins'] text-[13px] text-[#92400e]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
