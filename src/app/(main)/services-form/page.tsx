'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStep, resetAccountOpeningState } from '@/redux/slices/accountOpeningSlice';
import { Phase1SelectionForm } from './selectionform';
import { Phase2FormFields } from './formfields';
import { Phase3PreviewPDF } from './previewpdf';
import { RootState } from '@/redux/store';

interface SRF1FormContainerProps {
  onComplete?: () => void;
}

const SRF1FormContainer: React.FC<SRF1FormContainerProps> = ({ onComplete }) => {
  const dispatch = useDispatch();
  const { step } = useSelector((state: RootState) => state.accountOpening);

  useEffect(() => {
    // Reset form on mount
    return () => {
      // Cleanup if needed
    };
  }, []);

  const handlePhase1Next = () => {
    // Transition handled by Phase1SelectionForm via dispatch
  };

  const handlePhase2Next = () => {
    // Transition handled by Phase2FormFields via dispatch
  };

  const handlePhase2Back = () => {
    dispatch(setStep(1));
  };

  const handlePhase3Back = () => {
    dispatch(setStep(2));
  };

  const handleComplete = () => {
    dispatch(resetAccountOpeningState());
    onComplete?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {step === 1 && <Phase1SelectionForm onNext={handlePhase1Next} />}
      {step === 2 && (
        <Phase2FormFields onNext={handlePhase2Next} onBack={handlePhase2Back} />
      )}
      {step === 3 && (
        <Phase3PreviewPDF onBack={handlePhase3Back} onComplete={handleComplete} />
      )}
    </div>
  );
};

export default function Page() {
  return <SRF1FormContainer />;
}