import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Bell, MessageSquare, CheckCircle2, ImageIcon, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StepSchedulingProps {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepScheduling({ data, onUpdate, onNext, onBack }: StepSchedulingProps) {
    // RSVP-only mode is set in Step 1 (Basic Info)
    const skipInvitations = data.skip_invitations ?? false;
    const [invitationSendDate, setInvitationSendDate] = useState(data.invitation_send_date || '');
    const [reminderCount, setReminderCount] = useState(data.rsvp_reminder_count || 1);
    const [reminderDate1, setReminderDate1] = useState(data.rsvp_reminder_date_1 || '');
    const [reminderDate2, setReminderDate2] = useState(data.rsvp_reminder_date_2 || '');
    const [reminderDate3, setReminderDate3] = useState(data.rsvp_reminder_date_3 || '');
    const [sameMessageForAll, setSameMessageForAll] = useState(data.rsvp_same_message_for_all ?? true);
    const [defaultMessage, setDefaultMessage] = useState(
        data.rsvp_reminder_message_default || 
        "Hi! Just a friendly reminder to RSVP. Please reply:\n1️⃣ Coming\n2️⃣ Not Coming\n3️⃣ Ask Me Later"
    );
    const [message1, setMessage1] = useState(data.rsvp_reminder_message_1 || '');
    const [message2, setMessage2] = useState(data.rsvp_reminder_message_2 || '');
    const [message3, setMessage3] = useState(data.rsvp_reminder_message_3 || '');

    // Validation - invitation date only required if not skipping invitations
    const isValid = (skipInvitations || invitationSendDate) && reminderDate1 && 
        (sameMessageForAll ? defaultMessage : message1) &&
        (reminderCount < 2 || reminderDate2) &&
        (reminderCount < 3 || reminderDate3) &&
        (!sameMessageForAll ? (reminderCount < 2 || message2) && (reminderCount < 3 || message3) : true);

    // Get messages for preview
    const getPreviewMessages = () => {
        if (sameMessageForAll) {
            return [{ message: defaultMessage, label: `All ${reminderCount} reminder(s)`, time: '10:00 AM' }];
        }
        const messages = [];
        if (message1) messages.push({ message: message1, label: '1st Reminder', time: '10:00 AM' });
        if (reminderCount >= 2 && message2) messages.push({ message: message2, label: '2nd Reminder', time: '2:15 PM' });
        if (reminderCount >= 3 && message3) messages.push({ message: message3, label: '3rd Reminder', time: '6:30 PM' });
        return messages;
    };

    const handleNext = () => {
        onUpdate({
            skip_invitations: skipInvitations,
            invitation_send_date: skipInvitations ? null : invitationSendDate,
            rsvp_reminder_count: reminderCount,
            rsvp_reminder_date_1: reminderDate1,
            rsvp_reminder_date_2: reminderDate2,
            rsvp_reminder_date_3: reminderDate3,
            rsvp_same_message_for_all: sameMessageForAll,
            rsvp_reminder_message_default: defaultMessage,
            rsvp_reminder_message_1: message1,
            rsvp_reminder_message_2: message2,
            rsvp_reminder_message_3: message3,
        });
        onNext();
    };

    return (
        <div className="space-y-6">
            {/* RSVP-Only Mode Indicator */}
            {skipInvitations && (
                <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <div>
                                <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300 mb-1">
                                    RSVP-Only Mode Active
                                </Badge>
                                <p className="text-sm text-emerald-800">
                                    Invitations were already sent. ARI will only send RSVP reminder messages.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Invitation Send Date - Only show if not skipping invitations */}
            {!skipInvitations && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-500" />
                            Invitation Scheduling
                        </CardTitle>
                        <CardDescription>When should guests receive their invitations?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="invitation_send_date">Send Invitations On *</Label>
                            <Input 
                                type="date" 
                                id="invitation_send_date" 
                                value={invitationSendDate}
                                onChange={(e) => setInvitationSendDate(e.target.value)}
                            />
                            <p className="text-xs text-slate-500">
                                Invitations will be sent automatically on this date at 10:00 AM
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* RSVP Reminders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-emerald-500" />
                        RSVP Reminders
                    </CardTitle>
                    <CardDescription>
                        Automatically remind guests who haven't responded
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Number of Reminders */}
                    <div className="space-y-2">
                        <Label>How many reminder rounds?</Label>
                        <Select 
                            value={reminderCount.toString()} 
                            onValueChange={(val) => setReminderCount(parseInt(val))}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 Reminder</SelectItem>
                                <SelectItem value="2">2 Reminders</SelectItem>
                                <SelectItem value="3">3 Reminders</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                            Guests who already confirmed won't receive reminders
                        </p>
                    </div>

                    {/* Reminder Dates */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reminder_date_1">1st Reminder Date *</Label>
                            <Input 
                                type="date" 
                                id="reminder_date_1" 
                                value={reminderDate1}
                                onChange={(e) => setReminderDate1(e.target.value)}
                            />
                        </div>

                        {reminderCount >= 2 && (
                            <div className="space-y-2">
                                <Label htmlFor="reminder_date_2">2nd Reminder Date *</Label>
                                <Input 
                                    type="date" 
                                    id="reminder_date_2" 
                                    value={reminderDate2}
                                    onChange={(e) => setReminderDate2(e.target.value)}
                                />
                            </div>
                        )}

                        {reminderCount >= 3 && (
                            <div className="space-y-2">
                                <Label htmlFor="reminder_date_3">3rd Reminder Date *</Label>
                                <Input 
                                    type="date" 
                                    id="reminder_date_3" 
                                    value={reminderDate3}
                                    onChange={(e) => setReminderDate3(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Reminder Messages */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-emerald-500" />
                            Reminder Messages
                        </CardTitle>
                        <CardDescription>
                            Customize what guests receive in their reminder
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Toggle for same message */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <Label className="text-base">Use same message for all reminders</Label>
                                <p className="text-sm text-slate-500">
                                    {sameMessageForAll 
                                        ? "All reminders will use the same text" 
                                        : "Write a different message for each reminder"}
                                </p>
                            </div>
                            <Switch 
                                checked={sameMessageForAll}
                                onCheckedChange={setSameMessageForAll}
                            />
                        </div>

                        {/* Message Input(s) */}
                        {sameMessageForAll ? (
                            <div className="space-y-2">
                                <Label>Reminder Message *</Label>
                                <Textarea 
                                    value={defaultMessage}
                                    onChange={(e) => setDefaultMessage(e.target.value)}
                                    placeholder="Enter your reminder message..."
                                    className="min-h-[120px]"
                                />
                                <p className="text-xs text-slate-500">
                                    This message will be sent for all {reminderCount} reminder(s)
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>1st Reminder Message *</Label>
                                    <Textarea 
                                        value={message1}
                                        onChange={(e) => setMessage1(e.target.value)}
                                        placeholder="First reminder message..."
                                        className="min-h-[100px]"
                                    />
                                </div>

                                {reminderCount >= 2 && (
                                    <div className="space-y-2">
                                        <Label>2nd Reminder Message *</Label>
                                        <Textarea 
                                            value={message2}
                                            onChange={(e) => setMessage2(e.target.value)}
                                            placeholder="Second reminder message (can be more urgent)..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                )}

                                {reminderCount >= 3 && (
                                    <div className="space-y-2">
                                        <Label>3rd Reminder Message *</Label>
                                        <Textarea 
                                            value={message3}
                                            onChange={(e) => setMessage3(e.target.value)}
                                            placeholder="Final reminder message..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* iPhone Message Preview */}
                <div className="flex justify-center">
                    <div className="w-[300px] h-[600px] bg-white border-8 border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col">
                        {/* Phone header */}
                        <div className="bg-slate-100 p-4 border-b text-center text-xs font-medium text-slate-500">
                            RSVP Reminder Preview
                        </div>
                        
                        {/* Messages area */}
                        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
                            {getPreviewMessages().map((item, index) => (
                                <div key={index}>
                                    {/* Message label */}
                                    <div className="text-center mb-2">
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                            {item.label}
                                        </span>
                                    </div>
                                    {/* Message bubble */}
                                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                                        <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                            {item.message || '(Enter your message above)'}
                                        </p>
                                        <span className="text-[10px] text-slate-400 mt-1 block text-right">
                                            {item.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Same message indicator */}
                            {sameMessageForAll && reminderCount > 1 && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-xs text-blue-800 text-center">
                                        This message will be sent {reminderCount} times on your scheduled dates
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Mock input area */}
                        <div className="p-3 bg-white border-t flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                <ImageIcon className="w-3 h-3 text-emerald-600" />
                            </div>
                            <div className="h-8 bg-slate-100 rounded-full flex-1" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Preview */}
            {((skipInvitations || invitationSendDate) && reminderDate1 && data.date) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Event Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 py-4">
                            {/* Connecting Line */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2" />
                            
                            {/* Show invitations step only if not skipping */}
                            {!skipInvitations && (
                                <div className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-sm">
                                        <span className="text-emerald-600 font-bold text-xs">1</span>
                                    </div>
                                    <div className="text-left md:text-center">
                                        <p className="font-medium text-sm">Invitations</p>
                                        <p className="text-xs text-slate-500">{new Date(invitationSendDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}

                            <div className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm">
                                    <span className="text-blue-600 font-bold text-xs">{skipInvitations ? '1' : '2'}</span>
                                </div>
                                <div className="text-left md:text-center">
                                    <p className="font-medium text-sm">RSVP Reminder{reminderCount > 1 ? 's' : ''}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(reminderDate1).toLocaleDateString()}
                                        {reminderCount >= 2 && reminderDate2 && `, ${new Date(reminderDate2).toLocaleDateString()}`}
                                        {reminderCount >= 3 && reminderDate3 && `, ${new Date(reminderDate3).toLocaleDateString()}`}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border-4 border-white shadow-sm">
                                    <span className="text-purple-600 font-bold text-xs">{skipInvitations ? '2' : '3'}</span>
                                </div>
                                <div className="text-left md:text-center">
                                    <p className="font-medium text-sm">Event Day</p>
                                    <p className="text-xs text-slate-500">{new Date(data.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                <Button 
                    onClick={handleNext} 
                    disabled={!isValid} 
                    className="bg-emerald-500 hover:bg-emerald-600"
                >
                    Review & Launch
                </Button>
            </div>
        </div>
    );
}
