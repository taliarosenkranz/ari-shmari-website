import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => (window.location.href = (import.meta.env.BASE_URL || "/"))}>
            ← Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy – Ari</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toISOString().split("T")[0]}</p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm leading-relaxed">
            <section>
              <p>
                Ari (“we”, “our”, or “us”) provides event communication and RSVP automation services that help
                event organizers manage guest communication via WhatsApp and other channels.
              </p>
            </section>
            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-2">Data We Collect:</h2>
              <p>
                We collect limited personal data such as names, phone numbers, and event details that are
                necessary for event communication. This information is provided by event organizers who have
                received consent from their guests.
              </p>
            </section>
            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-2">How We Use Data:</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>To send event invitations, confirmations, and reminders</li>
                <li>To provide automated responses to event-related questions</li>
                <li>To improve our services and maintain system security</li>
              </ul>
            </section>
            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-2">Data Sharing:</h2>
              <p>
                We do not sell or share your personal data with third parties. Data may be stored securely
                using trusted service providers (e.g. Supabase, Twilio) in compliance with data protection
                standards.
              </p>
            </section>
            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-2">Data Retention:</h2>
              <p>
                We retain guest data only for the duration of the event and delete it upon completion or at the
                organizer’s request.
              </p>
            </section>
            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-2">Your Rights:</h2>
              <p>
                Guests can contact us at hello.ari.shmari@gmail.com to request access, correction, or
                deletion of their data.
              </p>
            </section>
            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact:</h2>
              <address className="not-italic">
                Ari<br />
                Email: <a href="mailto:hello.ari.shmari@gmail.com" className="text-primary underline">hello.ari.shmari@gmail.com</a>
              </address>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
