export const paths = {
  app: {
    root: {
      path: '/',
      getHref: () => '/',
    },
    home: {
      path: '',
      getHref: () => '/',
    },
    auth: {
      register: {
        path: '/auth/register',
        getHref: (redirectTo?: string | null | undefined) =>
          `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
      },
      verifyEmail: {
        path: '/auth/verify-email',
      },
    },
  },
} as const;
