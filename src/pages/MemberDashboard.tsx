import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Settings, BookOpen, TrendingUp, MessageSquare, Calendar, Users, Car,
  UserCircle, AlertTriangle, Camera, ImageIcon, Upload, ClipboardList,
  ClipboardCheck, IdCard, Bell, ChevronDown, HelpCircle, LogOut, CreditCard,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import SupabaseBookingHistory from '@/components/member/SupabaseBookingHistory';
import ProfileForm from '@/components/member/ProfileForm';
import DocumentsPanel from '@/components/member/DocumentsPanel';
import AdditionalDriversPanel from '@/components/member/AdditionalDriversPanel';
import PaymentCardPanel from '@/components/member/PaymentCardPanel';
import { useUserRole } from '@/hooks/use-user-role';
import PageSEO from '@/components/PageSEO';

const sections = [
  { id: 'bookings', label: 'Bookings', icon: Car, subtitle: 'Manage and view all your vehicle bookings in one place.' },
  { id: 'profile', label: 'Profile', icon: UserCircle, subtitle: 'Keep your personal details up to date.' },
  { id: 'licence', label: 'Licence', icon: IdCard, subtitle: 'Upload your licence documents for faster pick-up.' },
  { id: 'drivers', label: 'Drivers', icon: Users, subtitle: 'Add extra drivers to your rentals.' },
  { id: 'card', label: 'Card', icon: CreditCard, subtitle: 'Manage your saved payment card.' },
] as const;

type SectionId = (typeof sections)[number]['id'];

const staffLinks = [
  { to: '/admin/blog', label: 'Blog Management', icon: BookOpen },
  { to: '/admin/vehicle-rates', label: 'Price Scraping', icon: TrendingUp },
  { to: '/admin/feedback', label: 'Customer Feedback', icon: MessageSquare },
  { to: '/admin/bookings', label: 'All Bookings', icon: Calendar },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/customer-documents', label: 'Verify Documents', icon: IdCard },
  { to: '/admin/import-bookings', label: 'Import Bookings', icon: Upload },
  { to: '/admin/infringements', label: 'Infringements', icon: AlertTriangle },
  { to: '/photos', label: 'Vehicle Photos', icon: Camera },
  { to: '/photo-gallery', label: 'Photo Gallery', icon: ImageIcon },
  { to: '/admin/groom-checklist', label: 'Vehicle Inspection', icon: ClipboardCheck },
  { to: '/admin/groom-checklists', label: 'Inspection Records', icon: ClipboardList },
  { to: '/admin/vehicles', label: 'Vehicle Register', icon: Car },
  { to: '/admin/reference-data', label: 'Categories & Branches', icon: ClipboardList },
];

const officeLinks = staffLinks.filter(l => ['/ra', '/admin/bookings', '/photos', '/photo-gallery', '/admin/groom-checklist', '/admin/groom-checklists', '/admin/vehicles', '/admin/reference-data'].includes(l.to));

function initialsOf(name: string, email: string) {
  const source = name.trim() || email;
  const parts = source.replace(/@.*/, '').split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function MemberDashboard() {
  const { user, signOut } = useAuth();
  const { isAdmin, isOfficeAdmin } = useUserRole();
  const [savoLoading, setSavoLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab: string = searchParams.get('tab') || 'bookings';
  const active = (rawTab === 'documents' ? 'licence' : rawTab) as SectionId;

  const setActive = (id: SectionId) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', id);
      return next;
    }, { replace: true });
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  const handleReportAccident = async () => {
    if (!user?.email) return;
    setSavoLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-to-savo', {
        body: {
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email,
          regoNumber: '',
        },
      });
      if (error) throw error;
      if (data?.login_url) {
        window.open(data.login_url, '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://savo.co.nz', '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Savo login error:', err);
      window.open('https://savo.co.nz', '_blank', 'noopener,noreferrer');
    } finally {
      setSavoLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const staff = isAdmin ? staffLinks : isOfficeAdmin ? officeLinks : [];
  const section = sections.find(s => s.id === active);

  const renderPanel = () => {
    switch (active) {
      case 'profile':
        return <ProfileForm />;
      case 'licence':
        return <DocumentsPanel />;
      case 'drivers':
        return <AdditionalDriversPanel />;
      case 'card':
        return <PaymentCardPanel />;
      default:
        return <SupabaseBookingHistory />;
    }
  };

  const navItem = (s: (typeof sections)[number]) => {
    const Icon = s.icon;
    const isActive = active === s.id;
    return (
      <button
        key={s.id}
        onClick={() => setActive(s.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors text-left ${
          isActive
            ? 'bg-primary text-white font-semibold shadow-sm'
            : 'text-white/70 hover:text-white hover:bg-portal-nav-item/60'
        }`}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" />
        <span>{s.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 font-portalBody">
      <PageSEO title="My Dashboard – James Blond Rentals" description="View your bookings, rental history and manage your James Blond Rentals account from your personal dashboard." canonical="/member-dashboard" noindex />
      <Helmet>
        <link rel="manifest" href="/manifest-app.json" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="James Blond" />
      </Helmet>

      <div className="md:flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-64 shrink-0 bg-portal-nav text-white flex-col md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          {/* Logo */}
          <div className="px-5 pt-6">
            <div className="rounded-xl bg-white px-4 py-3">
              <img
                src="/lovable-uploads/900107e8-dbcb-44ce-96a9-0588959abf24.png"
                alt="James Blond Rentals"
                className="h-9 w-auto"
              />
            </div>
          </div>

          <nav className="mt-6 space-y-1 px-3" aria-label="Dashboard sections">
            {sections.map(navItem)}
          </nav>

          {staff.length > 0 && (
            <div className="mt-6 px-3">
              <div className="mx-3 border-t border-white/10" />
              <p className="px-4 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                {isAdmin ? 'Admin Tools' : 'Office Tools'}
              </p>
              <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
                {staff.map(l => {
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.to + l.label}
                      to={l.to}
                      className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white/60 transition-colors hover:bg-portal-nav-item/60 hover:text-white"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{l.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Need help footer */}
          <div className="mt-auto px-6 pb-6 pt-8">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70">
                <HelpCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Need help?</p>
                <Link to="/contact" className="text-xs text-white/60 underline underline-offset-2 hover:text-white">
                  Contact our team
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-end gap-3 px-4 py-3 md:px-8">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground" aria-hidden="true">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-muted focus:outline-none">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {initialsOf(user.user_metadata?.full_name || '', user.email)}
                    </span>
                    <span className="hidden text-sm font-medium text-foreground sm:block">{displayName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="truncate text-sm font-medium">{displayName}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Mobile section nav */}
          <div className="border-b border-border bg-card px-3 py-2 flex gap-1.5 overflow-x-auto md:hidden">
            {sections.map(s => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-primary text-white font-semibold'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <main className="px-4 py-6 md:px-8 md:py-8">
            {/* Page heading + accident card */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="font-portalHeading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {section?.label || 'Bookings'}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
                  {section?.subtitle}
                </p>
              </div>

              {/* Accident report card hidden for now — re-enable later */}
              {false && (
                <div className="flex items-start gap-3.5 rounded-xl border border-primary/15 bg-primary/5 p-4 lg:max-w-md">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Had an accident?</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Report it quickly through our accident reporting tool.{' '}
                      <button
                        onClick={handleReportAccident}
                        disabled={savoLoading}
                        className="font-semibold text-primary hover:underline disabled:opacity-50"
                      >
                        {savoLoading ? 'Opening…' : 'Start a report'}
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {isAdmin && (
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-portal-emerald-soft px-3 py-1 text-xs font-bold text-portal-emerald">
                <Settings className="h-3 w-3" />
                Admin
              </span>
            )}

            <div className="mt-6">
              {renderPanel()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
