import { paths } from 'src/config/paths';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import AppRoot from './routes/app/root';
import LoadingPage from 'src/components/loadings/loading-page';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.app.root.path,
      hydrateFallbackElement: <LoadingPage />,
      element: <AppRoot />,
      children: [
        {
          path: paths.app.home.path,
          lazy: () =>
            import('src/app/routes/app/home').then(convert(queryClient)),
        },
        {
          path: '*',
          lazy: () => import('./routes/not-found').then(convert(queryClient)),
        },
        {
          path: paths.app.auth.register.path,
          lazy: () =>
            import('./routes/app/auth/register').then(convert(queryClient)),
        },
        {
          path: paths.app.auth.login.path,
          lazy: () => import('./routes/app/auth/login').then(convert(queryClient)),
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
