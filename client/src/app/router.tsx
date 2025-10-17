import { paths } from 'src/config/paths';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import AppRoot from './routes/app/root';
import LoadingPage from 'src/components/loadings/loading-page';
import { ProtectRoute } from 'src/features/auth/guards/protect-route';

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
      children: [
        {
          path: paths.app.home.path,
          lazy: () =>
            import('src/app/routes/app/home').then(convert(queryClient)),
        },
        {
          path: paths.app.confirmEmail.path,
          lazy: () =>
            import('src/app/routes/app/confirm-email').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.auth.register.path,
          lazy: () =>
            import('./routes/app/auth/register').then(convert(queryClient)),
        },
        {
          path: paths.app.auth.login.path,
          lazy: () =>
            import('./routes/app/auth/login').then(convert(queryClient)),
        },
        {
          element: (
            <ProtectRoute>
              <AppRoot />
            </ProtectRoute>
          ),
          children: [
            {
              path: paths.app.user.profile.path,
              lazy: () =>
                import('./routes/app/user/profile').then(convert(queryClient)),
            },
            {
              path: paths.app.post.create.path,
              lazy: () =>
                import('./routes/app/post/create').then(convert(queryClient)),
            },
          ],
        },

        {
          path: '*',
          lazy: () => import('./routes/not-found').then(convert(queryClient)),
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
