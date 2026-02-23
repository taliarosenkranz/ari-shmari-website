import { LucideIcon } from "lucide-react";

interface SolutionStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stepNumber: number;
}

export default function SolutionStep({ icon: Icon, title, description, stepNumber }: SolutionStepProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4" data-testid={`step-${stepNumber}`}>
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center hover-elevate transition-all duration-300">
          <Icon className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-background">
          <span className="text-sm font-bold text-accent-foreground">{stepNumber}</span>
        </div>
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}
