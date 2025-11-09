export default function GettingStarted() {
  return (
    <>
      <h3 style={{
        color: 'white',
        fontSize: '16px',
        fontWeight: 700,
        marginBottom: '12px'
      }}>
        Getting Started
      </h3>

      <p style={{
        color: 'rgba(255,255,255,0.9)',
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '16px'
      }}>
        Create your first project to start organizing your research and updates.
      </p>

      <a href="/workbench/docs" className="btn-white-sm">
        Learn More
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '14px', height: '14px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </>
  );
}
