import React, { useState } from 'react';
import { Mic, Image as ImageIcon, Send } from 'lucide-react';

const ReportForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    
    try {
      const response = await fetch('https://traffic-assistant-backend-788713020207.us-central1.run.app/api/analyze/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      
      const analysis = data.analysis || {};
      const newReport = {
        id: Date.now(),
        type: analysis.type || 'Congestion',
        severity: analysis.severity || 'High',
        location: analysis.location_clue || 'Reported Area (AI extracted)',
        time: 'Just now'
      };

      onSubmit(newReport);
      setText('');
    } catch (error) {
      console.error('Error analyzing report:', error);
      alert('Failed to analyze report using AI.');
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setText('There is a heavy traffic jam and slight accident near the school gate.');
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <div className="report-form-container">
      <h2 style={{ marginBottom: '16px' }}>Report Issue</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <textarea 
            placeholder="Describe the traffic issue or use voice input..." 
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>

        <div className="flex-between">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              className="secondary" 
              onClick={toggleVoice}
              style={{ 
                padding: '8px', 
                borderRadius: '50%', 
                color: isRecording ? 'var(--danger)' : 'white',
                borderColor: isRecording ? 'var(--danger)' : 'var(--surface-border)'
              }}
              title="Voice Input"
            >
              <Mic size={20} />
            </button>
            <button 
              type="button" 
              className="secondary" 
              style={{ padding: '8px', borderRadius: '50%' }}
              title="Upload Image"
            >
              <ImageIcon size={20} />
            </button>
          </div>

          <button type="submit" disabled={loading} style={{ padding: '8px 24px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Analyzing...' : (
              <>
                <Send size={16} /> Submit
              </>
            )}
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>💡 <em>Tip: You can say "Heavy traffic near..." or upload a photo, and our AI will automatically classify and pin it.</em></p>
      </div>
    </div>
  );
};

export default ReportForm;
