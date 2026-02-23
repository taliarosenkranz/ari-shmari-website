import { Link, useLocation } from 'wouter';
import { createPageUrl } from '@/lib/pageUtils';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    const { signOut } = useAuth();
    const [location] = useLocation();
    const isAuthPage = location.toLowerCase().includes('login') || location.toLowerCase().includes('signin');
    const isDashboard = location.includes('event') || location.includes('create');

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Header */}
            <header className="border-b border-slate-100 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to={createPageUrl('Home')} className="text-2xl font-serif font-bold text-emerald-600 tracking-tight">
                            ARI
                        </Link>
                    </div>

                    {!isAuthPage && (
                        <nav className="hidden md:flex items-center gap-8">
                            {!isDashboard ? (
                                <>
                                    <Link to="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Features</Link>
                                    <Link to="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">How It Works</Link>
                                    <Link to="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Contact</Link>
                                    <Link to={createPageUrl('SignIn')} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                        Login
                                    </Link>
                                    <Link to={createPageUrl('SignIn')}>
                                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6">
                                            Book a Demo
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to={createPageUrl('Events')} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                        Events
                                    </Link>
                                    <Button 
                                        variant="ghost" 
                                        onClick={signOut}
                                        className="text-slate-600 hover:text-slate-900"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            )}
                        </nav>
                    )}
                </div>
            </header>

            <main>
                {children}
            </main>

            {/* Footer - Only show on landing */}
            {!isDashboard && !isAuthPage && (
                <footer className="bg-slate-50 py-12 border-t border-slate-100 mt-20">
                    <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                        <p>© 2026 ARI Events. All rights reserved.</p>
                    </div>
                </footer>
            )}
        </div>
    );
}