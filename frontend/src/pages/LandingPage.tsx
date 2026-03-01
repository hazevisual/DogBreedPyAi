import { Link } from 'react-router-dom';

type DogImage = { index: number; src: string };

const dogImageModules = import.meta.glob('../assets/Dog_??.*', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const dogImages = Object.entries(dogImageModules)
  .map(([path, src]) => {
    const match = path.match(/Dog_(\d{2})\.[^.]+$/);
    return match ? { index: Number(match[1]), src } : null;
  })
  .filter((image): image is DogImage => image !== null)
  .sort((a, b) => a.index - b.index);

const heroImage = dogImages[0];
const cardImages = dogImages.slice(1);

const getCardImage = (fallbackIndex: number) => cardImages[fallbackIndex] ?? heroImage;

const howItWorksSteps = [
  {
    title: 'Загрузите фото',
    description: 'Выберите чёткое изображение вашей собаки на странице демо.',
    alt: 'Шаг 1: загрузка фото',
    image: getCardImage(0)
  },
  {
    title: 'Запустите распознавание',
    description: 'Модель анализирует изображение и определяет наиболее вероятные породы.',
    alt: 'Шаг 2: распознавание',
    image: getCardImage(1)
  },
  {
    title: 'Получите результат',
    description: 'Просмотрите ранжированные породы с процентом уверенности.',
    alt: 'Шаг 3: результат',
    image: getCardImage(2)
  }
];

const features = [
  'Быстрое распознавание',
  'Работа на сервере',
  'Без регистрации',
  'Современная нейросеть',
  'Поддержка популярных форматов',
  'Удобный интерфейс'
].map((title, index) => ({
  title,
  image: getCardImage(index + howItWorksSteps.length)
}));

export default function LandingPage() {
  return (
    <main className="landing-page">
      <div className="container">
        <nav className="top-nav" aria-label="Главная навигация">
          <p className="brand">Распознавание пород собак</p>
          <Link to="/demo" className="button button-primary nav-demo-link">
            Демо
          </Link>
        </nav>

        <section className="hero card-block">
          <div className="hero-content">
            <p className="eyebrow">Сервис распознавания пород собак</p>
            <h1>Определите породу собаки по фото</h1>
            <p className="hero-subtitle">
              Загрузите изображение, и нейросеть на нашем сервере вернёт топ пород с
              вероятностями за считанные секунды.
            </p>
            <div className="hero-actions">
              <Link to="/demo" className="button button-primary">
                Попробовать демо
              </Link>
              <a href="#how-it-works" className="button button-secondary">
                Как это работает
              </a>
            </div>
          </div>
          {heroImage ? (
            <img className="hero-image" src={heroImage.src} alt="Пример изображения собаки" />
          ) : null}
        </section>

        <section id="how-it-works" className="section">
          <h2>Как это работает</h2>
          <div className="grid grid-3">
            {howItWorksSteps.map((step, index) => (
              <article key={step.title} className="card-block step-card">
                {step.image ? (
                  <div className="step-card-image-frame">
                    <img className="step-card-image" src={step.image.src} alt={step.alt} />
                  </div>
                ) : null}
                <p className="step-number">Шаг {index + 1}</p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Почему это полезно</h2>
          <div className="grid grid-3">
            {features.map((feature) => (
              <article key={feature.title} className="card-block feature-card">
                {feature.image ? (
                  <div className="feature-card-image-frame">
                    <img className="feature-card-image" src={feature.image.src} alt="Иллюстрация функции" />
                  </div>
                ) : null}
                <h3>{feature.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Конфиденциальность</h2>
          <div className="card-block privacy-card">
            <p>
              База данных не используется. Изображения не сохраняются. Распознавание выполняется
              на нашем сервере.
            </p>
          </div>
        </section>

        <footer className="landing-footer">© {new Date().getFullYear()} Демо распознавания пород собак</footer>
      </div>
    </main>
  );
}
