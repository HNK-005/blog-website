import { test as setup, expect } from '@playwright/test';
import { createUser } from '../../src/testing/data-generators';

setup('authenticate', async ({ page }) => {
  const user = createUser();

  await page.goto('/auth/sign-up');

  // registration:
  await page.getByLabel('Full Name').click();
  await page.getByLabel('Full Name').fill(user.fullName);
  await page.getByLabel('Email Address').click();
  await page.getByLabel('Email Address').fill(user.email);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(user.password);
});
