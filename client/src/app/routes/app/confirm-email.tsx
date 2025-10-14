import { Navigate, useSearchParams } from 'react-router';
import { paths } from 'src/config/paths';
import { ConfirmEmail } from 'src/features/auth/components';

const ConfirmRoute = () => {
  const [searchParams] = useSearchParams();

  const hash = searchParams.get('hash');

  if (!hash) {
    return <Navigate to={paths.app.home.getHref()} replace />;
  }

  return <ConfirmEmail hash={hash} />;
};

export default ConfirmRoute;
