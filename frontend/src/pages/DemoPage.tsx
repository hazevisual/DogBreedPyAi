import { useState } from 'react';

type RequestState = 'idle' | 'loading' | 'success' | 'error';

type Prediction = {
  label: string;
  score: number;
};

export default function DemoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<RequestState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const onRecognize = async () => {
    if (state === 'loading') {
      return;
    }

    if (!file) {
      setState('error');
      setErrorMessage('Please select an image file.');
      setPredictions([]);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setState('error');
      setErrorMessage('Please select a valid image file.');
      setPredictions([]);
      return;
    }

    setState('loading');
    setErrorMessage('');
    setPredictions([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData
      });

      if (response.status !== 200) {
        let message = 'Prediction failed.';

        try {
          const errorData = (await response.json()) as { message?: string };
          if (errorData.message) {
            message = errorData.message;
          }
        } catch {
          // Keep default message when response JSON parsing fails.
        }

        setState('error');
        setErrorMessage(message);
        return;
      }

      const data = (await response.json()) as { predictions?: Prediction[] };
      const sortedPredictions = [...(data.predictions ?? [])].sort(
        (a, b) => b.score - a.score
      );

      setPredictions(sortedPredictions);
      setState('success');
    } catch {
      setState('error');
      setErrorMessage('Server is not available.');
    }
  };

  return (
    <main className="page-wrap">
      <section className="card">
        <h1>Demo</h1>
        <p>Select a dog image and run recognition.</p>

        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null;
            setPredictions([]);

            if (!nextFile) {
              setFile(null);
              setState('error');
              setErrorMessage('Please select an image file.');
              return;
            }

            if (!nextFile.type.startsWith('image/')) {
              setFile(null);
              setState('error');
              setErrorMessage('Please select a valid image file.');
              return;
            }

            setFile(nextFile);
            setState('idle');
            setErrorMessage('');
          }}
        />

        <button type="button" onClick={onRecognize} disabled={state === 'loading'}>
          {state === 'loading' ? 'Processing...' : 'Recognize'}
        </button>

        {state === 'loading' && <p>Loading...</p>}

        <div aria-live="polite" className="error-area">
          {state === 'error' && <p>{errorMessage}</p>}
        </div>

        <div className="results-area">
          {state === 'success' && (
            <ul>
              {predictions.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  {index + 1}. <strong>{item.label}</strong>: {Math.round(item.score * 100) + '%'}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
