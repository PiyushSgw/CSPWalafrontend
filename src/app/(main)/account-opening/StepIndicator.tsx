'use client';

interface Props {
  currentStep: number;
}

const steps = [
  { num: 1, label: 'Bank & Type' },
  { num: 2, label: 'Fill Details' },
  { num: 3, label: 'Confirm Print' },
];

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center mb-7 overflow-x-auto">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center flex-1 min-w-[80px]">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[12px] font-bold transition-all ${
              step.num < currentStep
                ? 'border-teal-600 bg-teal-600 text-white'
                : step.num === currentStep
                ? 'border-teal-600 text-teal-600 bg-teal-50'
                : 'border-gray-300 text-gray-400 bg-white'
            }`}>
              {step.num < currentStep ? '✓' : step.num}
            </div>
            <span className={`text-[11px] font-semibold mt-1.5 whitespace-nowrap ${
              step.num < currentStep ? 'text-gray-600' :
              step.num === currentStep ? 'text-teal-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${
              step.num < currentStep ? 'bg-teal-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}