import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { paths } from 'src/config/paths';
import { ConfirmEmail } from 'src/features/auth/components/confirm-email';

const ConfirmRoute = () => {
  const [searchParams] = useSearchParams();

  const hash = searchParams.get('hash');
  const email = searchParams.get('email');


  if (!hash || !email) {
    return <Navigate to={paths.app.home.getHref()} replace />;
  }

  return (
    <ConfirmEmail hash={hash} email={email} />
  );
};

export default ConfirmRoute;
