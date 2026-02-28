import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="page-wrap">
      <section className="card">
        <h1>Dog Breed Recognition Service</h1>
        <p>
          Upload a dog image and get predicted breeds with confidence scores in a
          simple demo flow.
        </p>
        <button type="button" onClick={() => navigate('/demo')}>
          Try Demo
        </button>
      </section>
    </main>
  );
}
