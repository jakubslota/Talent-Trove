import * as React from 'react';
import {styled, Theme} from '@mui/material/styles';
import {SxProps} from '@mui/system';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";

const NavbarInfoLayoutRoot = styled('section')(({ theme }) => ({
  color: theme.palette.common.white,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    height: '80vh',
    minHeight: 500,
    maxHeight: 1300,
  },
}));

const Background = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  zIndex: -2,
});

interface NavbarInfoLayoutRootInterface {
  sxBackground: SxProps<Theme>;
}

export default function NavbarInfoLayout(
  props: React.HTMLAttributes<HTMLDivElement> & NavbarInfoLayoutRootInterface,
) {
  const { sxBackground, children } = props;

  return (
    <NavbarInfoLayoutRoot>
      <Container
        sx={{
          mt: 3,
          mb: 14,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
         color="inherit"
         align="center"
         variant="h2"
        >
            Szukasz pracy?
        </Typography>
        {children}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'common.black',
            opacity: 0.5,
            zIndex: -1,
          }}
        />
        <Background sx={sxBackground} />
      </Container>
    </NavbarInfoLayoutRoot>
  );
}