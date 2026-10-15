export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #f97316, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Restaurant Order Management System
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.6', marginBottom: '2rem' }}>
        Welcome to our restaurant food ordering and real-time operations platform.
      </p>
    </main>
  );
}
