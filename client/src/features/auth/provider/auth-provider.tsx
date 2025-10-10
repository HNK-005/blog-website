import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import LoadingPage from 'src/components/loadings/loading-page';
import { me } from 'src/lib/auth';
import { useAuthStore } from 'src/features/auth/store/auth-store';

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const { setUser } = useAuthStore.getState();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => await me(),
    onSuccess: (data) => {
      setUser(data);
    },
  });

  React.useEffect(() => {
    useAuthStore.subscribe((state, preState) => {
      if (!state.user && state.user != preState.user) {
        mutate();
      }
    });
    mutate();
  }, []);

  if (isPending) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};
