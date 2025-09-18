import * as React from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { signInInputSchema, useLogin } from '@/lib/auth';
import { paths } from '@/config/paths';

type SignInFormProps = {
  onSuccess: () => void;
};

export const SignInForm = ({ onSuccess }: SignInFormProps) => {
  const login = useLogin({ onSuccess });

  return (
    <div>
      <Form
        onSubmit={(values) => {
          login.mutate(values);
        }}
        schema={signInInputSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
          <>
            <Input
              className="input-box"
              type="email"
              label="Email Address"
              placeholder="Enter email"
              error={formState.errors['email']}
              registration={register('email')}
            />
            <Input
              className="input-box"
              type="password"
              label="Password"
              placeholder="Enter password"
              error={formState.errors['password']}
              registration={register('password')}
            />

            <div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="relative my-10 flex w-full items-center gap-2 font-bold uppercase text-foreground opacity-10">
        <hr className="w-1/2 border-foreground" />
        <p>or</p>
        <hr className="w-1/2 border-foreground" />
      </div>
      <p className="mt-6 space-x-2 text-center text-xl text-gray-600">
        Don't have an account?
        <Link
          to={paths.auth.signUp.path}
          className="ml-1 text-xl text-foreground underline"
        >
          Join us today.
        </Link>
      </p>
    </div>
  );
};
