import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] rounded-[12px] border border-[#d1fadf] bg-white p-6 text-center">
        <h1 className="font-['Poppins'] text-[26px] font-semibold text-[#027a48]">Payment Successful</h1>
        <p className="mt-2 font-['Poppins'] text-[14px] text-[#444]">
          Your payment has been completed successfully.
        </p>
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
            Track Order
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[6px] border border-[#e4e7e9] px-5 py-2.5 font-['Poppins'] text-[14px] font-medium text-[#0e1c47] hover:bg-[#f8fafc] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
