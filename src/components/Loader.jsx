// Loader Component - Professional loading spinner
import { useTheme } from '../context/ThemeContext';

export default function Loader({ size = 'medium', fullScreen = false, message = '' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    small: 'size-[24px]',
    medium: 'size-[40px]',
    large: 'size-[60px]',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-[16px]">
      {/* Spinner */}
      <div className={`${spinnerSize} relative`}>
        <div className={`absolute inset-0 border-[3px] border-transparent border-t-[#eea137] rounded-full animate-spin`}></div>
        <div className={`absolute inset-[4px] border-[3px] border-transparent border-t-[#0e1c47] dark:border-t-[#eea137] rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      
      {/* Loading Message */}
      {message && (
        <p className={`font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white transition-colors duration-300`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-[#0f172a] bg-opacity-90 dark:bg-opacity-90 z-[99999] flex items-center justify-center transition-colors duration-300">
        <LoaderContent />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-[40px] sm:py-[60px]">
      <LoaderContent />
    </div>
  );
}

// Page Loader - Shows when navigating between pages
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#0f172a] bg-opacity-95 dark:bg-opacity-95 z-[99999] flex items-center justify-center transition-colors duration-300">
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <div className="size-[50px] relative">
          <div className="absolute inset-0 border-[4px] border-transparent border-t-[#eea137] rounded-full animate-spin"></div>
          <div className="absolute inset-[6px] border-[4px] border-transparent border-t-[#0e1c47] dark:border-t-[#eea137] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <p className="font-['Poppins'] font-medium text-[16px] sm:text-[18px] text-[#0e1c47] dark:text-white transition-colors duration-300">
          Loading...
        </p>
      </div>
    </div>
  );
}

// Button Loader - Small loader for buttons
export function ButtonLoader({ size = 'small' }) {
  const sizeClasses = {
    small: 'size-[16px] border-[2px]',
    medium: 'size-[20px] border-[2.5px]',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.small;

  return (
    <div className={`${spinnerSize.split(' ')[0]} relative inline-block`}>
      <div className={`absolute inset-0 ${spinnerSize.split(' ')[1]} border-transparent border-t-current rounded-full animate-spin`}></div>
    </div>
  );
}

