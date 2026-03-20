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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div className="flex-between" style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>Total Reports</span>
            <TrendingUp size={18} />
          </div>
          <h3 style={{ fontSize: '2.2rem', margin: 0, fontWeight: '700' }}>{reports.length}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cumulative traffic data</p>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div className="flex-between" style={{ marginBottom: '12px', color: 'var(--danger)' }}>
            <span style={{ fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>Critical Issues</span>
            <AlertCircle size={18} />
          </div>
          <h3 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--danger)', fontWeight: '700' }}>{criticalCount}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: 'rgba(239, 68, 68, 0.7)' }}>Needs immediate attention</p>
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
