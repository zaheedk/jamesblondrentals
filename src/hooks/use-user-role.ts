import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'admin' | 'moderator' | 'user';

export function useUserRole() {
  const { user } = useAuth();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async (): Promise<AppRole[]> => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return (data || []).map((r) => r.role);
    },
    enabled: !!user?.id,
  });

  return {
    roles,
    isLoading,
    isAdmin: roles.includes('admin'),
    isOfficeAdmin: roles.includes('moderator') || roles.includes('admin'),
    hasRole: (role: AppRole) => roles.includes(role),
  };
}
