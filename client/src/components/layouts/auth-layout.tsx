import * as React from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Container, Typography, Paper, Link } from '@mui/material';
import logo from 'src/assets/logo.svg';
import { paths } from 'src/config/paths';

type AuthLayoutProps = {
  title: string;
} & React.PropsWithChildren;

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: 'backgroud.default',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        {/* Logo */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Link
            component={RouterLink}
            to={paths.app.home.getHref()}
            underline="none"
          >
            <Box
              component="img"
              src={logo}
              alt="Workflow"
              sx={{ height: 96, width: 'auto' }}
            />
          </Link>
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
        >
          {title}
        </Typography>

        {/* Content */}
        <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};
