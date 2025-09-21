import { Button, Box, Typography } from '@mui/material';

export const MainErrorFallback = () => {
  return (
    <Box
      role="alert"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      color="error.main"
      textAlign="center"
    >
      <Typography variant="h6" fontWeight="600">
        Ooops, something went wrong :(
      </Typography>

      <Button
        sx={{ mt: 2 }}
        variant="contained"
        color="error"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </Box>
  );
};
