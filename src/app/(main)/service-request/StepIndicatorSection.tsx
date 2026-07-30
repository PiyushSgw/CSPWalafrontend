'use client'
import React from 'react'
import { Check } from 'lucide-react'

interface Step {
  id: number
  label: string
  key: string
}

const STEPS: Step[] = [
  { id: 1, label: 'Select Bank', key: 'bank' },
  { id: 2, label: 'Select Services', key: 'service' },
  { id: 3, label: 'Select Customer', key: 'customer' },
  { id: 4, label: 'Fill Form', key: 'form' },
  { id: 5, label: 'Done', key: 'done' },
]

interface Props {
  activeStep: string
  onStepClick?: (step: number) => void
}

export function StepIndicatorSection({ activeStep, onStepClick }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === activeStep)
  const activeIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-4">
      <div className="flex items-center justify-between max-w-3xl mx-auto overflow-x-auto gap-1">
        {STEPS.map((step, i) => {
          const isCompleted = i < activeIndex
          const isActive = i === activeIndex
          const isClickable = isCompleted

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCompleted
                      ? 'bg-[#0d8f72] text-white cursor-pointer hover:bg-[#0b7a62]'
                      : isActive
                      ? 'bg-[#0f2744] text-white ring-4 ring-[#e6f7f3]'
                      : 'bg-[#f3f4f6] text-[#9ca3af]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </button>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    isActive ? 'text-[#0d8f72]' : isCompleted ? 'text-[#0d8f72]' : 'text-[#9ca3af]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    i < activeIndex ? 'bg-[#0d8f72]' : 'bg-[#e5e7eb]'
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
