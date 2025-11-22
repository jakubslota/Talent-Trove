import React from 'react';
import Navbar from "../Shared/Navbar";
import {Grid, MenuList, Paper} from "@mui/material";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Footer from "../Shared/Footer";
import Box from "@mui/material/Box";
import {Link, Outlet} from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import axios from "axios";
import {useAuthUser} from 'react-auth-kit'
import {useAuthHeader} from 'react-auth-kit';

function createData(
    name: string,
    calories: number,
) {
    return { name, calories};
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
interface visit {
    daily: number,
    weekly: number,
    monthly: number,
    yearly: number,
}
function HomeWorker() {
    const auth = useAuthUser();
    const authHeader = useAuthHeader();
    const [visits, setVisits] = React.useState<visit>({
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
    });

    const addVisit = async () => {
        try {

            const response = await axios.get(
                `http://127.0.0.1:8000/api/visits/workers/${auth()?.user_role_id}/`,{ headers: { 'Authorization': authHeader() }}
            );
            setVisits(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                
            } else {
                
            }
        }
    }
    const [open, setOpen] = React.useState(false);
    const handleOpen = () =>{setOpen(true);
        addVisit();
    } 
    
    const handleClose = () => setOpen(false);
    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Navbar/>
            <Container maxWidth="xl" sx={{flexGrow: 1}}>
                <Grid container spacing={3} marginTop={2} marginBottom={2}>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{width: '70%'}}>
                            <MenuList>
                                <MenuItem component={Link} to={'invitations'}>Lista zaproszeń</MenuItem>
                                <MenuItem component={Link} to={'worker'}>Szczegóły konta</MenuItem>
                                <MenuItem component={Link} to={'update'}>Edytuj swoje dane</MenuItem>
                                <MenuItem sx={{textWrap:"wrap"}} component={Link} to={'programingLanguages'}>Dodaj/Uaktualnij języki programowania</MenuItem>
                            </MenuList>
                            </Paper>
                            <Paper sx={{width: '70%', marginTop:1}}>
                            <Button variant="contained" color='secondary' onClick={handleOpen}>Zobacz ilość wejść na profil</Button>
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style}>

                                            <TableContainer>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Okres</TableCell>
                                                            <TableCell align="right">ilość wejść</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                            <TableRow
                                                                key={1}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell component="th" scope="row">
                                                                    Dzienny
                                                                </TableCell>
                                                                <TableCell align="right">{visits.daily}</TableCell>
                                                            </TableRow>
                                                            <TableRow
                                                                key={2}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell component="th" scope="row">
                                                                    Tygodniowy
                                                                </TableCell>
                                                                <TableCell align="right">{visits.weekly}</TableCell>
                                                            </TableRow>
                                                            <TableRow
                                                                key={3}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell component="th" scope="row">
                                                                    Miesięczny
                                                                </TableCell>
                                                                <TableCell align="right">{visits.monthly}</TableCell>
                                                            </TableRow>
                                                            <TableRow
                                                                key={4}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell component="th" scope="row">
                                                                    Roczny
                                                                </TableCell>
                                                                <TableCell align="right">{visits.yearly}</TableCell>
                                                            </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            </Box>
                                            </Modal>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={9} display={'flex'}>
                        <Outlet/>
                    </Grid>
                </Grid>
            </Container>

            <Footer/>
        </div>
    );
}

export default HomeWorker;