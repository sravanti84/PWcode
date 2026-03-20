import React from 'react';
import { AlertCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

const Dashboard = ({ reports }) => {
  const criticalCount = reports.filter(r => r.severity === 'Critical').length;

  return (
    <div className="dashboard-container">
      <div className="flex-between mb-4">
        <h2>Live Overview</h2>
        <span className="badge warning">Active</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
          <div className="flex-between" style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
            <span>Total Reports</span>
            <TrendingUp size={16} />
          </div>
          <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{reports.length}</h3>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px' }}>
          <div className="flex-between" style={{ marginBottom: '8px', color: 'var(--danger)' }}>
            <span>Critical</span>
            <AlertCircle size={16} />
          </div>
          <h3 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--danger)' }}>{criticalCount}</h3>
        </div>
      </div>

      <h3>Recent Alerts</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
        {reports.slice(0, 3).map((report, idx) => (
          <div 
            key={report.id || idx} 
            style={{ 
              padding: '12px', 
              borderLeft: `4px solid ${report.severity === 'Critical' ? 'var(--danger)' : 'var(--warning)'}`,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '0 8px 8px 0'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.9rem' }}>{report.type}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {report.time}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>{report.location}</p>
          </div>
        ))}

        {reports.length === 0 && (
          <p style={{ textAlign: 'center', padding: '24px 0', fontStyle: 'italic' }}>
            No active traffic alerts.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
