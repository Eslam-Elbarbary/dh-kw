export default function ProfileSecurityCard({
  profileIp,
  isLoading,
  ipCopied,
  onCopyIp,
}) {
  return (
    <section
      className="mb-[24px] sm:mb-[28px] rounded-[8px] border border-[#e6e6e6] dark:border-[#334155] bg-white dark:bg-[#1e293b] overflow-hidden shadow-sm"
      aria-labelledby="profile-security-heading"
    >
      <div className="px-[20px] sm:px-[24px] py-[18px] sm:py-[20px] border-b border-[#eef1f4] dark:border-[#334155] bg-[#fafbfc] dark:bg-[#0f172a]/50">
        <div className="flex items-start gap-[14px]">
          <div
            className="flex size-[44px] shrink-0 items-center justify-center rounded-[8px] bg-[#0e1c47] dark:bg-[#eea137] text-white"
            aria-hidden
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h3
              id="profile-security-heading"
              className="font-['Poppins'] font-semibold text-[17px] sm:text-[18px] text-[#0e1c47] dark:text-white leading-snug"
            >
              Account security
            </h3>
            <p className="font-['Poppins'] font-normal text-[13px] sm:text-[14px] text-[#64748b] dark:text-[#94a3b8] mt-[4px] leading-relaxed">
              Details we use to verify your account and help keep digital orders secure.
            </p>
          </div>
        </div>
      </div>

      <div className="px-[20px] sm:px-[24px] py-[20px] sm:py-[24px]">
        <p className="font-['Poppins'] font-medium text-[13px] text-[#475569] dark:text-[#cbd5e1] mb-[10px]">
          Last verification network address
        </p>

        {isLoading ? (
          <div className="h-[52px] rounded-[6px] bg-[#f1f5f9] dark:bg-[#334155] animate-pulse" aria-hidden />
        ) : profileIp ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-[10px] sm:gap-[12px]">
            <div
              className="flex-1 min-w-0 flex items-center gap-[12px] rounded-[6px] border border-[#e2e8f0] dark:border-[#475569] bg-[#f8fafc] dark:bg-[#0f172a] px-[14px] sm:px-[16px] py-[12px] sm:py-[14px]"
              role="group"
              aria-label="Your verification network address"
            >
              <span
                className="flex size-[8px] shrink-0 rounded-full bg-[#22c55e]"
                title="Active on file"
                aria-hidden
              />
              <code className="font-['Consolas','Monaco','monospace'] font-semibold text-[16px] sm:text-[17px] text-[#0e1c47] dark:text-[#f1f5f9] tracking-wide break-all">
                {profileIp}
              </code>
            </div>
            <button
              type="button"
              onClick={onCopyIp}
              className="inline-flex items-center justify-center gap-[8px] shrink-0 w-full sm:w-auto font-['Poppins'] font-semibold text-[13px] px-[18px] py-[12px] rounded-[6px] bg-[#0e1c47] dark:bg-[#eea137] text-white hover:opacity-90 transition-opacity"
            >
              {ipCopied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Copied to clipboard
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy address
                </>
              )}
            </button>
          </div>
        ) : (
          <p className="font-['Poppins'] text-[14px] text-[#64748b] dark:text-[#94a3b8] py-[8px]">
            Your network address will appear here after your account is verified.
          </p>
        )}

        <div className="mt-[16px] flex gap-[10px] rounded-[6px] bg-[#f0f7ff] dark:bg-[#0f172a] border border-[#dbeafe] dark:border-[#334155] px-[14px] py-[12px]">
          <svg
            className="shrink-0 mt-[2px] text-[#0e1c47] dark:text-[#93c5fd]"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p className="font-['Poppins'] font-normal text-[12px] sm:text-[13px] text-[#475569] dark:text-[#cbd5e1] leading-relaxed">
            This address is recorded automatically during account verification. You cannot edit it here.
            If you do not recognize it, change your password and contact our support team.
          </p>
        </div>
      </div>
    </section>
  );
}
