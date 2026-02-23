import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, HelpCircle } from "lucide-react";

export default function DashboardPreview() {
  const stats = [
    { label: "Total Guests", value: "156", color: "bg-primary" },
    { label: "Confirmed", value: "98", color: "bg-chart-1" },
    { label: "Pending", value: "42", color: "bg-chart-4" },
    { label: "Declined", value: "16", color: "bg-chart-5" },
  ];

  const recentGuests = [
    { name: "Emma Johnson", status: "confirmed", time: "2 min ago" },
    { name: "Michael Chen", status: "pending", time: "15 min ago" },
    { name: "Sarah Williams", status: "confirmed", time: "1 hour ago" },
    { name: "David Brown", status: "declined", time: "2 hours ago" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-chart-1" />;
      case "pending":
        return <Clock className="w-4 h-4 text-chart-4" />;
      case "declined":
        return <XCircle className="w-4 h-4 text-chart-5" />;
      default:
        return <HelpCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
              <div className={`h-2 ${stat.color} rounded-full`} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentGuests.map((guest, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover-elevate"
              data-testid={`guest-${index}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(guest.status)}
                <div>
                  <p className="font-medium text-sm">{guest.name}</p>
                  <p className="text-xs text-muted-foreground">{guest.time}</p>
                </div>
              </div>
              <Badge variant={guest.status === "confirmed" ? "default" : "secondary"}>
                {guest.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
