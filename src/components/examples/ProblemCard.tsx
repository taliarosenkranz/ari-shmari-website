import ProblemCard from "../ProblemCard";
import { MessageSquare } from "lucide-react";

export default function ProblemCardExample() {
  return (
    <ProblemCard
      icon={MessageSquare}
      title="Manual Messaging"
      description="Sending hundreds of WhatsApp messages manually"
    />
  );
}
