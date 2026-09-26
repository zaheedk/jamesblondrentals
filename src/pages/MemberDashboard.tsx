import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, BookOpen, TrendingUp, MessageSquare, Calendar, Users, Car, UserCircle, FileText, AlertTriangle, Camera, ImageIcon, Upload, ClipboardList, ClipboardCheck, IdCard, ChevronDown, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import SupabaseBookingHistory from '@/components/member/SupabaseBookingHistory';
import ProfileForm from '@/components/member/ProfileForm';
import DocumentsPanel from '@/components/member/DocumentsPanel';
import AdditionalDriversPanel from '@/components/member/AdditionalDriversPanel';
import PaymentCardPanel from '@/components/member/PaymentCardPanel';
import { CreditCard } from 'lucide-react';
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
  const [staffOpen, setStaffOpen] = useState(false);
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

  const sectionTitle = sections.find(s => s.id === active)?.label || 'Bookings';

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 via-background to-background font-portalBody">
      <PageSEO title="My Dashboard – James Blond Rentals" description="View your bookings, rental history and manage your James Blond Rentals account from your personal dashboard." canonical="/member-dashboard" noindex />
      <Helmet>
        <link rel="manifest" href="/manifest-app.json" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="James Blond" />
      </Helmet>

      <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-12 md:pt-10 md:px-6">
        {/* Account bar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-portalHeading font-bold text-sm shrink-0">
              {initialsOf(user.user_metadata?.full_name || '', user.email)}
            </span>
            <div className="min-w-0">
              <p className="font-portalHeading text-sm font-semibold text-foreground truncate leading-tight">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
                <Settings className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="gap-2 rounded-full shrink-0 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>

        {/* Section navigation */}
        <nav
          aria-label="Dashboard sections"
          className="flex gap-1 overflow-x-auto border-b border-border/70 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm transition-colors rounded-t-lg ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {s.label}
                <span
                  className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-opacity ${
                    isActive ? 'bg-primary opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Staff tools (collapsible) */}
        {staff.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setStaffOpen(o => !o)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={staffOpen}
            >
              {isAdmin ? 'Admin tools' : 'Office tools'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${staffOpen ? 'rotate-180' : ''}`} />
            </button>
            {staffOpen && (
              <div className="mt-2 flex flex-wrap gap-2">
                {staff.map(l => {
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.to + l.label}
                      to={l.to}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Accident report banner */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/70 px-4 py-3">
          <span className="flex w-8 h-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <p className="text-sm text-amber-900/80">
            <span className="font-semibold text-amber-900">Had an accident?</span>{' '}
            Report it quickly through our accident reporting tool.{' '}
            <button
              onClick={handleReportAccident}
              disabled={savoLoading}
              className="font-semibold underline underline-offset-2 hover:opacity-80 disabled:opacity-50"
            >
              {savoLoading ? 'Opening…' : 'Start a report'}
            </button>
          </p>
        </div>

        {/* Content */}
        <main className="mt-7">
          <h1 className="font-portalHeading text-2xl font-bold tracking-tight text-foreground mb-5">
            {sectionTitle}
          </h1>
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
