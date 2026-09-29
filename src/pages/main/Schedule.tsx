import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function Schedule() {
  const [selectedProgram, setSelectedProgram] = useState<'CS' | 'IT' | 'IS'>('CS');
  const [filterType, setFilterType] = useState<'Section' | 'Faculty' | 'Room' | 'Course'>('Section');
  const [activeFilter, setActiveFilter] = useState('BSCS 3-1');
  
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [selectedProfModal, setSelectedProfModal] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  
  // Hiwalay na schedule data para sa bawat programa (CS, IT, IS)
  const scheduleDatabase = {
    CS: [
      { id: 1, course: 'CS311', name: 'Software Engineering 1', day: 'Monday', startTime: 8, duration: 3, room: 'LAB-401', prof: 'Dr. Dela Cruz', type: 'Lab', section: 'BSCS 3-1' },
      { id: 2, course: 'CS315', name: 'Operating Systems', day: 'Monday', startTime: 13, duration: 3, room: 'LAB-402', prof: 'Prof. Santos', type: 'Lab', section: 'BSCS 3-1' },
      { id: 3, course: 'CS312', name: 'Artificial Intelligence', day: 'Tuesday', startTime: 8, duration: 3, room: 'LAB-401', prof: 'Prof. Santos', type: 'Lab', section: 'BSCS 3-1' },
      { id: 4, course: 'CS316', name: 'Information Assurance & Security', day: 'Tuesday', startTime: 13, duration: 3, room: 'LEC-305', prof: 'Dr. Reyes', type: 'Lec', section: 'BSCS 3-1' },
      { id: 5, course: 'CS313', name: 'Automata Theory and Computability', day: 'Wednesday', startTime: 9, duration: 3, room: 'LEC-301', prof: 'Dr. Reyes', type: 'Lec', section: 'BSCS 3-1' },
      { id: 6, course: 'CS111', name: 'Intro to Computing', day: 'Monday', startTime: 13, duration: 3, room: 'LAB-401', prof: 'Dr. Reyes', type: 'Lab', section: 'BSCS 1-1' },
      { id: 7, course: 'MATH101', name: 'Calculus 1', day: 'Tuesday', startTime: 8, duration: 3, room: 'LEC-301', prof: 'Prof. Garcia', type: 'Lec', section: 'BSCS 1-1' },
    ],
    IT: [
      { id: 101, course: 'IT311', name: 'Web Systems and Technologies', day: 'Monday', startTime: 8, duration: 3, room: 'LAB-402', prof: 'Prof. Cruz', type: 'Lab', section: 'BSIT 3-1' },
      { id: 102, course: 'IT211', name: 'Networking 1', day: 'Tuesday', startTime: 10, duration: 3, room: 'LAB-401', prof: 'Prof. Aquino', type: 'Lab', section: 'BSIT 2-1' },
      { id: 103, course: 'IT111', name: 'Intro to Information Technology', day: 'Wednesday', startTime: 9, duration: 3, room: 'LEC-301', prof: 'Dr. Santos', type: 'Lec', section: 'BSIT 1-1' },
    ],
    IS: [
      { id: 201, course: 'IS311', name: 'IS Strategy and Acquisition', day: 'Monday', startTime: 9, duration: 3, room: 'LEC-305', prof: 'Dr. Mendoza', type: 'Lec', section: 'BSIS 3-1' },
      { id: 202, course: 'IS212', name: 'Data Analytics', day: 'Thursday', startTime: 13, duration: 3, room: 'LAB-402', prof: 'Prof. Garcia', type: 'Lab', section: 'BSIS 2-1' },
    ]
  };

  const currentScheduleData = scheduleDatabase[selectedProgram];

  const glassPanel = { background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)' };
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = [
    { label: '7:00 AM', val: 7 }, { label: '8:00 AM', val: 8 }, { label: '9:00 AM', val: 9 },
    { label: '10:00 AM', val: 10 }, { label: '11:00 AM', val: 11 }, { label: '12:00 PM', val: 12 },
    { label: '1:00 PM', val: 13 }, { label: '2:00 PM', val: 14 }, { label: '3:00 PM', val: 15 },
    { label: '4:00 PM', val: 16 }, { label: '5:00 PM', val: 17 }, { label: '6:00 PM', val: 18 },
    { label: '7:00 PM', val: 19 }, { label: '8:00 PM', val: 20 }
  ];

  const facultyRecommendations = [
    { name: 'Prof. Cruz', stars: 3, desc: 'Best Match — Qualified, Available, Lowest Teaching Load, Matches Preferred Schedule.' },
    { name: 'Prof. Reyes', stars: 2, desc: 'Qualified, Available, Near Maximum Load.' },
    { name: 'Prof. Santos', stars: 1, desc: 'Qualified, Limited Availability.' }
  ];

  const getDayColumn = (dayStr: string) => days.indexOf(dayStr) + 2;
  const getTimeRow = (startHour: number) => (startHour - 7) + 2;

  const getFilterOptions = () => {
    switch(filterType) {
      case 'Section': 
        if (selectedProgram === 'CS') return ['BSCS 1-1', 'BSCS 2-1', 'BSCS 3-1', 'BSCS 4-1'];
        if (selectedProgram === 'IT') return ['BSIT 1-1', 'BSIT 2-1', 'BSIT 3-1', 'BSIT 4-1'];
        return ['BSIS 1-1', 'BSIS 2-1', 'BSIS 3-1', 'BSIS 4-1'];
      case 'Faculty': return ['Dr. Dela Cruz', 'Prof. Santos', 'Dr. Reyes', 'Prof. Garcia', 'Prof. Cruz'];
      case 'Room': return ['LAB-401', 'LAB-402', 'LEC-301', 'LEC-305', 'ONLINE'];
      case 'Course': 
        if (selectedProgram === 'CS') return ['CS311', 'CS315', 'CS312', 'CS316', 'CS313', 'CS111', 'MATH101'];
        if (selectedProgram === 'IT') return ['IT311', 'IT211', 'IT111'];
        return ['IS311', 'IS212'];
      default: return [];
    }
  };

  const displayedSchedule = currentScheduleData.filter((cls) => {
    if (filterType === 'Section') return cls.section === activeFilter;
    if (filterType === 'Faculty') return cls.prof === activeFilter;
    if (filterType === 'Room') return cls.room === activeFilter;
    if (filterType === 'Course') return cls.course === activeFilter;
    return true;
  });

  const handleOpenEditModal = (block: any) => {
    setEditingBlock(block);
    setSelectedProfModal(block.prof);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportToast(true);
      setTimeout(() => setExportToast(false), 3000);
    }, 1200);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = e.target as HTMLFormElement;
    const data = new FormData(formData);
    const newRoom = data.get('room') as string;
    const newDay = data.get('day') as string;
    const newStartTime = parseInt(data.get('startTime') as string);
    const newDuration = parseInt(data.get('duration') as string) || editingBlock.duration;
    const newProf = selectedProfModal !== editingBlock.prof ? selectedProfModal : (data.get('prof') as string);

    if (newStartTime + newDuration > 20) {
      setIsSaving(false);
      setEditingBlock(null);
      setConflictError(`Operating Hours Violation: Classes cannot extend beyond 8:00 PM.`);
      return;
    }

    setTimeout(() => {
      setIsSaving(false);
      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        setEditingBlock(null);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setEditingBlock(null);
        setConflictError(`System blocked adjustment to ${newRoom} on ${newDay}. Violates hard constraints (Double-booking or room mismatch).`);
      }
    }, 800); 
  };

  return (
    <div className="fade-up" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
      
      {createPortal(
        <div style={{ position: 'fixed', top: showSuccessToast ? '2rem' : '-100px', left: '50%', transform: 'translateX(-50%)', opacity: showSuccessToast ? 1 : 0, pointerEvents: showSuccessToast ? 'auto' : 'none', background: '#20a783', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 25px rgba(32,167,131,0.4)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 9999 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          Manual adjustment and duration saved successfully!
        </div>,
        document.body
      )}

      {createPortal(
        <div style={{ position: 'fixed', top: exportToast ? '2rem' : '-100px', left: '50%', transform: 'translateX(-50%)', opacity: exportToast ? 1 : 0, pointerEvents: exportToast ? 'auto' : 'none', background: '#20a783', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 25px rgba(32,167,131,0.4)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 9999 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          Schedule PDF exported successfully!
        </div>,
        document.body
      )}

      {/* HEADER CONTROLS WITH PROGRAM SELECTOR */}
      <div style={{ ...glassPanel, padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1630', margin: '0 0 0.25rem 0' }}>Department Schedule Board ({selectedProgram})</h2>
          <p style={{ fontSize: '0.9rem', color: '#7a6f9a', margin: 0 }}>Review and manually adjust AI-generated schedules with dynamic time allocation.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* PROGRAM TABS */}
          <div style={{ display: 'flex', background: '#e5e7eb', padding: '0.3rem', borderRadius: '10px', gap: '0.2rem' }}>
            {(['CS', 'IT', 'IS'] as const).map(prog => (
              <button
                key={prog}
                onClick={() => {
                  setSelectedProgram(prog);
                  setActiveFilter(prog === 'CS' ? 'BSCS 3-1' : prog === 'IT' ? 'BSIT 3-1' : 'BSIS 3-1');
                }}
                style={{ background: selectedProgram === prog ? '#fff' : 'transparent', color: selectedProgram === prog ? '#d4163c' : '#4b5563', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', boxShadow: selectedProgram === prog ? '0 2px 6px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
              >
                {prog}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.3rem' }}>
            {['Section', 'Faculty', 'Room', 'Course'].map((type) => {
              const getFirstOptionForType = (t: string) => {
                switch(t) {
                  case 'Section': return selectedProgram === 'CS' ? 'BSCS 3-1' : selectedProgram === 'IT' ? 'BSIT 3-1' : 'BSIS 3-1';
                  case 'Faculty': return 'Dr. Dela Cruz';
                  case 'Room': return 'LAB-401';
                  case 'Course': return selectedProgram === 'CS' ? 'CS311' : selectedProgram === 'IT' ? 'IT311' : 'IS311';
                  default: return '';
                }
              };

              return (
                <button 
                  key={type}
                  onClick={() => {
                    setFilterType(type as any);
                    setActiveFilter(getFirstOptionForType(type));
                  }}
                  style={{ background: filterType === type ? '#fff' : 'transparent', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: filterType === type ? 700 : 600, fontSize: '0.85rem', color: filterType === type ? '#d4163c' : '#6b7280', cursor: 'pointer', boxShadow: filterType === type ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
                >
                  {type}
                </button>
              );
            })}
          </div>
          
          <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 700, color: '#1a1630', cursor: 'pointer', background: '#fff', minWidth: '160px' }}>
            {getFilterOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            style={{ background: '#1a1630', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 700, cursor: isExporting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isExporting ? 0.8 : 1 }}
          >
            {isExporting ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin-animation"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            )}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* STABLE CALENDAR GRID */}
      <div style={{ ...glassPanel, padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', gridTemplateRows: '50px repeat(14, 75px)', gap: '1px', background: 'rgba(26,22,48,0.1)', border: '1px solid rgba(26,22,48,0.1)', borderRadius: '12px', overflow: 'hidden', minWidth: '1100px' }}>
          
          <div style={{ background: '#f8f9fa', gridColumn: '1 / 2', gridRow: '1 / 2' }}></div>

          {days.map((day, idx) => (
            <div key={day} style={{ background: '#f8f9fa', gridColumn: `${idx + 2} / ${idx + 3}`, gridRow: '1 / 2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#4a3f7a', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              {day}
            </div>
          ))}

          {times.map((time, timeIdx) => {
            const row = timeIdx + 2;
            return (
              <React.Fragment key={time.val}>
                <div style={{ background: '#fff', gridColumn: '1 / 2', gridRow: `${row} / ${row + 1}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#7a6f9a' }}>
                  {time.label}
                </div>
                {days.map((day, dayIdx) => {
                  const col = dayIdx + 2;
                  return (
                    <div key={`${day}-${time.val}`} style={{ background: '#fff', gridColumn: `${col} / ${col + 1}`, gridRow: `${row} / ${row + 1}`, borderBottom: '1px dashed rgba(26,22,48,0.05)' }}></div>
                  );
                })}
              </React.Fragment>
            );
          })}

          {displayedSchedule.map((cls) => {
            const isOnline = cls.type === 'Online';
            const isLab = cls.type === 'Lab';
            const blockStyle = { background: isOnline ? 'rgba(122, 63, 186, 0.15)' : isLab ? 'rgba(32, 167, 131, 0.15)' : 'rgba(212, 22, 60, 0.1)', borderLeft: `4px solid ${isOnline ? '#7a3fba' : isLab ? '#20a783' : '#d4163c'}`, color: isOnline ? '#4b1d7d' : isLab ? '#11634d' : '#8a1a21' };

            return (
              <div 
                key={cls.id} onClick={() => handleOpenEditModal(cls)} className="schedule-block"
                style={{ gridColumn: `${getDayColumn(cls.day)} / ${getDayColumn(cls.day) + 1}`, gridRow: `${getTimeRow(cls.startTime)} / span ${cls.duration}`, background: blockStyle.background, borderLeft: blockStyle.borderLeft, borderRadius: '6px', margin: '4px', padding: '0.75rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 10 }}
                title="Click to manually adjust time, duration, room, or faculty"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: blockStyle.color }}>{cls.course}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#fff', padding: '0.2rem 0.5rem', borderRadius: '12px', color: blockStyle.color }}>{cls.duration}h • {cls.type}</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.9, marginBottom: 'auto', lineHeight: 1.2 }}>{cls.name}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, opacity: 0.8 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>{cls.room}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, opacity: 0.8 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>{cls.prof}</div>
                  {(filterType === 'Faculty' || filterType === 'Room') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: blockStyle.color, marginTop: '0.2rem' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      {cls.section}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingBlock && createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26, 22, 48, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <form onSubmit={handleSaveAdjustment} className="fade-up" style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '580px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1630', margin: '0 0 0.5rem' }}>Manual Adjustment</h3>
            <p style={{ fontSize: '0.9rem', color: '#7a6f9a', margin: '0 0 2rem' }}>Editing {editingBlock.course} ({editingBlock.section})</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.6rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a1630', display: 'block' }}>Faculty Reassignment</label>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#20a783', background: 'rgba(32,167,131,0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="#20a783" stroke="#20a783" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> AI Decision-Aid</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '170px', overflowY: 'auto', border: '1px solid rgba(26,22,48,0.1)', borderRadius: '12px', padding: '0.5rem', background: '#f8f9fa' }}>
                  {facultyRecommendations.map((prof) => {
                    const isSelected = selectedProfModal === prof.name;
                    return (
                      <div key={prof.name} onClick={() => setSelectedProfModal(prof.name)} style={{ padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', background: isSelected ? '#fff' : 'transparent', border: isSelected ? '1px solid #20a783' : '1px solid transparent', boxShadow: isSelected ? '0 2px 8px rgba(32,167,131,0.15)' : 'none', transition: 'all 0.2s', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '0.1rem', marginTop: '0.2rem', width: '45px', flexShrink: 0 }}>
                           {Array(3).fill(0).map((_, i) => <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < prof.stars ? "#f59e0b" : "none"} stroke={i < prof.stars ? "#f59e0b" : "#cbd5e1"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>)}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isSelected ? '#20a783' : '#1a1630', marginBottom: '0.2rem' }}>{prof.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#7a6f9a', lineHeight: 1.4 }}>{prof.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a3f7a', display: 'block', marginBottom: '0.4rem' }}>Assigned Room</label>
                <select name="room" defaultValue={editingBlock.room} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(26,22,48,0.15)', outline: 'none', cursor: 'pointer' }}>
                  <option value="LAB-401">LAB-401</option><option value="LAB-402">LAB-402</option><option value="LEC-301">LEC-301</option><option value="LEC-305">LEC-305</option><option value="ONLINE">ONLINE (Virtual)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a3f7a', display: 'block', marginBottom: '0.4rem' }}>Day</label>
                <select name="day" defaultValue={editingBlock.day} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(26,22,48,0.15)', outline: 'none', cursor: 'pointer' }}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a3f7a', display: 'block', marginBottom: '0.4rem' }}>Start Time</label>
                <select name="startTime" defaultValue={editingBlock.startTime} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(26,22,48,0.15)', outline: 'none', cursor: 'pointer' }}>
                  {times.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a3f7a', display: 'block', marginBottom: '0.4rem' }}>Duration (Hours)</label>
                <select name="duration" defaultValue={editingBlock.duration} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(26,22,48,0.15)', outline: 'none', cursor: 'pointer' }}>
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours (Standard Block)</option>
                </select>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
              <button type="button" onClick={() => setEditingBlock(null)} disabled={isSaving} style={{ background: 'transparent', color: '#7a6f9a', border: 'none', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', padding: '0.5rem 1rem' }}>Cancel</button>
              <button type="submit" disabled={isSaving} style={{ background: '#20a783', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '10px', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(32,167,131,0.2)' }}>
                {isSaving ? 'Validating...' : 'Validate & Save'}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* CONFLICT ERROR MODAL */}
      {conflictError && createPortal(
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26, 22, 48, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="fade-up" style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(212,22,60,0.3)', borderTop: '6px solid #d4163c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(212,22,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4163c', flexShrink: 0 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
              <div><h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a1630', margin: '0 0 0.2rem' }}>Hard Constraint Violation</h3><p style={{ fontSize: '0.85rem', color: '#d4163c', fontWeight: 700, margin: 0 }}>Manual edit rejected by the system.</p></div>
            </div>
            <div style={{ background: '#f8f9fa', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', color: '#4a3f7a', lineHeight: 1.5, fontWeight: 600, marginBottom: '2.5rem' }}>{conflictError}</div>
            <button onClick={() => setConflictError(null)} style={{ width: '100%', background: '#d4163c', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.2s' }}>Revert Changes</button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}