import * as React from 'react';
import { AppLayout } from 'src/components/layouts';
import { ProfileForm } from 'src/features/user/components';

const ProfileRoute = () => {
  return (
    <AppLayout>
      <ProfileForm />
    </AppLayout>
  );
};

export default ProfileRoute;
