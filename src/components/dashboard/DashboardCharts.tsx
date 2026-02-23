import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = {
    confirmed: '#10b981', // emerald-500
    declined: '#ef4444',  // red-500
    pending: '#f59e0b'    // amber-500
};

const CHANNEL_COLORS = {
    sms: '#3b82f6',       // blue-500
    whatsapp: '#22c55e'   // green-500
};

export default function DashboardCharts({ guests }) {
    // RSVP Breakdown Data - treat null/empty as pending
    const rsvpData = [
        { name: 'Confirmed', value: guests.filter(g => g.rsvp_status === 'confirmed').length, color: COLORS.confirmed },
        { name: 'Declined', value: guests.filter(g => g.rsvp_status === 'declined').length, color: COLORS.declined },
        { name: 'Pending', value: guests.filter(g => !g.rsvp_status || g.rsvp_status === 'pending').length, color: COLORS.pending },
    ].filter(d => d.value > 0);

    // Channel Split Data
    const channelData = [
        { name: 'SMS', value: guests.filter(g => g.messaging_preference === 'sms').length, fill: CHANNEL_COLORS.sms },
        { name: 'WhatsApp', value: guests.filter(g => g.messaging_preference === 'whatsapp').length, fill: CHANNEL_COLORS.whatsapp },
    ];

    return (
        <div className="grid md:grid-cols-2 gap-4 h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">RSVP Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={rsvpData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {rsvpData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Messaging Channels</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={channelData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}