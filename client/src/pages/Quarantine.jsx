import { useState, useEffect } from 'react';
import axios from 'axios';

function Quarantine() {
  const [quarantined, setQuarantined] = useState([]);

  useEffect(() => {
    fetchQuarantined();
  }, []);

  const fetchQuarantined = async () => {
    try {
      const res = await axios.get('/api/threats/quarantine');
      setQuarantined(res.data);
    } catch (error) {
      console.error('Failed to fetch quarantined files:', error);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px', fontSize: '28px' }}>Quarantine</h1>
      
      <div className="card">
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Quarantined Files ({quarantined.length})</h2>
        
        {quarantined.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            No files in quarantine
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Original Path</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Threat</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Quarantined</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quarantined.map((file) => (
                  <tr key={file.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '10px' }}>{file.original_path}</td>
                    <td style={{ padding: '10px' }}>
                      <span className="status-threat">{file.threat_name}</span>
                    </td>
                    <td style={{ padding: '10px' }}>{new Date(file.quarantined_at).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>
                      <button className="btn btn-danger" style={{ fontSize: '12px', padding: '6px 12px' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quarantine;
