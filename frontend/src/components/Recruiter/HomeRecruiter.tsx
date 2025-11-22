import React from 'react';
import Navbar from "../Shared/Navbar";
import {Grid, MenuList, Paper} from "@mui/material";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Footer from "../Shared/Footer";
import {Link, Outlet} from "react-router-dom";


function HomeRecruiter() {
    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Navbar/>
            <Container maxWidth="xl" sx={{flexGrow: 1}}>
                <Grid container spacing={3} marginTop={2} marginBottom={2}>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{width: '70%'}}>
                            <MenuList>
                                <MenuItem component={Link} to={'invitations'}>Lista zaproszeń</MenuItem>
                                <MenuItem component={Link} to={'workers'}>Lista pracowników</MenuItem>
                                <MenuItem component={Link} to={'favorites'}>Lista ulubionych</MenuItem>
                            </MenuList>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={9} display={'flex'} >

                            <Outlet/>

                        </Grid>
                </Grid>
            </Container>
            <Footer/>
        </div>
    );
}

export default HomeRecruiter;