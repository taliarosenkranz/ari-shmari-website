import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Info } from "lucide-react";

const schema = z.object({
    name: z.string().min(2, "Event name is required"),
    date: z.string().min(1, "Date is required"),
    venue: z.string().min(2, "Venue is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().optional(),
    chuppah_start_time: z.string().optional(),
    dress_code: z.string().optional(),
    location_map: z.string().optional(),
    special_notes: z.string().optional(),
});

interface StepBasicInfoProps {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
}

export default function StepBasicInfo({ data, onUpdate, onNext }: StepBasicInfoProps) {
    const [skipInvitations, setSkipInvitations] = useState(data.skip_invitations ?? false);
    
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data.name || '',
            date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '',
            venue: data.venue || '',
            start_time: data.start_time || '',
            end_time: data.end_time || '',
            chuppah_start_time: data.chuppah_start_time || '',
            dress_code: data.dress_code || '',
            location_map: data.location_map || '',
            special_notes: data.special_notes || '',
        },
        mode: 'onChange'
    });

    const handleToggleChange = (checked: boolean) => {
        setSkipInvitations(checked);
        onUpdate({ skip_invitations: checked });
    };

    const onSubmit = (formData: any) => {
        onUpdate({ ...formData, skip_invitations: skipInvitations });
        onNext();
    };

    return (
        <div className="space-y-6">
            {/* RSVP-Only Mode Toggle */}
            <Card className={skipInvitations ? "border-emerald-200 bg-emerald-50/50" : ""}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className={`w-5 h-5 ${skipInvitations ? 'text-emerald-600' : 'text-slate-400'}`} />
                        Already Sent Invitations?
                    </CardTitle>
                    <CardDescription>
                        Choose this if you've already invited your guests through another method
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div>
                            <Label className="text-base font-medium">RSVP-Only Mode</Label>
                            <p className="text-sm text-slate-500 mt-1">
                                {skipInvitations 
                                    ? "ARI will only send RSVP reminders to your guests" 
                                    : "ARI will send both invitations and RSVP reminders"}
                            </p>
                        </div>
                        <Switch 
                            checked={skipInvitations}
                            onCheckedChange={handleToggleChange}
                        />
                    </div>
                    {skipInvitations && (
                        <div className="mt-3 p-3 bg-emerald-100 rounded-lg">
                            <p className="text-sm text-emerald-800">
                                <strong>RSVP-Only Mode enabled:</strong> The invitation setup step will be skipped. Your guests will receive RSVP reminder messages on the dates you specify later.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info alert about optional details */}
            <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    <strong>Tip:</strong> Adding optional details (dress code, map link, special notes) helps ARI answer your guests' questions more accurately.
                </AlertDescription>
            </Alert>

            <Card>
            <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Tell us about your event</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Required Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Event Name *</Label>
                            <Input 
                                id="name" 
                                {...register('name')} 
                                placeholder="e.g. Sarah & David's Wedding" 
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Event Date *</Label>
                            <Input type="date" id="date" {...register('date')} />
                            {errors.date && <p className="text-sm text-red-500">{errors.date.message as string}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="venue">Venue *</Label>
                        <Input 
                            id="venue" 
                            {...register('venue')} 
                            placeholder="e.g. Grand Hotel Ballroom, Tel Aviv" 
                        />
                        {errors.venue && <p className="text-sm text-red-500">{errors.venue.message as string}</p>}
                    </div>

                    {/* Time Fields */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="start_time">Start Time *</Label>
                            <Input type="time" id="start_time" {...register('start_time')} />
                            <p className="text-xs text-slate-500">24-hour format (e.g., 18:00 for 6 PM)</p>
                            {errors.start_time && <p className="text-sm text-red-500">{errors.start_time.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="chuppah_start_time">Chuppah/Ceremony Time</Label>
                            <Input type="time" id="chuppah_start_time" {...register('chuppah_start_time')} />
                            <p className="text-xs text-slate-500">24-hour format (optional)</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_time">End Time</Label>
                            <Input type="time" id="end_time" {...register('end_time')} />
                            <p className="text-xs text-slate-500">24-hour format (optional)</p>
                        </div>
                    </div>

                    {/* Optional Fields */}
                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">Additional Details (Optional)</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="dress_code">Dress Code</Label>
                                <Input 
                                    id="dress_code" 
                                    {...register('dress_code')} 
                                    placeholder="e.g. Formal, Casual, Black Tie" 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location_map">Location Map URL</Label>
                                <Input 
                                    id="location_map" 
                                    {...register('location_map')} 
                                    placeholder="e.g. https://maps.google.com/..." 
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <Label htmlFor="special_notes">Special Notes for Guests</Label>
                            <Textarea 
                                id="special_notes" 
                                {...register('special_notes')} 
                                placeholder="e.g. Parking available on site, Vegetarian options available..."
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={!isValid} className="bg-emerald-500 hover:bg-emerald-600">
                            Next Step
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
        </div>
    );
}
