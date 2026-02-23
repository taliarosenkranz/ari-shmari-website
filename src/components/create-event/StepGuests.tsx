import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, AlertCircle, CheckCircle2, Download } from "lucide-react";
import { parseCSV, validatePhone } from './csvUtils';

export default function StepGuests({ data, onUpdate, onNext, onBack }) {
    const [guests, setGuests] = useState(data.guests || []);
    const [error, setError] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            setError('');
            
            // Read file content
            const text = await file.text();
            
            // Parse CSV content
            const parsedGuests = parseCSV(text);
            setGuests(parsedGuests);
            onUpdate({ guests: parsedGuests });
        } catch (err) {
            setError('Failed to parse CSV. Please ensure it is formatted correctly.');
            console.error(err);
        }
    };

    const updateGuest = (index, field, value) => {
        const newGuests = [...guests];
        newGuests[index] = { ...newGuests[index], [field]: value };
        setGuests(newGuests);
        onUpdate({ guests: newGuests });
    };

    const removeGuest = (index) => {
        const newGuests = guests.filter((_, i) => i !== index);
        setGuests(newGuests);
        onUpdate({ guests: newGuests });
    };

    const stats = useMemo(() => {
        const total = guests.length;
        const valid = guests.filter(g => g.name && validatePhone(g.phone_number)).length;
        const invalid = total - valid;
        return { total, valid, invalid };
    }, [guests]);

    const isValid = stats.total > 0 && stats.invalid === 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Guest List</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                        const csvContent = "Name,Phone Number,Messaging Preference\nJohn Doe,+15551234567,sms";
                        const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "template.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}>
                        <Download className="w-4 h-4 mr-2" />
                        Template
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {!guests.length ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors relative">
                        <input 
                            type="file" 
                            accept=".csv,.xlsx" 
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-3">
                            <Upload className="w-10 h-10 text-slate-400" />
                            <h3 className="font-medium text-slate-900">Upload Guest List</h3>
                            <p className="text-sm text-slate-500">Drag & drop or click to upload CSV</p>
                            <p className="text-xs text-slate-400">Required columns: Name, Phone Number</p>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg text-sm">
                            <div className="flex gap-4">
                                <span className="font-medium text-slate-700">Total: {stats.total}</span>
                                <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Valid: {stats.valid}</span>
                                {stats.invalid > 0 && (
                                    <span className="text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Invalid: {stats.invalid}</span>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setGuests([])} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                Clear List
                            </Button>
                        </div>

                        <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone Number (E.164)</TableHead>
                                        <TableHead>Preference</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guests.map((guest, index) => {
                                        const isPhoneValid = validatePhone(guest.phone_number);
                                        const isNameValid = !!guest.name;
                                        
                                        return (
                                            <TableRow key={index} className={(!isPhoneValid || !isNameValid) ? "bg-red-50" : ""}>
                                                <TableCell>
                                                    <Input 
                                                        value={guest.name || ''} 
                                                        onChange={(e) => updateGuest(index, 'name', e.target.value)}
                                                        className={!isNameValid ? "border-red-500" : "border-transparent hover:border-slate-200 focus:border-emerald-500"}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        value={guest.phone_number || ''} 
                                                        onChange={(e) => updateGuest(index, 'phone_number', e.target.value)}
                                                        className={!isPhoneValid ? "border-red-500" : "border-transparent hover:border-slate-200 focus:border-emerald-500"}
                                                    />
                                                    {!isPhoneValid && <span className="text-[10px] text-red-500">Must be E.164 (e.g. +1...)</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <Select 
                                                        value={guest.messaging_preference} 
                                                        onValueChange={(val) => updateGuest(index, 'messaging_preference', val)}
                                                    >
                                                        <SelectTrigger className="h-8 w-[120px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="sms">SMS</SelectItem>
                                                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => removeGuest(index)}
                                                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={onBack}>Back</Button>
                    <Button 
                        onClick={onNext} 
                        disabled={!isValid}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        Next Step
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}