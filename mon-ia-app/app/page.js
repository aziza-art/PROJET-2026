'use client';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      setResponse("Erreur...");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Mon App IA</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Posez votre question à Gemini..."
        rows={5}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button 
        onClick={sendMessage} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        {loading ? 'Réflexion en cours...' : 'Envoyer'}
      </button>
      
      {response && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
          <strong>Réponse :</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}