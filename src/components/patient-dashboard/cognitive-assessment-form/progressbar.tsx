'use client'

export default function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
    return (
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
          <div
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Start</span>
          <span>Complete</span>
        </div>
      </div>
    )
  }
  
  