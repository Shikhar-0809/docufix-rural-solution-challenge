import { useCallback, useRef, useState } from 'react';
import { analyzeForm } from '../utils/gemini';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

export default function FormUpload({ onValidationComplete }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const acceptFile = useCallback(async (selected) => {
    setError('');
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, or WebP).');
      return;
    }

    if (selected.size > MAX_FILE_BYTES) {
      setError('Image is too large. Please upload a file under 10 MB.');
      return;
    }

    setFile(selected);

    try {
      const dataUrl = await fileToBase64(selected);
      setImagePreview(dataUrl);
    } catch (err) {
      console.error(err);
      setError('Could not read the image file. Please try again.');
    }
  }, []);

  const handleFileChange = (e) => acceptFile(e.target.files?.[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) acceptFile(dropped);
  };

  const handleValidate = async () => {
    if (!imagePreview) return;

    setIsValidating(true);
    setError('');

    try {
      const result = await analyzeForm(imagePreview);
      onValidationComplete?.({
        image: imagePreview,
        fileName: file?.name,
        result,
      });
    } catch (err) {
      console.error('[FormUpload] Unexpected analysis error:', err);
      setError(
        err?.message ||
          'Something went wrong while analyzing the form. Please try again.'
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setImagePreview(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const dropZoneStyle = {
    minHeight: '300px',
    border: `3px dashed ${isDragging ? '#FF9933' : '#d1d5db'}`,
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    background: isDragging ? 'rgba(255, 153, 51, 0.05)' : 'white',
    transition: 'all 0.3s',
    transform: isDragging ? 'scale(1.01)' : 'scale(1)',
    boxShadow: isDragging
      ? '0 20px 25px -5px rgba(0,0,0,0.1)'
      : 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div>
      <div
        style={dropZoneStyle}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div
              style={{ fontSize: '4rem', marginBottom: '1rem' }}
              aria-hidden="true"
            >
              📄
            </div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
              }}
            >
              Drop your form here
            </h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>or</p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '0.75rem 2rem',
                background: '#FF9933',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 6px -1px rgba(255, 153, 51, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              📁 Browse Files
            </button>

            <p
              style={{
                fontSize: '0.875rem',
                color: '#999',
                marginTop: '1rem',
              }}
            >
              JPG, PNG, or WebP — up to 10 MB
            </p>
          </>
        ) : (
          <div style={{ width: '100%', maxWidth: '28rem' }}>
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '0.5rem',
                border: '1px solid #bbf7d0',
                textAlign: 'left',
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: '#14532d',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                ✓ {file.name}
              </p>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#166534',
                  margin: 0,
                }}
              >
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxHeight: '160px',
                  margin: '0 auto',
                  display: 'block',
                  borderRadius: '0.5rem',
                  boxShadow:
                    '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                }}
              />
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleValidate}
            disabled={isValidating}
            className="flex-1 btn-primary text-lg py-4 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isValidating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing with Gemini...
              </>
            ) : (
              <>
                <span className="text-xl" aria-hidden="true">🔍</span>
                Validate Form
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={isValidating}
            className="btn-secondary px-6"
          >
            ✕ Clear
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span className="text-lg leading-none" aria-hidden="true">❌</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
