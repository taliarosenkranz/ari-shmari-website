import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { createPageUrl } from '@/lib/pageUtils';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Calendar as CalendarIcon, MapPin, Loader2 } from "lucide-react";
import { format } from 'date-fns';
import KPIGrid from '@/components/dashboard/KPIGrid';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import TimelineStrip from '@/components/dashboard/TimelineStrip';
import GuestTable from '@/components/dashboard/GuestTable';
import MessagesAttention from '@/components/dashboard/MessagesAttention';

export default function EventDashboard() {
    // useLocation() from wouter only returns pathname, not query string
    // Use window.location.search to get query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const eventId = searchParams.get('id');

    const { data: event, isLoading: isEventLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => api.events.get(eventId!),
        enabled: !!eventId
    });

    const { data: guests = [], isLoading: isGuestsLoading, refetch: refetchGuests } = useQuery({
        queryKey: ['guests', eventId],
        queryFn: () => api.guests.list(eventId!),
        enabled: !!eventId
    });

    const { data: eventStatus, isLoading: isStatusLoading } = useQuery({
        queryKey: ['eventStatus', eventId],
        queryFn: () => api.eventStatus.get(eventId!),
        enabled: !!eventId
    });

    const isLoading = isEventLoading || isGuestsLoading || isStatusLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!event) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <p className="text-slate-500">Event not found.</p>
                <Link to={createPageUrl('Events')}>
                    <Button>Go to Events</Button>
                </Link>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 pb-20">
            {/* Dashboard Header */}
            <div className="bg-white border-b border-slate-200 py-8 px-4 lg:px-8 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link to={createPageUrl('Events')} className="hover:text-slate-800 flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" /> Back to Events
                        </Link>
                        <span>/</span>
                        <span className="truncate">{event.name}</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">{event.name}</h1>
                        <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
                            <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {event.date ? format(new Date(event.date), 'PPP p') : 'Date TBD'}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.venue || 'Venue TBD'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
                {/* KPI Cards */}
                <KPIGrid guests={guests} eventStatus={eventStatus} />

                {/* Timeline */}
                <TimelineStrip event={event} eventStatus={eventStatus} />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Column (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Messages Needing Attention - Prominent placement */}
                        {eventId && <MessagesAttention eventId={eventId} />}
                        
                        {/* Charts */}
                        <div className="h-80">
                             <DashboardCharts guests={guests} />
                        </div>
                        
                        {/* Guest Table */}
                        <GuestTable guests={guests} onRefresh={refetchGuests} eventId={eventId} />
                    </div>

                    {/* Side Column (Right 1/3) */}
                    <div className="space-y-8">
                        {/* Event Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Event Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <span className="text-sm text-slate-500">Invitations</span>
                                    <Badge variant={eventStatus?.invitations_sent_out ? "default" : "secondary"}>
                                        {eventStatus?.invitations_sent_out ? "Sent" : "Draft"}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <span className="text-sm text-slate-500">RSVP Reminders</span>
                                    <span className="text-sm font-medium">
                                        Stage {eventStatus?.rsvp_reminder_stage || 0}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Next Scheduled Action</p>
                                    <p className="text-sm font-medium text-slate-700">
                                        {eventStatus?.rsvp_reminder_date 
                                            ? `Send Reminders on ${format(new Date(eventStatus.rsvp_reminder_date), 'MMM d')}` 
                                            : 'No reminders scheduled'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            </div>
        </DashboardLayout>
    );
}