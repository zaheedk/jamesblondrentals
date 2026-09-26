import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, BookOpen, TrendingUp, MessageSquare, Calendar, Users, Car, UserCircle, FileText, AlertTriangle, Camera, ImageIcon, Upload, ClipboardList, ClipboardCheck, IdCard } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import SupabaseBookingHistory from '@/components/member/SupabaseBookingHistory';
import ProfileForm from '@/components/member/ProfileForm';
import DocumentsPanel from '@/components/member/DocumentsPanel';
import AdditionalDriversPanel from '@/components/member/AdditionalDriversPanel';
import PaymentCardPanel from '@/components/member/PaymentCardPanel';
import { CreditCard, LogOut } from 'lucide-react';
import { useUserRole } from '@/hooks/use-user-role';
import PageSEO from '@/components/PageSEO';

const sections = [
  { id: 'bookings', label: 'Bookings', icon: Car },
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'licence', label: 'Licence', icon: IdCard },
  { id: 'drivers', label: 'Drivers', icon: Users },
  { id: 'card', label: 'Card', icon: CreditCard },
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
  const rawTab = (searchParams.get('tab') as SectionId) || 'bookings';
  const active: SectionId = rawTab === 'documents' ? 'licence' : rawTab;

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

  const renderPanel = () => {
    switch (active) {
      case 'profile':
        return <ProfileForm />;
      case 'documents':
        return <DocumentsPanel />;
      case 'drivers':
        return <AdditionalDriversPanel />;
      case 'card':
        return <PaymentCardPanel />;
      default:
        return <SupabaseBookingHistory />;
    }
  };

  const sectionTitle = sections.find(s => s.id === active)?.label || 'Bookings';

  const navItem = (s: (typeof sections)[number]) => {
    const Icon = s.icon;
    const isActive = active === s.id;
    return (
      <button
        key={s.id}
        onClick={() => setActive(s.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`w-full flex items-center gap-3 rounded-lg transition-colors text-left ${
          isActive
            ? 'bg-portal-nav-item text-white font-semibold shadow-sm'
            : 'text-white/70 hover:text-white hover:bg-portal-nav-item/60'
        }`}
      >
        <span className="flex items-center gap-3 px-4 py-3 w-full">
          <Icon className="w-5 h-5 shrink-0" />
          <span className="text-sm">{s.label}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-muted/40 font-portalBody">
      <PageSEO title="My Dashboard – James Blond Rentals" description="View your bookings, rental history and manage your James Blond Rentals account from your personal dashboard." canonical="/member-dashboard" noindex />
      <Helmet>
        <link rel="manifest" href="/manifest-app.json" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="James Blond" />
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-0 md:px-6 md:py-8">
        <div className="md:flex md:min-h-[720px] md:rounded-2xl md:overflow-hidden md:border md:border-border md:shadow-xl bg-card">

          {/* Sidebar (desktop) */}
          <aside className="hidden md:flex w-64 shrink-0 bg-portal-nav text-white flex-col">
            <div className="px-6 pt-7 pb-6">
              <div className="text-2xl font-bold tracking-tight font-portalHeading">
                <span className="text-portal-emerald">James</span> Blond
              </div>
              <p className="text-xs text-white/50 mt-1">Member Portal</p>
            </div>

            <nav className="px-3 space-y-1" aria-label="Dashboard sections">
              {sections.map(navItem)}
            </nav>

            {staff.length > 0 && (
              <div className="mt-8 px-3">
                <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {isAdmin ? 'Admin Tools' : 'Office Tools'}
                </p>
                <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
                  {staff.map(l => {
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.to + l.label}
                        to={l.to}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-portal-nav-item/60 transition-colors"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{l.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-auto p-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-2 pb-4">
                <span className="w-9 h-9 rounded-full bg-portal-emerald-soft text-portal-emerald flex items-center justify-center font-bold text-xs">
                  {initialsOf(user.user_metadata?.full_name || '', user.email)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-white/50 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={signOut}
                className="w-full justify-start text-white/70 hover:text-white hover:bg-portal-nav-item/60 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </aside>

          {/* Main column */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Header */}
            <header className="bg-card border-b border-border px-4 md:px-8 py-5 md:py-6 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground font-portalHeading tracking-tight">
                  Welcome back, {displayName}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  Manage your rentals and account details.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="w-10 h-10 rounded-full bg-portal-emerald-soft text-portal-emerald flex items-center justify-center font-bold text-sm">
                  {initialsOf(user.user_metadata?.full_name || '', user.email)}
                </span>
                <Button variant="outline" size="sm" onClick={signOut} className="md:hidden gap-2">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </div>
            </header>

            {/* Mobile section nav */}
            <div className="md:hidden border-b border-border bg-card px-3 py-2 flex gap-1.5 overflow-x-auto">
              {sections.map(s => {
                const Icon = s.icon;
                const isActive = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-portal-nav text-white font-semibold'
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
            <main className="flex-1 px-4 md:px-8 py-6 md:py-8 space-y-6 overflow-y-auto">
              {/* Accident report banner */}
              <div className="bg-portal-alert-soft border border-portal-alert/20 rounded-xl p-4 flex items-start gap-4">
                <span className="bg-portal-alert text-white p-2 rounded-lg shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div className="flex-1">
                  <h2 className="text-portal-foreground font-semibold text-sm uppercase tracking-wider">
                    Had an accident?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Report it quickly through our accident reporting tool.{' '}
                    <button
                      onClick={handleReportAccident}
                      disabled={savoLoading}
                      className="font-bold underline text-portal-alert hover:opacity-80 disabled:opacity-50"
                    >
                      {savoLoading ? 'Opening…' : 'Start a report'}
                    </button>
                  </p>
                </div>
                {isAdmin && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-portal-emerald bg-portal-emerald-soft px-3 py-1 rounded-full">
                    <Settings className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground font-portalHeading tracking-tight mb-4">
                  {sectionTitle}
                </h2>
                {renderPanel()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
