import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NavbarInfoLayout from './NavbarInfoLayout';
import bgImage from '../../images/backgroundImage.jpg';

export default function NavbarInfo() {
  return (
    <NavbarInfoLayout
      sxBackground={{
        backgroundImage:  `url(${bgImage})`,
        backgroundColor: '#7fc7d9',
        backgroundPosition: 'center',
      }}
    >
      <img
        style={{ display: 'none' }}
        src={bgImage}
        alt="increase priority"
      />
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{mb: 4, mt: { xs: 4, sm: 5 } }}
      >
        Załóż swoje konto już dziś! Rekruterzy czekają na Ciebie!
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        sx={{ minWidth: 200 }}
        href="/register"
      >
        Zarejestruj się
      </Button>
    </NavbarInfoLayout>
  );
}