import { useState } from "react";
import BookDemoModal from "../BookDemoModal";
import { Button } from "@/components/ui/button";

export default function BookDemoModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <BookDemoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
