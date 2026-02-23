import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, MessageSquare, User, Phone, Copy } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Message } from '@/lib/supabase';

interface MessagesAttentionProps {
  eventId: string;
}

export default function MessagesAttention({ eventId }: MessagesAttentionProps) {
  const queryClient = useQueryClient();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log(`${label} copied to clipboard`);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages-attention', eventId],
    queryFn: () => api.messages.getFollowupNeededForEvent(eventId),
    enabled: !!eventId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const resolveMutation = useMutation({
    mutationFn: (messageId: string) => api.messages.resolveMessage(messageId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['messages-attention', eventId] });
    },
  });

  const handleResolve = (messageId: string) => {
    resolveMutation.mutate(messageId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Messages Needing Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-slate-100 rounded"></div>
            <div className="h-20 bg-slate-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Messages Needing Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Unable to load messages.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Messages Needing Attention
          </CardTitle>
          {messages.length > 0 && (
            <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600">
              {messages.length} pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700">All caught up!</p>
            <p className="text-xs text-slate-500 mt-1">No messages need your attention right now.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((msg: Message) => (
              <div
                key={msg.message_id}
                className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
              >
                {/* Guest Info Header */}
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 pb-2 border-b border-amber-200">
                  <User className="w-3 h-3" />
                  <span className="font-medium">{msg.guest_name || 'Unknown Guest'}</span>
                  <button
                    onClick={() => copyToClipboard(msg.guest_name || '', 'Name')}
                    className="hover:bg-slate-200 p-0.5 rounded transition-colors"
                    title="Copy name"
                  >
                    <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                  <span className="text-slate-400">•</span>
                  <Phone className="w-3 h-3" />
                  <span>{msg.guest_phone || 'No phone'}</span>
                  <button
                    onClick={() => copyToClipboard(msg.guest_phone || '', 'Phone')}
                    className="hover:bg-slate-200 p-0.5 rounded transition-colors"
                    title="Copy phone number"
                  >
                    <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>

                {/* Original Message */}
                <div className="mb-3">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-200">
                        "{msg.message}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer with time and action */}
                <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {msg.created_at
                      ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })
                      : 'Recently'}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(msg.message_id)}
                    disabled={resolveMutation.isPending}
                    className="h-7 text-xs bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {resolveMutation.isPending ? 'Resolving...' : 'Mark Resolved'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
