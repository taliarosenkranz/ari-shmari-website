import SolutionStep from "../SolutionStep";
import { Upload } from "lucide-react";

export default function SolutionStepExample() {
  return (
    <SolutionStep
      icon={Upload}
      title="Upload Guest List"
      description="Simply upload your Excel file with names and phone numbers"
      stepNumber={1}
    />
  );
}
