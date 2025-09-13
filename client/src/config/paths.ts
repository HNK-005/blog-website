export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  auth: {
    signUp: {
      path: '/auth/sign-up',
    },
  },
} as const;
