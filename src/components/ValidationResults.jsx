import VoiceButton from './VoiceButton';

export default function ValidationResults({ image, fileName, result, onReset }) {
  if (!result) return null;

  const errors = Array.isArray(result.errors) ? result.errors : [];
  const fields = Array.isArray(result.fields) ? result.fields : [];
  const isComplete = String(result.status).toUpperCase() === 'COMPLETE';
  const formType = result.formType || 'Unknown form';

  return (
    <div className="space-y-6 animate-fade-in">
      <div
        className={`card border-2 ${
          isComplete
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className={`w-16 h-16 flex-none rounded-full flex items-center justify-center shadow-md ${
              isComplete ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <span className="text-4xl" aria-hidden="true">
              {isComplete ? '✅' : '⚠️'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {formType}
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {isComplete
                ? 'Form Complete!'
                : `${errors.length} Issue${errors.length === 1 ? '' : 's'} Found`}
            </h2>
            <p className="text-slate-600">
              {isComplete
                ? 'All required fields are present'
                : 'Needs attention before submission'}
            </p>
          </div>
          <VoiceButton errors={errors} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span aria-hidden="true">📄</span> Uploaded Form
          </h3>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            {image ? (
              <img
                src={image}
                alt="Uploaded form"
                style={{ maxHeight: '300px', width: '100%', objectFit: 'contain' }}
                className="rounded border"
              />
            ) : (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                No image preview available.
              </div>
            )}
          </div>
          {fileName && (
            <p className="text-xs text-slate-500 mt-2 truncate">{fileName}</p>
          )}
        </div>

        <div className="card">
          <div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '1rem',
                marginTop: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span aria-hidden="true">🔍</span> Validation Report
            </h3>

            {errors.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {errors.map((error, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.5rem',
                      background: '#fef2f2',
                      borderLeft: '4px solid #ef4444',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
                        ❌
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '0.875rem',
                            color: '#991b1b',
                            marginBottom: '0.5rem',
                            marginTop: 0,
                          }}
                        >
                          {error.field || `Issue ${idx + 1}`}
                        </p>
                        <p
                          style={{
                            color: '#374151',
                            marginTop: 0,
                            marginBottom: '0.75rem',
                            lineHeight: 1.5,
                          }}
                        >
                          {error.issue || 'Unknown problem'}
                        </p>
                        {error.hindi && (
                          <div
                            style={{
                              padding: '0.75rem',
                              background: '#fff7ed',
                              border: '1px solid #fed7aa',
                              borderRadius: '0.375rem',
                            }}
                          >
                            <p
                              lang="hi"
                              style={{
                                color: '#c2410c',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                margin: 0,
                              }}
                            >
                              <span aria-hidden="true">🇮🇳 </span>
                              {error.hindi}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '2rem',
                  background: '#f0fdf4',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '3rem',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                  aria-hidden="true"
                >
                  ✅
                </span>
                <p
                  style={{
                    fontWeight: 600,
                    color: '#166534',
                    margin: 0,
                  }}
                >
                  Form is complete!
                </p>
                <p
                  lang="hi"
                  style={{
                    fontSize: '0.875rem',
                    color: '#15803d',
                    marginTop: '0.5rem',
                    marginBottom: 0,
                  }}
                >
                  फॉर्म पूर्ण है। कोई त्रुटि नहीं मिली।
                </p>
              </div>
            )}

            {fields.length > 0 && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.5rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginTop: 0,
                    marginBottom: '0.75rem',
                  }}
                >
                  Detected fields:
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  {fields.map((field, idx) => (
                    <span
                      key={`${field}-${idx}`}
                      style={{
                        padding: '0.375rem 0.75rem',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#4b5563',
                      }}
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary px-8 py-3 text-lg shadow-md hover:shadow-lg"
        >
          ← Validate Another Form
        </button>
      </div>
    </div>
  );
}
