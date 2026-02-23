import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { format } from 'date-fns';

export default function TimelineStrip({ event, eventStatus }) {
    if (!event || !eventStatus) return null;

    const steps = [
        {
            id: 'invite',
            label: 'Invitations Sent',
            date: eventStatus.invitation_send_date,
            icon: Send,
            completed: eventStatus.invitations_sent_out,
            color: 'text-blue-500',
            bg: 'bg-blue-100'
        },
        {
            id: 'reminder',
            label: 'RSVP Reminder',
            date: eventStatus.rsvp_reminder_date,
            icon: MessageSquare,
            completed: eventStatus.rsvp_reminder_stage > 0,
            color: 'text-purple-500',
            bg: 'bg-purple-100'
        },
        {
            id: 'event',
            label: 'Event Day',
            date: event.date,
            icon: Calendar,
            completed: new Date(event.date) < new Date(),
            color: 'text-emerald-500',
            bg: 'bg-emerald-100'
        }
    ];

    return (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-slate-100 -z-0" />
                    
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${step.completed ? step.bg : 'bg-slate-100'}`}>
                                    <Icon className={`w-5 h-5 ${step.completed ? step.color : 'text-slate-400'}`} />
                                </div>
                                <div className="text-left md:text-center">
                                    <p className={`font-medium text-sm ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {step.label}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {step.date ? format(new Date(step.date), 'MMM d, h:mm a') : 'Not scheduled'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}