import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import logoHorizontal from '../../images/logoHorizontal.png';
import {useIsAuthenticated, useSignOut} from 'react-auth-kit';
import {useNavigate} from "react-router-dom";
import {message} from "antd";

function Navbar() {
  const signOut = useSignOut()
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated()
  const logout = () => {
    signOut();
    message.success("Pomyślnie wylogowano!", 2)
    navigate("/");
  };
  return (
    <AppBar position="sticky" color={"secondary"} >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <img src={logoHorizontal} alt="LOGO" className="logo" width="170px"/>

          <Box>
          {(() => {
                if (isAuthenticated()) {
                  return (
                    <Button sx={{ my: 2, color: 'white', display: 'block', border: 2}} onClick={logout}>
                    Wyloguj
                  </Button>
                    // <div><button type="button" className="btn btn-primary nav-item mx-1" onClick={logout}>Logout</button></div>
                  )
                } else {
                  return (
                    <Button sx={{ my: 2, color: 'white', display: 'block', border: 2}} href={'/login'}>
                    Zaloguj się
                  </Button>
                  )
                }
              })()}

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
