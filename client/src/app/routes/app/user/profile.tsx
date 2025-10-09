import * as React from 'react';
import { AppLayout } from 'src/components/layouts';
import { ProfileForm } from 'src/features/user/components/profile-form';

const ProfileRoute = () => {
  return (
    <AppLayout>
      <ProfileForm />
    </AppLayout>
  );
};

export default ProfileRoute;
