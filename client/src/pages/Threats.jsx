import { useState, useEffect } from 'react';
import axios from 'axios';

function Threats() {
  const [threats, setThreats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    signature: '',
    severity: 'medium'
  });

  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    try {
      const res = await axios.get('/api/threats');
      setThreats(res.data);
    } catch (error) {
      console.error('Failed to fetch threats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.name.trim() || !formData.signature.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      await axios.post('/api/threats', formData);
      setFormData({ name: '', signature: '', severity: 'medium' });
      setShowForm(false);
      fetchThreats();
    } catch (error) {
      alert('Failed to add threat: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px' }}>Threat Database</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Threat'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Add New Threat Signature</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Threat Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Signature (hash or pattern)</label>
              <input
                type="text"
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                required
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                style={{
                  padding: '10px',
                  background: '#0f0f0f',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  color: '#e0e0e0',
                  fontSize: '14px',
                  width: '200px'
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">Add Threat</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Known Threats ({threats.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Signature</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Severity</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Added</th>
              </tr>
            </thead>
            <tbody>
              {threats.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                    No threat signatures yet. Click "Add Threat" to add your first signature.
                  </td>
                </tr>
              ) : (
                threats.map((threat) => (
                  <tr key={threat.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '10px' }}>{threat.name}</td>
                    <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
                      {threat.signature.substring(0, 40)}...
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: getSeverityColor(threat.severity)
                      }}>
                        {threat.severity}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{new Date(threat.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getSeverityColor(severity) {
  const colors = {
    low: '#10b98120',
    medium: '#f59e0b20',
    high: '#ef444420',
    critical: '#dc262620'
  };
  return colors[severity] || colors.medium;
}

export default Threats;
