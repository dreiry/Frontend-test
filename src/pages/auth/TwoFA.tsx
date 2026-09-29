import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Screen } from '../../types';

export default function TwoFA({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // States for Polish Features
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleDigit = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };
  
  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;
    
    setIsResending(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsResending(false);
      setCooldown(30);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const handleVerify = () => {
    // Basic validation: check if all 6 digits are filled
    if (digits.some(d => d === '')) {
      alert("Please enter the complete 6-digit code.");
      return;
    }

    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setScreen('dashboard');
    }, 1000);
  };

  return (
    <div 
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: "url('/tup-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}
    >
      {/* Toast Notification via Portal */}
      {createPortal(
        <div style={{ position: 'fixed', top: showToast ? '2rem' : '-100px', left: '50%', transform: 'translateX(-50%)', opacity: showToast ? 1 : 0, pointerEvents: showToast ? 'auto' : 'none', background: '#20a783', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 25px rgba(32,167,131,0.4)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 9999 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          A new verification code has been sent.
        </div>,
        document.body
      )}

      {/* Dark blur overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}></div>
      
      <div className="glass fade-up" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420, padding: '2.75rem 2.5rem', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(212,22,60,0.1)', border: '1.5px solid rgba(212,22,60,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#d4163c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 600, color: '#1a1630', margin: '0 0 0.4rem' }}>Security Verification</h2>
        <p style={{ fontSize: '0.85rem', color: '#7a6f9a', margin: '0 0 2rem', lineHeight: 1.5 }}>
          Enter the 6-digit code sent to your TUP email
        </p>

        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
          {digits.map((d, i) => (
            <input key={i} ref={refs[i]} className="otp-box" maxLength={1} value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)} 
              style={{ width: 44, height: 52, textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, borderRadius: 12, border: '1px solid #d1d5db', backgroundColor: '#f9fafb', color: '#1a1630', outlineColor: '#d4163c' }}
            />
          ))}
        </div>

        {/* Resend Button with Cooldown Logic */}
        <button 
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: (cooldown > 0 || isResending) ? 'default' : 'pointer', 
            fontSize: '0.82rem', 
            color: (cooldown > 0 || isResending) ? '#9ca3af' : '#d4163c', 
            fontWeight: 600, 
            fontFamily: 'DM Sans, sans-serif', 
            marginBottom: '1.5rem',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '0.4rem'
          }}
        >
          {isResending ? (
             <>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spin-animation"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
               Sending...
             </>
          ) : cooldown > 0 ? (
            `Resend code in ${cooldown}s`
          ) : (
            'Resend Code'
          )}
        </button>

        {/* Verify Button with Loading State */}
        <button 
          className="btn-red" 
          disabled={isVerifying}
          style={{ 
            width: '100%', 
            padding: '0.85rem', 
            fontSize: '1rem', 
            borderRadius: 14,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isVerifying ? 0.8 : 1,
            cursor: isVerifying ? 'not-allowed' : 'pointer'
          }}
          onClick={handleVerify}
        >
          {isVerifying ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spin-animation"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          ) : (
            'Verify'
          )}
        </button>

        <button onClick={() => setScreen('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '1rem', fontSize: '0.8rem', color: '#9a8fc0', fontFamily: 'DM Sans, sans-serif', display: 'block', width: '100%' }}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}