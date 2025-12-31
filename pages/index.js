import { useState } from 'react';

export default function SyntaxBit() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generarSQL = async () => {
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await response.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>SyntaxBit 🤖</h1>
      <p>Escribe lo que necesitas (ej: "Crear una tabla de usuarios con email y nombre")</p>
      
      <textarea 
        style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe tu base de datos..."
      />
      
      <button 
        onClick={generarSQL}
        style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        disabled={loading}
      >
        {loading ? 'Generando...' : 'Generar SQL'}
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f4f4f4', borderRadius: '8px' }}>
          <h3>Resultado:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
