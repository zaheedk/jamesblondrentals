import { Navigate, useLocation } from 'react-router-dom';

export default function WellingtonAliasRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
}