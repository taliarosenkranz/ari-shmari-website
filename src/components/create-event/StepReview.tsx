import { useState } from 'react';
import { createPageUrl } from '@/lib/pageUtils';
import { api } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MessageSquare, CheckCircle2, Loader2, Bell, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { useLocation } from 'wouter';

interface StepReviewProps {
    data: any;
    onBack: () => void;
}

export default function StepReview({ data, onBack }: StepReviewProps) {
    const [, setLocation] = useLocation();
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchSuccess, setLaunchSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const launchEvent = async () => {
        setIsLaunching(true);
        setErrorMessage(null);
        
        try {
            console.log('🚀 Starting event creation...');
            
            // 1. Create Event
            console.log('📝 Step 1: Creating event...');
            
            const eventPayload = {
                name: data.name,
                date: data.date,
                venue: data.venue,
                start_time: data.start_time,
                end_time: data.end_time || null,
                chuppah_start_time: data.chuppah_start_time || null,
                dress_code: data.dress_code || null,
                location_map: data.location_map || null,
                special_notes: data.special_notes || null,
                invitation_message: data.invitation_message,
                invitation_image_url: data.invitation_image_url || null,
            };
            
            console.log('Event payload:', eventPayload);
            const event = await api.events.create(eventPayload);
            console.log('✅ Event created successfully:', event.event_id);

            // 2. Create Guests (Bulk)
            if (data.guests && data.guests.length > 0) {
                console.log(`👥 Step 2: Creating ${data.guests.length} guests...`);
                
                // If RSVP-only mode, mark guests as already having received invitations
                const guestsPayload = data.guests.map((g: any) => ({
                    name: g.name,
                    phone_number: g.phone_number,
                    messaging_preference: g.messaging_preference || 'sms',
                    event_id: event.event_id,
                    rsvp_status: 'pending' as const,
                    invitation_received: data.skip_invitations ? true : false,
                }));
                
                console.log('Guest payload sample:', guestsPayload[0]);
                
                try {
                    const createdGuests = await api.guests.bulkCreate(guestsPayload);
                    console.log(`✅ Created ${createdGuests.length} guests successfully`);
                } catch (guestError: any) {
                    // Handle duplicate phone number error gracefully
                    if (guestError?.code === '23505') {
                        console.error('⚠️ Duplicate phone number detected:', guestError.details);
                        throw new Error(`A guest with one of these phone numbers already exists in another event. Please check your guest list for duplicates.`);
                    }
                    throw guestError;
                }
            } else {
                console.log('⚠️ No guests to create');
            }

            // 3. Create Event Status
            console.log('📊 Step 3: Creating event status...');
            // If RSVP-only mode, mark invitations as already sent
            const statusPayload = {
                event_id: event.event_id,
                event_name: data.name,
                invitation_send_date: data.skip_invitations ? null : data.invitation_send_date,
                client_confirmation_received: true,
                invitations_sent_out: data.skip_invitations ? true : false,
                guest_list_received: data.guests?.length > 0,
                // RSVP Reminder Settings
                rsvp_reminder_count: data.rsvp_reminder_count,
                rsvp_reminder_date_1: data.rsvp_reminder_date_1,
                rsvp_reminder_date_2: data.rsvp_reminder_date_2 || null,
                rsvp_reminder_date_3: data.rsvp_reminder_date_3 || null,
                rsvp_reminder_stage: 'not started',
                rsvp_same_message_for_all: data.rsvp_same_message_for_all,
                rsvp_reminder_message_default: data.rsvp_reminder_message_default,
                rsvp_reminder_message_1: data.rsvp_reminder_message_1 || null,
                rsvp_reminder_message_2: data.rsvp_reminder_message_2 || null,
                rsvp_reminder_message_3: data.rsvp_reminder_message_3 || null,
                // Stats
                total_guests: data.guests?.length || 0,
                total_confirmed: 0,
                total_pending: data.guests?.length || 0,
                total_declined: 0,
            };
            
            console.log('Status payload:', statusPayload);
            const eventStatus = await api.eventStatus.upsert(statusPayload);
            console.log('✅ Event status created successfully:', eventStatus);

            console.log('🎉 All steps completed successfully!');
            setLaunchSuccess(true);
            
            // Redirect after delay
            setTimeout(() => {
                setLocation(createPageUrl('Events'));
            }, 2000);

        } catch (error: any) {
            console.error("❌ Failed to launch event:", error);
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            });
            
            let errorMsg = "Failed to create event. ";
            if (error.message) {
                errorMsg += error.message;
            }
            if (error.hint) {
                errorMsg += ` Hint: ${error.hint}`;
            }
            
            setErrorMessage(errorMsg);
        } finally {
            setIsLaunching(false);
        }
    };

    if (launchSuccess) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Event Launched!</h2>
                <p className="text-slate-500">Redirecting to your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Review & Launch</h2>
            <p className="text-slate-500">Double check everything before we set it live.</p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Event Details */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-500" />
                            Event Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div>
                            <p className="text-slate-500">Event Name</p>
                            <p className="font-medium">{data.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Date</p>
                            <p className="font-medium">{data.date ? format(new Date(data.date), 'PPP') : '-'}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Time</p>
                            <p className="font-medium">
                                {data.start_time || '-'}
                                {data.end_time && ` - ${data.end_time}`}
                                {data.chuppah_start_time && ` (Chuppah: ${data.chuppah_start_time})`}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-500">Venue</p>
                            <p className="font-medium">{data.venue}</p>
                        </div>
                        {data.dress_code && (
                            <div>
                                <p className="text-slate-500">Dress Code</p>
                                <p className="font-medium">{data.dress_code}</p>
                            </div>
                        )}
                        {data.location_map && (
                            <div>
                                <p className="text-slate-500">Map Link</p>
                                <a href={data.location_map} target="_blank" rel="noopener noreferrer" 
                                   className="font-medium text-emerald-600 hover:underline text-xs break-all">
                                    {data.location_map.substring(0, 40)}...
                                </a>
                            </div>
                        )}
                        {data.special_notes && (
                            <div>
                                <p className="text-slate-500">Special Notes</p>
                                <p className="font-medium text-xs">{data.special_notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Guest Summary */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-500" />
                            Guest List
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-slate-500">Total Guests</span>
                            <span className="font-bold text-lg">{data.guests?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-slate-500">SMS Preference</span>
                            <span className="font-medium">{data.guests?.filter((g: any) => g.messaging_preference === 'sms').length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">WhatsApp Preference</span>
                            <span className="font-medium">{data.guests?.filter((g: any) => g.messaging_preference === 'whatsapp').length || 0}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Invitation - only show if not skipping invitations */}
                {!data.skip_invitations ? (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-emerald-500" />
                                Invitation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="text-slate-500 mb-1">Message</p>
                                <p className="bg-slate-50 p-3 rounded-md italic text-slate-700 border text-xs">
                                    "{data.invitation_message}"
                                </p>
                            </div>
                            {data.invitation_image_url && (
                                <div>
                                    <p className="text-slate-500 mb-1">Image</p>
                                    <img src={data.invitation_image_url} alt="Invitation" className="h-20 rounded-md object-cover" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-emerald-200 bg-emerald-50/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <CheckCheck className="w-5 h-5 text-emerald-600" />
                                RSVP Only Mode
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                                Invitations Already Sent
                            </Badge>
                            <p className="text-slate-600 mt-3">
                                You've indicated that invitations were already sent outside of ARI. 
                                ARI will only send RSVP reminder messages and handle guest responses.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Schedule & Reminders */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Bell className="w-5 h-5 text-emerald-500" />
                            Schedule & Reminders
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {/* Only show invitation date if not skipping */}
                        {!data.skip_invitations && (
                            <div>
                                <p className="text-slate-500">Send Invitations</p>
                                <p className="font-medium">
                                    {data.invitation_send_date ? format(new Date(data.invitation_send_date), 'PPP') : '-'}
                                </p>
                            </div>
                        )}
                        <div className={data.skip_invitations ? "" : "border-t pt-2"}>
                            <p className="text-slate-500">RSVP Reminders ({data.rsvp_reminder_count})</p>
                            <div className="space-y-1 mt-1">
                                <p className="font-medium text-xs">
                                    1st: {data.rsvp_reminder_date_1 ? format(new Date(data.rsvp_reminder_date_1), 'PPP') : '-'}
                                </p>
                                {data.rsvp_reminder_count >= 2 && data.rsvp_reminder_date_2 && (
                                    <p className="font-medium text-xs">
                                        2nd: {format(new Date(data.rsvp_reminder_date_2), 'PPP')}
                                    </p>
                                )}
                                {data.rsvp_reminder_count >= 3 && data.rsvp_reminder_date_3 && (
                                    <p className="font-medium text-xs">
                                        3rd: {format(new Date(data.rsvp_reminder_date_3), 'PPP')}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="border-t pt-2">
                            <p className="text-slate-500">
                                Reminder Message{data.rsvp_same_message_for_all === false ? 's' : ''}
                            </p>
                            {data.rsvp_same_message_for_all === false ? (
                                <div className="space-y-2 mt-1">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">1st Reminder:</p>
                                        <p className="bg-slate-50 p-2 rounded text-xs whitespace-pre-wrap">
                                            {data.rsvp_reminder_message_1 || '(not set)'}
                                        </p>
                                    </div>
                                    {data.rsvp_reminder_count >= 2 && (
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">2nd Reminder:</p>
                                            <p className="bg-slate-50 p-2 rounded text-xs whitespace-pre-wrap">
                                                {data.rsvp_reminder_message_2 || '(not set)'}
                                            </p>
                                        </div>
                                    )}
                                    {data.rsvp_reminder_count >= 3 && (
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">3rd Reminder:</p>
                                            <p className="bg-slate-50 p-2 rounded text-xs whitespace-pre-wrap">
                                                {data.rsvp_reminder_message_3 || '(not set)'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="bg-slate-50 p-2 rounded text-xs mt-1 whitespace-pre-wrap">
                                    {data.rsvp_reminder_message_default || '(not set)'}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">!</span>
                            </div>
                            <div>
                                <p className="font-semibold text-red-900 mb-1">Error Creating Event</p>
                                <p className="text-sm text-red-700">{errorMessage}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-between pt-8">
                <Button variant="outline" onClick={onBack} disabled={isLaunching}>Back</Button>
                <Button 
                    onClick={launchEvent} 
                    disabled={isLaunching}
                    className="bg-emerald-500 hover:bg-emerald-600 h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                    {isLaunching ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Launching Event...
                        </>
                    ) : (
                        "Launch Event"
                    )}
                </Button>
            </div>
        </div>
    );
}
