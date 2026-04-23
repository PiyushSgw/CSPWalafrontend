'use client';
import { Check } from 'lucide-react';

interface Props {
  activeStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { number: 1, title: 'Customer' },
  { number: 2, title: 'Transactions' },
  { number: 3, title: 'Preview' },
  { number: 4, title: 'Confirm & Print' },
];

export const StepIndicatorsSection: React.FC<Props> = ({ activeStep, onStepClick }) => {
  return (
    <div className="flex items-start overflow-x-auto mb-7 px-1">
      {STEPS.map((step, idx) => {
        const isDone      = activeStep > step.number;
        const isActive    = activeStep === step.number;
        const isClickable = step.number < activeStep;

        return (
          <div key={step.number} className="flex flex-col flex-1 last:flex-none">

            {/* ── Top row: circle + connector line ── */}
            <div className="flex items-start">

              <div className="flex flex-col items-center">
                {/* Line ABOVE circle */}
                <div className="w-full h-[2px] invisible" /> {/* spacer to keep alignment */}

                <div
                  className={`flex-shrink-0 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => isClickable && onStepClick(step.number)}
                >
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    text-[12px] font-bold transition-all duration-200
                    ${isDone
                      ? 'border-[#0d8f72] bg-[#0d8f72] text-white'
                      : isActive
                      ? 'border-[#0d8f72] bg-[#e6f7f3] text-[#0d8f72]'
                      : 'border-[#d1d5db] bg-white text-[#6b7280]'
                    }
                  `}>
                    {isDone ? <Check size={13} strokeWidth={3} /> : step.number}
                  </div>
                </div>
              </div>

              {/* Connector line aligned to TOP of circle */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-2 mt-[3px]">
                  <div className={`h-[2px] rounded-full transition-all duration-300 ${
                    activeStep > step.number ? 'bg-[#0d8f72]' : 'bg-[#e5e7eb]'
                  }`} />
                </div>
              )}
            </div>

            {/* ── Label below circle ── */}
            <div
              className={`
                mt-[6px] text-[11px] font-semibold whitespace-nowrap transition-colors
                ${isDone ? 'text-[#374151]' : isActive ? 'text-[#0d8f72]' : 'text-[#6b7280]'}
              `}
            >
              {step.title}
            </div>

          </div>
        );
      })}
    </div>
  );
};