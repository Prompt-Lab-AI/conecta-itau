/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CitizenHeader } from './components/layout/CitizenHeader';
import { Footer } from './components/layout/Footer';
import { CitizenHome } from './components/citizen/CitizenHome';
import { RegisterManifestation } from './components/citizen/RegisterManifestation';
import { TrackProtocol } from './components/citizen/TrackProtocol';
import { EmergencyModal } from './components/citizen/EmergencyModal';
import { WhatsAppNotificationModal } from './components/common/WhatsAppNotificationModal';
import { ToastContainer } from './components/common/ToastContainer';
import { StaffLogin } from './components/staff/StaffLogin';
import { StaffLayout } from './components/layout/StaffLayout';
import { AttendancePanel } from './components/staff/AttendancePanel';
import { ManagementDashboard } from './components/staff/ManagementDashboard';
import { SettingsPanel } from './components/staff/SettingsPanel';
import { ManifestationType } from './types';

const MainApp: React.FC = () => {
  const { 
    currentStaffUser, 
    activeCitizenView, 
    setActiveCitizenView,
    activeStaffTab
  } = useApp();

  const [staffLoginModalOpen, setStaffLoginModalOpen] = useState(false);
  const [browseAsCitizen, setBrowseAsCitizen] = useState(false);

  // Initial category/type when jumping from CitizenHome
  const [registerInitialType, setRegisterInitialType] = useState<ManifestationType>('solicitacao');
  const [registerInitialCategory, setRegisterInitialCategory] = useState<string>('');

  const handleSelectHomeType = (type: ManifestationType, defaultCat?: string) => {
    setRegisterInitialType(type);
    setRegisterInitialCategory(defaultCat || '');
    setActiveCitizenView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is logged in as staff and not explicitly browsing the public portal
  if (currentStaffUser && !browseAsCitizen) {
    return (
      <StaffLayout onGoToCitizenPortal={() => setBrowseAsCitizen(true)}>
        {activeStaffTab === 'atendimento' && <AttendancePanel />}
        {activeStaffTab === 'gestao' && <ManagementDashboard />}
        {activeStaffTab === 'configuracoes' && <SettingsPanel />}

        <EmergencyModal />
        <WhatsAppNotificationModal />
        <ToastContainer />
      </StaffLayout>
    );
  }

  // Citizen Public Portal
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      {/* If staff is browsing public portal, show banner to return to admin panel */}
      {currentStaffUser && (
        <div className="bg-[#2D3C4F] text-white px-4 py-2 text-xs flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-blue-300">shield_person</span>
            <span>
              Você está navegando no modo público como <strong>{currentStaffUser.name}</strong> ({currentStaffUser.roleTitle}).
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBrowseAsCitizen(false)}
            className="px-3 py-1 bg-[#003781] hover:bg-[#174EA6] text-white font-bold rounded-md shadow-2xs transition-colors"
          >
            Voltar ao Painel do Servidor
          </button>
        </div>
      )}

      {/* Institutional Header */}
      <CitizenHeader 
        onOpenStaffLogin={() => {
          if (currentStaffUser) {
            setBrowseAsCitizen(false);
          } else {
            setStaffLoginModalOpen(true);
          }
        }} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {activeCitizenView === 'home' && (
          <CitizenHome onSelectType={handleSelectHomeType} />
        )}

        {activeCitizenView === 'register' && (
          <RegisterManifestation
            initialType={registerInitialType}
            initialCategory={registerInitialCategory}
            onCancel={() => {
              setActiveCitizenView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeCitizenView === 'track' && (
          <TrackProtocol />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Modals & Floating Utilities */}
      {staffLoginModalOpen && (
        <StaffLogin onClose={() => setStaffLoginModalOpen(false)} />
      )}

      <EmergencyModal />
      <WhatsAppNotificationModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
