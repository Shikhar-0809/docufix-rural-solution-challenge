import { useState, useEffect } from 'react';

export default function VoiceButton({ errors = [] }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = () => {
    if (!isSupported) {
      alert('Voice not supported in this browser');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const hindiText = (errors || [])
      .map((e) => e?.hindi)
      .filter(Boolean)
      .join('. ');

    if (!hindiText) return;

    console.log('Hindi text:', hindiText);
    alert('Audio would play: ' + hindiText);

    const utterance = new SpeechSynthesisUtterance(hindiText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      alert('Voice playback failed');
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  const hasErrors = (errors?.length || 0) > 0;

  return (
    <button
      type="button"
      onClick={speak}
      disabled={!hasErrors}
      aria-label={isSpeaking ? 'Stop speaking' : 'Listen to errors in Hindi'}
      className={`
        inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold
        transition-all duration-300 shadow-md hover:shadow-lg
        disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none
        ${
          isSpeaking
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-gradient-to-r from-green to-green-600 hover:from-green-600 hover:to-green-700 text-white'
        }
      `}
    >
      <span className="text-xl">{isSpeaking ? '🔊' : '🎧'}</span>
      <span>{isSpeaking ? 'रोकें (Stop)' : 'सुनें (Listen)'}</span>
    </button>
  );
}
