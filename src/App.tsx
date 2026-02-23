import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import Events from "@/pages/Events";
import CreateEvent from "@/pages/CreateEvent";
import EventDashboard from "@/pages/EventDashboard";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy";

function Router() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return (
    <WouterRouter base={base}>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/signin" component={SignIn} />
        
        {/* Protected routes */}
        <Route path="/events">
          {() => (
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/events/new">
          {() => (
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/event-dashboard">
          {() => (
            <ProtectedRoute>
              <EventDashboard />
            </ProtectedRoute>
          )}
        </Route>
        
        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
