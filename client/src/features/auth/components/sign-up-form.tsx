import * as React from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { signUpInputSchema } from '@/lib/auth';

export const SignUpForm = () => {
  return (
    <div>
      <Form
        onSubmit={(values) => {
          console.log(values);
        }}
        schema={signUpInputSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
          <>
            <Input
              className="input-box"
              type="text"
              label="Full Name"
              placeholder="Enter Full Name"
              error={formState.errors['fullName']}
              registration={register('fullName')}
            />
            <Input
              className="input-box"
              type="email"
              label="Email Address"
              placeholder="Enter Email"
              error={formState.errors['email']}
              registration={register('email')}
            />
            <Input
              className="input-box"
              type="password"
              label="Password"
              placeholder="Enter Password"
              error={formState.errors['password']}
              registration={register('password')}
            />

            <div>
              <Button type="submit" className="w-full">
                Sign Up
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
        Already a member?
        <Link to="" className="ml-1 text-xl text-foreground underline">
          Sign in here.
        </Link>
      </p>
    </div>
  );
};
