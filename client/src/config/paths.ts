export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  auth: {
    signUp: {
      path: '/auth/sign-up',
    },
    signIn: {
      path: '/auth/sign-in',
    },
  },
} as const;
