import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send, CheckCircle2, XCircle, HelpCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface KPIGridProps {
    guests: Array<{
        invitation_received?: boolean;
        rsvp_status?: string;
    }>;
    eventStatus?: {
        invitation_send_date?: string;
        invitations_sent_out?: boolean;
    };
    messagesNeedingAttention?: number;
}

export default function KPIGrid({ guests, eventStatus, messagesNeedingAttention = 0 }: KPIGridProps) {
    const totalGuests = guests.length;
    const invitationsSent = guests.filter(g => g.invitation_received).length;
    const confirmed = guests.filter(g => g.rsvp_status === 'confirmed').length;
    const declined = guests.filter(g => g.rsvp_status === 'declined').length;
    const pending = guests.filter(g => g.rsvp_status === 'pending' || !g.rsvp_status).length;
    
    // Calculate response rate (confirmed + declined out of those who received invitations)
    const responded = confirmed + declined;
    const responseRate = invitationsSent > 0 ? Math.round((responded / invitationsSent) * 100) : 0;
    const acceptanceRate = responded > 0 ? Math.round((confirmed / responded) * 100) : 0;
    
    const sentDate = eventStatus?.invitation_send_date 
        ? new Date(eventStatus.invitation_send_date).toLocaleDateString() 
        : null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Total Invited */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invited</CardTitle>
                    <Users className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalGuests}</div>
                    <p className="text-xs text-slate-500">
                        {invitationsSent} invitations sent
                    </p>
                </CardContent>
            </Card>

            {/* Confirmed */}
            <Card className="border-emerald-200 bg-emerald-50/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700">Confirmed</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-700">{confirmed}</div>
                    <p className="text-xs text-emerald-600">
                        {acceptanceRate}% of responders
                    </p>
                </CardContent>
            </Card>

            {/* Declined */}
            <Card className="border-red-200 bg-red-50/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-700">Declined</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-700">{declined}</div>
                    <p className="text-xs text-red-600">
                        {responded > 0 ? Math.round((declined / responded) * 100) : 0}% of responders
                    </p>
                </CardContent>
            </Card>

            {/* Pending Response */}
            <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-700">Pending</CardTitle>
                    <HelpCircle className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-700">{pending}</div>
                    <p className="text-xs text-amber-600">
                        Awaiting response
                    </p>
                </CardContent>
            </Card>

            {/* Response Rate */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{responseRate}%</div>
                    <Progress value={responseRate} className="h-2 mt-2" />
                </CardContent>
            </Card>
        </div>
    );
}