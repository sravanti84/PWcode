import React, { useState, useRef } from 'react';
import { Mic, Image as ImageIcon, Send, CheckCircle } from 'lucide-react';

const ReportForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [apiError, setApiError] = useState(null);
  
  const fileInputRef = useRef(null);
  const locationRef = useRef(null);

  React.useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(locationRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setLocation(place.formatted_address || place.name);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setApiError(null);
    
    try {
      const response = await fetch('https://traffic-assistant-backend-788713020207.us-central1.run.app/api/analyze/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, location, image: imageBase64 })
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setApiError(data.error || 'Failed to process report.');
        setLoading(false);
        return;
      }
      
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
      setLocation('');
      setImageBase64(null);
      setApiError(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="report-form-container">
      <h2 style={{ marginBottom: '16px' }}>Report Issue</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input 
            ref={locationRef}
            type="text" 
            placeholder="Search Location..." 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ marginBottom: '12px', padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
          />
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
              onClick={() => fileInputRef.current.click()}
              style={{ padding: '8px', borderRadius: '50%' }}
              title="Upload Image"
            >
              <ImageIcon size={20} />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              hidden 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>

          <button type="submit" disabled={loading} style={{ padding: '8px 24px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Analyzing...' : (
              <>
                <Send size={16} /> Submit
              </>
            )}
          </button>
        </div>
        {imageBase64 && (
          <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--success)' }}>
            <CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Image attached successfully
          </div>
        )}
        
        {apiError && (
          <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '0.85rem' }}>
            <strong>Error:</strong> {apiError}
          </div>
        )}
      </form>
      
      <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>💡 <em>Tip: You can say "Heavy traffic near..." or upload a photo, and our AI will automatically classify and pin it.</em></p>
      </div>
    </div>
  );
};

export default ReportForm;
