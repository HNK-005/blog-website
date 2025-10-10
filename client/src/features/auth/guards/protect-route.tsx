import { Navigate } from 'react-router';
import { paths } from 'src/config/paths';
import { useAuthStore } from 'src/features/auth/store/auth-store';

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore.getState();

  if (!user) {
    return <Navigate to={paths.app.home.getHref()} replace />;
  }

  return children;
};
