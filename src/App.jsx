import { useState } from 'react';
import FormUpload from './components/FormUpload';
import ValidationResults from './components/ValidationResults';

export default function App() {
  const [validationData, setValidationData] = useState(null);

  const handleValidationComplete = (data) => {
    setValidationData(data);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setValidationData(null);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #f0fff4 100%)',
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #FF9933, #FF6600)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              DF
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                DocuFix<span style={{ color: '#FF9933' }}>Rural</span>
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>
                Powered by Gemini AI
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#f0fdf4',
              borderRadius: '999px',
              border: '1px solid #bbf7d0',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                background: '#22c55e',
                borderRadius: '999px',
              }}
              className="animate-pulse"
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#166534',
              }}
            >
              Live
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {!validationData && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-saffron/10 rounded-full border border-saffron/20 mb-4">
              <span className="text-sm font-semibold text-saffron">
                <span aria-hidden="true">🇮🇳 </span>AI Form Validator
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Validate Indian Government Forms
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-green">
                in Seconds
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-2">
              Catch missing signatures, photos and fields on Aadhaar, Ration
              Card and Land Deed forms — with clear Hindi explanations.
            </p>
            <p
              lang="hi"
              className="text-base text-slate-500 italic"
            >
              आधार, राशन कार्ड और भूमि दस्तावेज़ की त्रुटियां तुरंत जानें।
            </p>
          </div>
        )}

        <div className={validationData ? 'w-full' : 'max-w-3xl mx-auto'}>
          {!validationData ? (
            <div className="card shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
              <FormUpload onValidationComplete={handleValidationComplete} />
            </div>
          ) : (
            <ValidationResults {...validationData} onReset={handleReset} />
          )}
        </div>
      </main>

      <footer className="mt-16 py-8 border-t border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-600">
            DocuFix Rural · Built for Indian villages · Made with Gemini AI
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Google Solution Challenge 2026 · Thapar Institute
          </p>
        </div>
      </footer>
    </div>
  );
}
