import { type ChangeEvent, useEffect, useState } from 'react';
import loaderVideo from '../assets/AiLoading.mp4';

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

  useEffect(() => {
    if (state === 'loading') {
      document.body.classList.add('loader-lock-scroll');
      return;
    }

    document.body.classList.remove('loader-lock-scroll');

    return () => {
      document.body.classList.remove('loader-lock-scroll');
    };
  }, [state]);

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

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <main className="demo-page">
      <div className="demo-container">
        <section className="card-block demo-card">
          <header className="demo-header">
            <p className="eyebrow">Онлайн-демо</p>
            <h1>Распознавание пород собак</h1>
            <p className="demo-subtitle">
              Загрузите фото собаки, нажмите кнопку распознавания и получите список самых вероятных
              пород с оценкой уверенности модели.
            </p>
          </header>

          <div className="demo-content-stack">
            <label
              className={`upload-zone ${state === 'loading' ? 'upload-zone-disabled' : ''}`}
              htmlFor="dog-image-upload"
              aria-disabled={state === 'loading'}
            >
              <span className="upload-title">Загрузите изображение собаки</span>
              <span className="upload-hint">
                Перетащите файл в эту область или выберите его вручную. Поддерживаются JPG, PNG,
                WebP (до 5 МБ).
              </span>
              <span className="upload-file-name">{file ? file.name : 'Файл пока не выбран'}</span>
              {file ? <span className="upload-change-file">Изменить файл</span> : null}
            </label>

            <input
              id="dog-image-upload"
              className="file-input"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              disabled={state === 'loading'}
            />

            <div className="recognize-button-wrap">
              <button
                type="button"
                onClick={onRecognize}
                disabled={state === 'loading'}
                className="button button-primary recognize-button"
              >
                {state === 'loading' ? 'Обработка...' : 'Распознать'}
              </button>
            </div>

            {state === 'error' && (
              <section className="error-block" aria-live="polite" aria-label="Ошибка распознавания">
                <p>{errorMessage}</p>
              </section>
            )}

            {state === 'success' && (
              <section className="result-card" aria-label="Результаты распознавания">
                <h2>Результат</h2>
                <ul>
                  {predictions.map((item, index) => (
                    <li key={`${item.label}-${index}`}>
                      <span className="result-label">{item.label}</span>
                      <strong>{Math.round(item.score * 100) + '%'}</strong>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </section>
      </div>

      {state === 'loading' && (
        <div className="loader-overlay" aria-live="polite" aria-label="Выполняется распознавание" role="status">
          <div className="loader-modal">
            <video src={loaderVideo} autoPlay muted playsInline preload="auto" className="loader-modal-video" />
            <h3>Нейросеть анализирует изображение...</h3>
            <p>Обычно это занимает несколько секунд</p>
          </div>
        </div>
      )}
    </main>
  );
}
