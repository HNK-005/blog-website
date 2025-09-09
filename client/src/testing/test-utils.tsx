import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';
import { RouterProvider, createMemoryRouter } from 'react-router';

import { AppProvider } from '@/app/provider';


export * from '@testing-library/react';
export { userEvent, rtlRender };
