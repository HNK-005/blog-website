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
  },
} as const;
