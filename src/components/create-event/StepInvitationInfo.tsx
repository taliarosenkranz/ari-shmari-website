import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, ImageIcon, Sparkles, Plus, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepInvitationProps {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepInvitation({ data, onUpdate, onNext, onBack }: StepInvitationProps) {
    const [message, setMessage] = useState(data.invitation_message || "You're invited to celebrate with us!");
    const [image, setImage] = useState(data.invitation_image_url);

    const placeholders = [
        { key: '{guest_name}', label: 'Guest Name', example: 'Sarah' },
        { key: '{event_name}', label: 'Event Name', example: data.name || 'Wedding Celebration' },
        { key: '{date}', label: 'Event Date', example: data.date ? new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'January 20, 2026' },
        { key: '{venue}', label: 'Venue', example: data.venue || 'Grand Ballroom' },
        { key: '{start_time}', label: 'Event Start Time', example: data.start_time || '6:00 PM' },
        { key: '{chuppah_start_time}', label: 'Chuppah Start Time', example: data.chuppah_start_time || '7:30 PM' },
    ];

    const insertPlaceholder = (placeholder: string) => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
            const start = textarea.selectionStart || 0;
            const end = textarea.selectionEnd || 0;
            const newMessage = message.substring(0, start) + placeholder + message.substring(end);
            setMessage(newMessage);
            // Focus back on textarea and set cursor position
            setTimeout(() => {
                textarea.focus();
                const newPosition = start + placeholder.length;
                textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
        } else {
            setMessage(message + placeholder);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // For now, use local preview (TODO: implement Supabase storage upload)
        const objectUrl = URL.createObjectURL(file);
        setImage(objectUrl);
        onUpdate({ invitation_image_url: objectUrl });
    };

    const handleNext = () => {
        onUpdate({ invitation_message: message, invitation_image_url: image });
        onNext();
    };

    // Generate preview message with sample values
    const getPreviewMessage = () => {
        return message
            .replace(/{guest_name}/g, 'Sarah')
            .replace(/{event_name}/g, data.name || 'Wedding Celebration')
            .replace(/{date}/g, data.date ? new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'January 20, 2026')
            .replace(/{venue}/g, data.venue || 'Grand Ballroom')
            .replace(/{start_time}/g, data.start_time || '6:00 PM')
            .replace(/{chuppah_start_time}/g, data.chuppah_start_time || '7:30 PM');
    };

    return (
        <div className="space-y-6">
            {/* Info alert for users who already sent invitations */}
            <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    <strong>Already sent invitations?</strong> This step is optional. You can skip to the next step and choose "RSVP Only" mode in Scheduling. However, adding event details here helps ARI answer guest questions more accurately.
                </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Invitation Content</CardTitle>
                        <CardDescription>Customize your invitation message for guests</CardDescription>
                    </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="invitation-message">Invitation Message</Label>
                            <Badge variant="outline" className="text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Personalize with placeholders
                            </Badge>
                        </div>
                        <Textarea 
                            id="invitation-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="You're invited to celebrate with us! {guest_name}, join us for {event_name} on {date} at {venue}."
                            className="min-h-[150px] font-mono text-sm"
                        />
                        
                        {/* Placeholder buttons */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-slate-600">Click to insert:</p>
                            <div className="flex flex-wrap gap-2">
                                {placeholders.map((placeholder) => (
                                    <Button
                                        key={placeholder.key}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => insertPlaceholder(placeholder.key)}
                                        className="h-8 text-xs font-mono hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {placeholder.key}
                                    </Button>
                                ))}
                            </div>
                            <div className="text-xs text-slate-500 space-y-1 pt-2 border-t">
                                <p className="font-medium text-slate-600 mb-1">What each placeholder does:</p>
                                <ul className="space-y-1 ml-4 list-disc">
                                    {placeholders.map((p) => (
                                        <li key={p.key}>
                                            <span className="font-mono font-semibold">{p.key}</span> → "{p.example}"
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Invitation Image</Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-slate-400" />
                                <p className="text-sm font-medium text-slate-700">Click to upload image</p>
                                <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                            </div>
                        </div>
                        {image && (
                            <div className="mt-4 relative rounded-lg overflow-hidden h-40 w-full bg-slate-100">
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => {
                                        setImage('');
                                        onUpdate({ invitation_image_url: '' });
                                    }}
                                >
                                    <span className="sr-only">Remove</span>
                                    ×
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={onBack}>Back</Button>
                        <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600">Next Step</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            <div className="flex justify-center">
                <div className="w-[300px] h-[600px] bg-white border-8 border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col">
                    <div className="bg-slate-100 p-4 border-b text-center text-xs font-medium text-slate-500">
                        Message Preview
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 overflow-y-auto">
                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] mb-4">
                            <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {getPreviewMessage()}
                            </p>
                            {image && (
                                <img src={image} alt="Invitation" className="mt-2 rounded-md w-full" />
                            )}
                            <span className="text-[10px] text-slate-400 mt-1 block text-right">10:42 AM</span>
                        </div>
                        {message.includes('{') && (
                            <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
                                <p className="text-xs text-amber-800">
                                    <strong>💡 Tip:</strong> This preview shows how your message will look to guests. Each placeholder will be replaced with the actual information for that guest.
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
        </div>
    );
}