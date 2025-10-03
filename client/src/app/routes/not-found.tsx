import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router';
import pageNotFoundImage from 'src/assets/404.png';
import fullLogo from 'src/assets/full-logo.png';
import { paths } from 'src/config/paths';

const NotFoundRoute = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: 10,
        gap: 6,
      }}
    >
      <Box
        component="img"
        src={pageNotFoundImage}
        alt="404 - Not Found"
        sx={{
          width: 288, // ~ w-72
          aspectRatio: '1/1',
          objectFit: 'cover',
          border: '2px solid #ccc',
          borderRadius: 2,
          userSelect: 'none',
        }}
      />

      <Typography variant="h3" fontWeight="bold">
        Page not found
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mt: -2 }}>
        The page you are looking for does not exist. Head back to the{' '}
        <MuiLink
          component={Link}
          to={paths.app.root.path}
          underline="hover"
          color="text.primary"
        >
          home page
        </MuiLink>
      </Typography>

      <Box sx={{ mt: 'auto', textAlign: 'center' }}>
        <Box
          component="img"
          src={fullLogo}
          alt="App Logo"
          sx={{
            height: 32,
            objectFit: 'contain',
            mx: 'auto',
            userSelect: 'none',
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Read millions of stories around the world
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundRoute;
