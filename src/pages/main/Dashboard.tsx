import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Screen } from '../../types';

export default function Dashboard({ setScreen }: { setScreen: (s: Screen) => void }) {
  // Modal State for "View all activity"
  const [showActivityModal, setShowActivityModal] = useState(false);

  // Eto yung reusable style para makuha ulit natin yung Glassmorphism look
  const glassCard = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
  };

  const headerStyle = {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#1a1630',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '1rem',
    marginLeft: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#1a1630'
  };

  const valueStyle = {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#d4163c', // TUP Red
    marginBottom: '0.25rem'
  };

  return (
    <div className="fade-up" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', transition: 'all 0.3s' }}>      
      
      {/* OVERVIEW SECTION */}
      <section>
        <h2 style={headerStyle}>Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <div style={glassCard}>
            <span style={valueStyle}>12</span>
            <span style={labelStyle}>Pending</span>
          </div>
          <div style={glassCard}>
            <span style={valueStyle}>2</span>
            <span style={labelStyle}>Total Conflicts</span>
          </div>
          <div style={glassCard}>
            <span style={valueStyle}>148</span>
            <span style={labelStyle}>Total Faculty</span>
          </div>
          <div style={glassCard}>
            <span style={valueStyle}>42</span>
            <span style={labelStyle}>Total Rooms</span>
          </div>
        </div>
      </section>

      {/* MIDDLE SECTION (Conflict Summary & Recent Activity) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        
        {/* Conflict Summary */}
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={headerStyle}>Conflict Summary</h2>
          <div style={{ ...glassCard, flex: 1, padding: '2.5rem' }}>
            
            {/* Custom Doughnut Chart Indicator */}
            <div style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '50%', background: 'conic-gradient(#f59e0b 0% 70%, #d4163c 70% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1a1630', lineHeight: 1 }}>2</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7a6f9a', marginTop: '4px' }}>Total</span>
              </div>
            </div>

            {/* BUTTON NAGIGING INTERACTIVE (ROUTING TO CHECK CONFLICTS) */}
            <button 
              onClick={() => setScreen('conflict')}
              className="btn-red" 
              style={{ 
                width: '100%', 
                padding: '0.85rem', 
                borderRadius: '12px', 
                fontSize: '0.95rem', 
                fontWeight: 700, 
                color: '#ffffff', 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                boxShadow: '0 8px 20px rgba(212,22,60,0.3)' 
              }}
            >
              Go to Check Conflicts
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={headerStyle}>Recent Activity</h2>
          <div style={{ ...glassCard, flex: 1, alignItems: 'flex-start', textAlign: 'left', padding: '2rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1 }}>
              {[
                { text: 'Schedule generation completed', status: 'ok' },
                { text: '2 conflicts require attention', status: 'warn' },
                { text: 'Input data updated', status: 'ok' },
                { text: 'Schedule pending review', status: 'ok' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: item.status === 'warn' ? 'rgba(212,22,60,0.15)' : 'rgba(32,167,131,0.15)', border: item.status === 'warn' ? '1px solid rgba(212,22,60,0.3)' : '1px solid rgba(32,167,131,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.status === 'warn' ? '#d4163c' : '#20a783', fontWeight: 'bold' }}>
                    {item.status === 'warn' ? '!' : '✓'}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1630' }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              {/* BUTTON NAGIGING INTERACTIVE (OPENS ACTIVITY MODAL) */}
              <button 
                onClick={() => setShowActivityModal(true)}
                style={{ background: 'transparent', border: '1.5px solid rgba(26,22,48,0.2)', color: '#1a1630', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(26,22,48,0.05)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                View all activity
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* SCHEDULE QUICK ACTIONS */}
      <section>
        <h2 style={headerStyle}>Schedule Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <div style={glassCard}>
            <span style={valueStyle}>312</span>
            <span style={labelStyle}>Total Classes</span>
          </div>
          <div style={glassCard}>
            <span style={valueStyle}>100%</span>
            <span style={labelStyle}>Faculty Assigned</span>
          </div>
          <div style={glassCard}>
            <span style={valueStyle}>42</span>
            <span style={labelStyle}>Rooms Utilized</span>
          </div>
          <div style={glassCard}>
            <span style={valueStyle}>85%</span>
            <span style={labelStyle}>Time Slot Utilization</span>
          </div>
        </div>
      </section>

      {/* ACTIVITY LOG HISTORY MODAL */}
      {showActivityModal && createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26, 22, 48, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="fade-up" style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ background: '#f8f9fa', padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1630', margin: 0 }}>System Activity Log</h3>
              <button onClick={() => setShowActivityModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>

            {/* Modal Body - Scrollable Log History */}
            <div style={{ padding: '2rem', flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                
                {[
                  { text: 'Schedule generation completed', date: 'Today at 02:45 PM', status: 'ok', detail: 'SAGE AI successfully optimized the 1st Sem schedule in 4.2 seconds.' },
                  { text: '2 conflicts require attention', date: 'Today at 02:45 PM', status: 'warn', detail: 'Detected room overlap in LAB-401.' },
                  { text: 'Input data updated', date: 'Today at 10:15 AM', status: 'info', detail: 'New faculty masterlist uploaded by Admin.' },
                  { text: 'Schedule pending review', date: 'Yesterday at 04:30 PM', status: 'ok', detail: 'Awaiting Department Head approval.' },
                  { text: 'Service subjects plotted', date: 'Yesterday at 01:20 PM', status: 'info', detail: 'Math Dept added Calculus blocks.' },
                  { text: 'Room list synchronized', date: 'Sep 25, 2026', status: 'ok', detail: 'Facility availability matrix updated.' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.25rem', padding: '1rem 0', borderBottom: i === 5 ? 'none' : '1px solid #f3f4f6' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: item.status === 'warn' ? 'rgba(212,22,60,0.1)' : item.status === 'info' ? 'rgba(2,132,199,0.1)' : 'rgba(32,167,131,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.status === 'warn' ? '#d4163c' : item.status === 'info' ? '#0284c7' : '#20a783', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {item.status === 'warn' ? <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path> : item.status === 'info' ? <circle cx="12" cy="12" r="10"></circle> : <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>}
                        {item.status === 'warn' ? <><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></> : item.status === 'info' ? <><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></> : <polyline points="22 4 12 14.01 9 11.01"></polyline>}
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1630', marginBottom: '0.2rem' }}>{item.text}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.4rem' }}>{item.detail}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>{item.date}</div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 2rem', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'center' }}>
              <button style={{ background: 'none', border: 'none', fontWeight: 700, color: '#d4163c', cursor: 'pointer', fontSize: '0.85rem' }}>Download Activity Log (.csv)</button>
            </div>
            
          </div>
        </div>,
        document.body
      )}
      
    </div>
  );
}