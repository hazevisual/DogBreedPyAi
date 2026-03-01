import { useState } from 'react';
import { Link } from 'react-router-dom';

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
      setErrorMessage('Пожалуйста, выберите изображение.');
      setPredictions([]);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setState('error');
      setErrorMessage('Нужен файл изображения (JPG, PNG, WebP).');
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
        setState('error');
        setErrorMessage('Не удалось выполнить распознавание.');
        return;
      }

      const data = (await response.json()) as { predictions?: Prediction[] };
      const sortedPredictions = [...(data.predictions ?? [])].sort((a, b) => b.score - a.score);

      setPredictions(sortedPredictions);
      setState('success');
    } catch {
      setState('error');
      setErrorMessage('Сервер недоступен.');
    }
  };

  return (
    <main className="demo-page">
      <div className="container">
        <nav className="top-nav" aria-label="Навигация демо">
          <p className="brand">Распознавание пород собак</p>
          <Link to="/" className="button button-secondary nav-demo-link">
            Назад
          </Link>
        </nav>

        <section className="card-block demo-card">
          <h1>Демо распознавания</h1>
          <p className="demo-subtitle">Загрузите изображение собаки и запустите распознавание.</p>

          <label className="upload-zone" htmlFor="dog-image-upload">
            <span className="upload-title">Выберите изображение</span>
            <span className="upload-hint">
              Поддерживаются форматы JPG, PNG, WebP. Максимальный размер — 5 МБ.
            </span>
            <span className="upload-file-name">{file ? file.name : 'Файл пока не выбран'}</span>
          </label>

          <input
            id="dog-image-upload"
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const nextFile = event.target.files?.[0] ?? null;
              setPredictions([]);

              if (!nextFile) {
                setFile(null);
                setState('error');
                setErrorMessage('Пожалуйста, выберите изображение.');
                return;
              }

              if (!nextFile.type.startsWith('image/')) {
                setFile(null);
                setState('error');
                setErrorMessage('Нужен файл изображения (JPG, PNG, WebP).');
                return;
              }

              setFile(nextFile);
              setState('idle');
              setErrorMessage('');
            }}
          />

          <button
            type="button"
            onClick={onRecognize}
            disabled={state === 'loading'}
            className="button button-primary"
          >
            {state === 'loading' ? 'Обработка...' : 'Распознать'}
          </button>

          {state === 'loading' && <p className="status-text">Обработка...</p>}

          <div aria-live="polite" className="error-area">
            {state === 'error' && <p>{errorMessage}</p>}
          </div>

          <div className="results-area">
            {state === 'success' && (
              <section className="result-card" aria-label="Результаты распознавания">
                <h2>Результат</h2>
                <ul>
                  {predictions.map((item, index) => (
                    <li key={`${item.label}-${index}`}>
                      <span>
                        {index + 1}. {item.label}
                      </span>
                      <strong>{Math.round(item.score * 100) + '%'}</strong>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
