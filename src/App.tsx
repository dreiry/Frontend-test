import { useState } from 'react';
import { Screen } from './types';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import TwoFA from './pages/auth/TwoFA';
import { MainShell } from './components/Layout';
import Dashboard from './pages/main/Dashboard';
import ManageData from './pages/main/ManageData';
import GenerateSchedule from './pages/main/GenerateSchedule';
import Schedule from './pages/main/Schedule';
import Conflict from './pages/main/Conflict';
import Reports from './pages/main/Reports';
import ServicePortal from './pages/main/ServicePortal';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');

  if (screen === 'login') return <Login setScreen={setScreen} />;
  if (screen === 'signup') return <SignUp setScreen={setScreen} />;
  if (screen === '2fa') return <TwoFA setScreen={setScreen} />;

  return (
    <MainShell screen={screen} setScreen={setScreen}>
      {/* Idinagdag ang setScreen={setScreen} dito sa Dashboard para gumana ang mga buttons! */}
      {screen === 'dashboard' && <Dashboard setScreen={setScreen} />}
      {screen === 'manage' && <ManageData setScreen={setScreen} />}
      {screen === 'generate' && <GenerateSchedule setScreen={setScreen} />}
      {screen === 'schedule' && <Schedule />}
      {screen === 'conflict' && <Conflict setScreen={setScreen} />}
      {screen === 'reports' && <Reports setScreen={setScreen} />}
      {screen === 'service-portal' && <ServicePortal setScreen={setScreen} />}
    </MainShell>
  );
}