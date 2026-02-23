import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { createPageUrl } from '@/lib/pageUtils';
import { api } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, Loader2 } from "lucide-react";
import { format, isPast, isToday, parseISO } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";

function getEventStatus(eventDate: string | null) {
    if (!eventDate) return { label: 'No Date', className: 'bg-slate-100 text-slate-600' };
    
    const date = parseISO(eventDate);
    
    if (isToday(date)) {
        return { label: 'Today', className: 'bg-amber-100 text-amber-700' };
    }
    if (isPast(date)) {
        return { label: 'Past', className: 'bg-slate-100 text-slate-600' };
    }
    return { label: 'Upcoming', className: 'bg-emerald-50 text-emerald-700' };
}

export default function Events() {
    const { data: events, isLoading, error } = useQuery({
        queryKey: ['events'],
        queryFn: () => api.events.list({ sort: { created_at: -1 } }),
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            </DashboardLayout>
        );
    }

    // Handle errors (like RLS not configured)
    if (error) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Calendar className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">Unable to load events</h3>
                        <p className="text-slate-500 mb-6">Database permissions may need to be configured.</p>
                        <Link to={createPageUrl('CreateEvent')}>
                            <Button variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Create Your First Event
                            </Button>
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Your Events</h1>
                    <p className="text-slate-500 mt-1">Manage your upcoming events and guests.</p>
                </div>
                <Link to={createPageUrl('CreateEvent')}>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {events && events.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <Link key={event.event_id} to={`${createPageUrl('EventDashboard')}?id=${event.event_id}`}>
                            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="font-serif text-xl group-hover:text-emerald-600 transition-colors">
                                            {event.name}
                                        </CardTitle>
                                        {(() => {
                                            const status = getEventStatus(event.date);
                                            return (
                                                <Badge variant="secondary" className={status.className}>
                                                    {status.label}
                                                </Badge>
                                            );
                                        })()}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {event.date ? format(new Date(event.date), 'PPP') : 'Date not set'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {event.venue || 'Venue not set'}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Calendar className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No events yet</h3>
                    <p className="text-slate-500 mb-6">Get started by creating your first event.</p>
                    <Link to={createPageUrl('CreateEvent')}>
                        <Button variant="outline" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create Event
                        </Button>
                    </Link>
                </div>
            )}
            </div>
        </DashboardLayout>
    );
}