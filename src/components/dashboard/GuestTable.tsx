import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download, Search, RefreshCcw, Filter, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { Guest } from '@/lib/supabase';
import { guests as guestsApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

interface GuestTableProps {
    guests: Guest[];
    onRefresh: () => void;
    eventId: string | null;
}

export default function GuestTable({ guests, onRefresh, eventId }: GuestTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [channelFilter, setChannelFilter] = useState('all');
    const [updatingGuestId, setUpdatingGuestId] = useState<number | null>(null);
    
    // Add Guest Dialog state
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newGuest, setNewGuest] = useState({
        name: '',
        phone_number: '',
        messaging_preference: 'whatsapp' as 'whatsapp' | 'sms',
        rsvp_status: 'pending' as 'pending' | 'confirmed' | 'declined'
    });

    // Mutation for updating guest status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ guestId, status }: { guestId: number; status: string }) => {
            return guestsApi.update(String(guestId), { rsvp_status: status as 'pending' | 'confirmed' | 'declined' });
        },
        onSuccess: () => {
            onRefresh();
            setUpdatingGuestId(null);
        },
        onError: (error) => {
            console.error('Error updating guest status:', error);
            setUpdatingGuestId(null);
        }
    });

    const handleStatusChange = (guestId: number, newStatus: string) => {
        setUpdatingGuestId(guestId);
        updateStatusMutation.mutate({ guestId, status: newStatus });
    };

    // Mutation for creating new guest
    const createGuestMutation = useMutation({
        mutationFn: async (guestData: Partial<Guest>) => {
            return guestsApi.create(guestData);
        },
        onSuccess: () => {
            onRefresh();
            setIsAddDialogOpen(false);
            // Reset form
            setNewGuest({
                name: '',
                phone_number: '',
                messaging_preference: 'whatsapp',
                rsvp_status: 'pending'
            });
        },
        onError: (error: any) => {
            console.error('Error creating guest:', error);
            alert(error?.message || 'Failed to add guest. Please try again.');
        }
    });

    const handleAddGuest = () => {
        // Basic validation
        if (!newGuest.name.trim()) {
            alert('Please enter the guest name');
            return;
        }
        if (!newGuest.phone_number.trim()) {
            alert('Please enter the phone number');
            return;
        }
        // Phone number validation (basic)
        if (!newGuest.phone_number.startsWith('+')) {
            alert('Phone number must include country code (e.g., +1234567890)');
            return;
        }
        if (!eventId) {
            alert('Unable to determine event. Please refresh and try again.');
            return;
        }
        
        createGuestMutation.mutate({
            ...newGuest,
            event_id: Number(eventId),
            invitation_received: false
        });
    };

    // Filter Logic
    const filteredGuests = guests.filter((guest: Guest) => {
        const matchesSearch = 
            guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            guest.phone_number.includes(searchTerm);
        
        // Handle status filtering - treat null/empty as pending
        let matchesStatus = false;
        if (statusFilter === 'all') {
            matchesStatus = true;
        } else if (statusFilter === 'pending') {
            matchesStatus = !guest.rsvp_status || guest.rsvp_status === 'pending';
        } else {
            matchesStatus = guest.rsvp_status === statusFilter;
        }
        
        const matchesChannel = channelFilter === 'all' || guest.messaging_preference === channelFilter;
        
        return matchesSearch && matchesStatus && matchesChannel;
    });

    const exportCSV = () => {
        const headers = ['Name', 'Phone', 'Preference', 'Invitation Sent', 'RSVP Status', 'Last Updated'];
        const csvContent = [
            headers.join(','),
            ...filteredGuests.map((g: Guest) => [
                g.name,
                g.phone_number,
                g.messaging_preference,
                g.invitation_received ? 'Yes' : 'No',
                g.rsvp_status,
                g.updated_date || ''
            ].join(','))
        ].join('\n');

        const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "guest_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string | undefined | null) => {
        switch(status) {
            case 'confirmed':
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Confirmed</Badge>;
            case 'declined':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Declined</Badge>;
            default:
                return <Badge variant="outline" className="text-amber-600 border-amber-200">Pending</Badge>;
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-lg">Guest List</CardTitle>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search guests..."
                            className="pl-9 h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    
                    {/* Add Guest Dialog */}
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Guest
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Guest</DialogTitle>
                                <DialogDescription>
                                    Add a guest to your event. Fill in their details below.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Name Field */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={newGuest.name}
                                        onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                                    />
                                </div>
                                
                                {/* Phone Number Field */}
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1234567890"
                                        value={newGuest.phone_number}
                                        onChange={(e) => setNewGuest({ ...newGuest, phone_number: e.target.value })}
                                    />
                                    <p className="text-xs text-slate-500">Include country code (e.g., +1 for US, +972 for Israel)</p>
                                </div>
                                
                                {/* Messaging Preference Field */}
                                <div className="grid gap-2">
                                    <Label>Messaging Preference</Label>
                                    <Select
                                        value={newGuest.messaging_preference}
                                        onValueChange={(value: 'whatsapp' | 'sms') => 
                                            setNewGuest({ ...newGuest, messaging_preference: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                            <SelectItem value="sms">SMS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {/* RSVP Status Field */}
                                <div className="grid gap-2">
                                    <Label>RSVP Status</Label>
                                    <Select
                                        value={newGuest.rsvp_status}
                                        onValueChange={(value: 'pending' | 'confirmed' | 'declined') => 
                                            setNewGuest({ ...newGuest, rsvp_status: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-amber-600 border-amber-200">Pending</Badge>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="confirmed">
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-emerald-100 text-emerald-700">Confirmed</Badge>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="declined">
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-red-100 text-red-700">Declined</Badge>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-slate-500">
                                        Select "Confirmed" if the guest has already RSVP'd
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                    disabled={createGuestMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddGuest}
                                    disabled={createGuestMutation.isPending}
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                >
                                    {createGuestMutation.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Guest'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                     <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3 h-3" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={channelFilter} onValueChange={setChannelFilter}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue placeholder="Channel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Channels</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Channel</TableHead>
                                <TableHead className="hidden sm:table-cell">Invited</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredGuests.length > 0 ? (
                                filteredGuests.map((guest: Guest) => (
                                    <TableRow key={guest.guest_id}>
                                        <TableCell>
                                            <div className="font-medium">{guest.name}</div>
                                            <div className="text-xs text-slate-500">{guest.phone_number}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={guest.rsvp_status || 'pending'}
                                                onValueChange={(value) => handleStatusChange(guest.guest_id, value)}
                                                disabled={updatingGuestId === guest.guest_id}
                                            >
                                                <SelectTrigger className="h-7 w-[120px] border-0 bg-transparent p-0 focus:ring-0">
                                                    {updatingGuestId === guest.guest_id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <SelectValue>
                                                            {getStatusBadge(guest.rsvp_status)}
                                                        </SelectValue>
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">
                                                        <Badge variant="outline" className="text-amber-600 border-amber-200">Pending</Badge>
                                                    </SelectItem>
                                                    <SelectItem value="confirmed">
                                                        <Badge className="bg-emerald-100 text-emerald-700">Confirmed</Badge>
                                                    </SelectItem>
                                                    <SelectItem value="declined">
                                                        <Badge className="bg-red-100 text-red-700">Declined</Badge>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell capitalize text-sm">
                                            {guest.messaging_preference}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {guest.invitation_received || guest.invitation_sent ? (
                                                <span className="text-emerald-600 text-xs flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Sent
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">Draft</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                        No guests found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 text-xs text-slate-500 text-center">
                    Showing {filteredGuests.length} of {guests.length} guests
                </div>
            </CardContent>
        </Card>
    );
}