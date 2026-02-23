import { useState, useEffect } from "react";
import { CheckCheck } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isAri: boolean;
  delay: number;
}

const messages: Message[] = [
  { id: 1, text: "Hi! You're invited to Sarah & Mike's Wedding on June 15th! 💍", isAri: true, delay: 500 },
  { id: 2, text: "Can you please confirm your attendance?", isAri: true, delay: 1500 },
  { id: 3, text: "Yes, I'll be there! 🎉", isAri: false, delay: 2500 },
  { id: 4, text: "Great! You're confirmed as attending. We can't wait to see you! ✨", isAri: true, delay: 3500 },
  { id: 5, text: "What's the dress code?", isAri: false, delay: 5000 },
  { id: 6, text: "It's formal — think black tie or cocktail chic 👗🎩", isAri: true, delay: 6000 },
];

export default function WhatsAppChat() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

  useEffect(() => {
    messages.forEach((message) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, message.id]);
      }, message.delay);
    });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-[#0a1014] rounded-3xl shadow-2xl overflow-hidden border border-border/20">
      <div className="bg-primary px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold">
          A
        </div>
        <div>
          <h3 className="text-primary-foreground font-semibold text-sm">ARI</h3>
          <p className="text-primary-foreground/80 text-xs">Online</p>
        </div>
      </div>

      <div className="bg-[#0a1014] p-4 space-y-3 min-h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isAri ? "justify-start" : "justify-end"} ${
              visibleMessages.includes(message.id) ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : "opacity-0"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                message.isAri
                  ? "bg-primary text-primary-foreground rounded-tl-sm"
                  : "bg-muted text-muted-foreground rounded-tr-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              {visibleMessages.includes(message.id) && (
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs opacity-60">12:34</span>
                  {!message.isAri && <CheckCheck className="w-3 h-3 opacity-60" />}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
