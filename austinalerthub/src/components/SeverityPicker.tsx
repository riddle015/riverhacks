
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SeverityOption {
  value: string;
  label: string;
  color: string;
  description: string;
}

interface SeverityPickerProps {
  onChange: (value: string) => void;
  value: string;
}

const severityOptions: SeverityOption[] = [
  {
    value: 'low',
    label: 'Low',
    color: 'bg-safety-green',
    description: 'Minimal risk, can be addressed in normal maintenance'
  },
  {
    value: 'medium',
    label: 'Medium',
    color: 'bg-safety-yellow',
    description: 'Moderate risk, should be addressed soon'
  },
  {
    value: 'high',
    label: 'High',
    color: 'bg-safety-red',
    description: 'Significant risk, requires prompt attention'
  }
];

const SeverityPicker: React.FC<SeverityPickerProps> = ({ onChange, value }) => {
  return (
    <div className="space-y-4">
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {severityOptions.map((option) => (
          <div key={option.value} className="relative">
            <RadioGroupItem
              value={option.value}
              id={`severity-${option.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`severity-${option.value}`}
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              )}
            >
              <div className={cn("w-6 h-6 rounded-full mb-2", option.color)} />
              <div className="font-semibold">{option.label}</div>
              <p className="text-xs text-center text-muted-foreground mt-1">
                {option.description}
              </p>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SeverityPicker;
