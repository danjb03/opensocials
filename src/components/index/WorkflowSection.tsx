
export const WorkflowSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-gray-900/50 rounded-3xl p-12 border border-gray-800/50">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-light mb-6 text-white">Workflow integration</h3>
              <p className="text-gray-400 text-lg leading-relaxed">Seamlessly connect all your existing apps.</p>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-6">
                {/* Figma */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" fill="#f24e1e"/>
                    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" fill="#ff7262"/>
                    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" fill="#1abcfe"/>
                    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" fill="#0acf83"/>
                    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" fill="#a259ff"/>
                  </svg>
                </div>

                {/* Notion */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16v16H4V4z" fill="#fff"/>
                    <path d="M6.5 6.5v11l11-11v11" stroke="#000" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>

                {/* Fantastical */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#4285f4"/>
                    <circle cx="9" cy="9" r="2" fill="#ea4335"/>
                    <circle cx="15" cy="9" r="2" fill="#fbbc04"/>
                    <circle cx="9" cy="15" r="2" fill="#34a853"/>
                    <circle cx="15" cy="15" r="2" fill="#ea4335"/>
                  </svg>
                </div>

                {/* X (Twitter) */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#fff">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>

                {/* NotePlan */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#ff6b35"/>
                    <path d="M8 8h8M8 12h6M8 16h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* Discord */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#5865f2">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
