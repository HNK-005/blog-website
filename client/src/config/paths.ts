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
      login: {
        path: '/auth/login',
        getHref: (redirectTo?: string | null | undefined) =>
          `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
      },
    },
    user: {
      profile: {
        path: '/user/profile',
        getHref: (redirectTo?: string | null | undefined) =>
          `/user/profile${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
      },
    },
  },
} as const;
