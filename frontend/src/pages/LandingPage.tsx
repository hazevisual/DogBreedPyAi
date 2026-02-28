import { Link } from 'react-router-dom';

const howItWorksSteps = [
  {
    title: 'Upload an image',
    description: 'Choose a clear photo of your dog from your device in the demo page.'
  },
  {
    title: 'Run recognition',
    description: 'Our model processes the image and detects the most likely breeds.'
  },
  {
    title: 'Review Top predictions',
    description: 'See ranked breed predictions with confidence percentages in seconds.'
  }
];

const features = [
  'Quick feedback for curious dog owners',
  'Simple Top-N confidence output',
  'No account required to try the demo',
  'Clean workflow from upload to result',
  'Built for easy testing and iteration',
  'Responsive interface across devices'
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <div className="container">
        <nav className="top-nav" aria-label="Main navigation">
          <p className="brand">Dog Breed AI</p>
          <Link to="/demo" className="button button-primary nav-demo-link">
            Demo
          </Link>
        </nav>

        <section className="hero card-block">
          <p className="eyebrow">Dog Breed Recognition Service</p>
          <h1>Identify dog breeds from a photo in seconds.</h1>
          <p className="hero-subtitle">
            Upload one image and get clear breed predictions with confidence scores from our
            model-powered API.
          </p>
          <div className="hero-actions">
            <Link to="/demo" className="button button-primary">
              Try Demo
            </Link>
            <a href="#how-it-works" className="button button-secondary">
              How it works
            </a>
          </div>
        </section>

        <section id="how-it-works" className="section">
          <h2>How it works</h2>
          <div className="grid grid-3">
            {howItWorksSteps.map((step, index) => (
              <article key={step.title} className="card-block step-card">
                <p className="step-number">Step {index + 1}</p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Why this is useful</h2>
          <div className="grid grid-3">
            {features.map((feature) => (
              <article key={feature} className="card-block feature-card">
                <h3>{feature}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Privacy</h2>
          <div className="card-block privacy-card">
            <p>
              We do not use a database for uploaded images. Your image is sent for inference on
              our server and is not stored after processing.
            </p>
          </div>
        </section>

        <footer className="landing-footer">© {new Date().getFullYear()} Dog Breed AI Demo</footer>
      </div>
    </main>
  );
}
