import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

export function RouteErrorFallback() {
  const error = useRouteError();
  const message = error?.message || 'Something went wrong while loading this page.';

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-[20px] py-[40px] bg-white dark:bg-[#0f172a]">
      <div className="max-w-[520px] w-full text-center">
        <h1 className="font-['Poppins'] font-semibold text-[22px] text-[#0e1c47] dark:text-white mb-[10px]">
          حدث خطأ مؤقت
        </h1>
        <p className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#94a3b8] mb-[20px] leading-relaxed">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-[10px] justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] bg-[#eea137] text-white"
          >
            إعادة تحميل الصفحة
          </button>
          <Link
            to="/"
            className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] border border-[#e4e7e9] text-[#0e1c47] dark:text-white"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('RouteErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || 'Unexpected error.';
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-[20px] py-[40px]">
          <div className="max-w-[520px] w-full text-center">
            <h1 className="font-['Poppins'] font-semibold text-[22px] text-[#0e1c47] mb-[10px]">
              حدث خطأ مؤقت
            </h1>
            <p className="font-['Poppins'] text-[14px] text-[#666] mb-[20px]">{message}</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] bg-[#eea137] text-white"
            >
              المحاولة مرة أخرى
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
