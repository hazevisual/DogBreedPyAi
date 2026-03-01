import { type ChangeEvent, useState } from 'react';

type RequestState = 'idle' | 'loading' | 'success' | 'error';

type Prediction = {
  label: string;
  score: number;
};

const LOADER_ASSET_PATH = '/src/assets/loader.gif';

export default function DemoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<RequestState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showLoaderAsset, setShowLoaderAsset] = useState(true);

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
    setShowLoaderAsset(true);
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

            {state === 'loading' && (
              <section className="loading-block" aria-live="polite" aria-label="Выполняется распознавание">
                <div className="loading-animation-slot" aria-hidden="true">
                  {showLoaderAsset ? (
                    <img
                      src={LOADER_ASSET_PATH}
                      alt=""
                      className="loading-animation"
                      onError={() => setShowLoaderAsset(false)}
                    />
                  ) : (
                    <span className="loading-fallback">Добавьте frontend/src/assets/loader.gif</span>
                  )}
                </div>
                <p className="loading-title">Нейросеть анализирует изображение...</p>
                <p className="loading-caption">Обычно это занимает несколько секунд.</p>
              </section>
            )}

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
    </main>
  );
}
