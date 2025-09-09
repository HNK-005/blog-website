import { BrowserRouter as Router } from 'react-router';
import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

import type { StoryFn } from '@storybook/react';

export const decorators = [
  (Story: StoryFn) => (
    <Router>
      <Story />
    </Router>
  ),
];
