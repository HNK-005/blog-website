import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MainErrorFallback } from 'src/components/errors/main';
import { queryConfig } from 'src/lib/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthLoader } from 'src/lib/auth';
import LoadingPage from 'src/components/loadings/loading-page';

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {import.meta.env.DEV && <ReactQueryDevtools />}
        <Toaster position="top-right" reverseOrder={false} />
        <AuthLoader renderLoading={() => <LoadingPage />}>
          {children}
        </AuthLoader>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
