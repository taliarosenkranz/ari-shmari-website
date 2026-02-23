/**
 * Utility function to create page URLs for routing
 * Maps page names to their corresponding routes
 */
export function createPageUrl(pageName: string): string {
  const routes: Record<string, string> = {
    'Home': '/',
    'SignIn': '/signin',
    'Events': '/events',
    'CreateEvent': '/events/new',
    'EventDashboard': '/event-dashboard',
  };

  return routes[pageName] || '/';
}
