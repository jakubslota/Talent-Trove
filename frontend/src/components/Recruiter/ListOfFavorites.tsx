import React, {useEffect, useRef, useState} from 'react';
import {Box, Grid, Modal, Paper, Typography} from "@mui/material";
import axios from "axios";
import {useAuthUser} from 'react-auth-kit'
import {DataGridWorkerProps, FavouriteWorker, Worker} from "../../models/WorkerModel";
import FavoriteIcon from '@mui/icons-material/Favorite';
import Button from "@mui/material/Button";
import {DetailsOutlined} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import {message} from "antd";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import dayjs from 'dayjs';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useAuthHeader} from 'react-auth-kit';


function ListOfFavorites() {
    const mindate = dayjs().add(2, 'day');
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = useState<Date>(mindate.toDate());
    const [openInvitation, setOpenInvitation] = React.useState(false);
    const authUser = useAuthUser();
    const recruiter_id = authUser()?.user_role_id;
    const [workerData, setWorker] = useState<Worker>();
    const [ListOfFavouriteWorkers, setListOfFavouriteWorkers] = useState<FavouriteWorker[]>();
    const authHeader = useAuthHeader();

    const columns: any = [{field: 'id', headerName: 'ID', width: 100, headerAlign: 'center'},
        {field: 'firstName', headerName: 'Imię', width: 200, headerAlign: 'center'},
        {field: 'lastName', headerName: 'Nazwisko', width: 200, headerAlign: 'center'},
        {field: 'city', headerName: 'Miasto', width: 200, headerAlign: 'center'},
        {field: 'experience', headerName: 'Doświadczenie zawodowe w latach', width: 250, headerAlign: 'center'},
        {field: 'prefered_style_of_work', headerName: 'Preferowany styl pracy', width: 200, headerAlign: 'center'},
        {field: 'specialization', headerName: 'Specializacja', width: 200, headerAlign: 'center'},
        {
            field: 'follow', headerName: 'Odobserwuj', width: 200, headerAlign: 'center', renderCell: (params: any) => {
                return (
                    <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    onClick={() => handleUnfollow(params.row.favorite_id)}
                                                    type="submit"
                                                >
                                                    <FavoriteIcon/>
                                                </Button>
            )
            }
        },
{
            field: 'details', headerName: 'Szczegóły', width: 200, headerAlign: 'center', renderCell: (params: any) => {
                return (
                    <Button variant="contained" color="secondary"
                                                        fullWidth
                                                        size="large"
                                                        onClick={() => handleOpen(params.row.id)}><DetailsOutlined/></Button>
                )
            }
        },
    ];
    const addVisit = async (worker_id: number) => {
        try {
            const values = {
                "worker": worker_id,
            };

            await axios.post(
                `http://127.0.0.1:8000/api/visits/workers/${worker_id}/`,
                values,{ headers: { 'Authorization': authHeader() }}
            );
            
        } catch (err) {
            if (axios.isAxiosError(err)) {
                
            } else {
                
            }
        }
    }
    const handleOpen = (worker_id: number) => {
        setOpen(true);
        addVisit(worker_id);
        ListOfFavouriteWorkers?.forEach((worker) => {
            if (worker.worker.id === worker_id) {
                setWorker(worker.worker);
            }
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [employees, setEmployees] = React.useState<DataGridWorkerProps[]>([]);

    const shouldLog = useRef(true);
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const fetchFavoriteWorkersOnPageLoad = async () => {
                try {
                    const response = await axios.get<FavouriteWorker[]>(`http://localhost:8000/api/favorites/recruiters/${recruiter_id}`,{ headers: { 'Authorization': authHeader() }});
                    for (const favWorker of response.data) {
                        
                        setEmployees(prevState => {
                            return [...prevState, {
                                id: favWorker.worker.id,
                                firstName: favWorker.worker.user.first_name,
                                lastName: favWorker.worker.user.last_name,
                                city: favWorker.worker.city?.name,
                                age: favWorker.worker.age,
                                gender: favWorker.worker.gender === "male" ? "Mężczyzna" : favWorker.worker.gender === "female" ? "Kobieta" : "Inna",
                                experience: favWorker.worker.experience || "-",
                                education: favWorker.worker.education === "primary" ? "Podstawowe" : favWorker.worker.education === "secondary" ? "Średnie" : favWorker.worker.education === "bachelor" ? "Licencjat" : favWorker.worker.education === "master" ? "Magister" : "Doktor" || "-",
                                prefered_salary: favWorker.worker.prefered_salary || "-",
                                prefered_style_of_work: favWorker.worker.prefered_style_of_work === "remote" ? "Zdalnie" : favWorker.worker.prefered_style_of_work === "office" ? "Stacjonarnie" : "Hybrydowy" || "-",
                                specialization: favWorker.worker.specialization?.name,
                                favorite_id: favWorker.id
                            }];
                        })
                    }
                    setListOfFavouriteWorkers(response.data);
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {
                        
                    } else {
                        
                    }
                }
            };

            fetchFavoriteWorkersOnPageLoad();
        }
    }, []);


    async function handleUnfollow(worker_id: number) {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/favorites/${worker_id}/`,{ headers: { 'Authorization': authHeader() }}
            );
            const updatedEmployees = employees.filter((employee) => employee.favorite_id !== worker_id);
            setEmployees(updatedEmployees);
            message.success("Pomyślnie odobserwowano!", 2)
        } catch (error: any) {
            if (error.response !== undefined) {
                for (let [key, value] of Object.entries(error.response.data)) {
                        message.error(`${value}`, 4);
                }
            }
    }
    }

    async function sendInvitation(worker_id: number, date: Date) {
        try {
            const formattedDate = date.toISOString().slice(0, 16).replace(' ', 'T');

            const values = {
                "status": "new",
                "date": formattedDate,
                "worker": worker_id,
                "recruiter": recruiter_id
            };

            
            const response = await axios.post(
                `http://localhost:8000/api/invitations/create/`,
                values,{ headers: { 'Authorization': authHeader() }}
            );
            handleClose();
            setOpenInvitation(false);
            message.success("Pomyślnie wysłano zaproszenie!", 2)
        } catch (error: any) {
            if (error.response !== undefined) {
                for (let [key, value] of Object.entries(error.response.data)) {
                        message.error(`${value}`, 4);
                }
            }
    }
    }

    return (
        <Grid justifyContent="center" alignItems="center" width='100%'>
            <Paper elevation={10} >
                <Grid>
                    <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>Lista
                        ulubionych</Typography>
                    {ListOfFavouriteWorkers && ListOfFavouriteWorkers.length > 0 ? (
                        <>
                        <DataGrid rows={employees} columns={columns} initialState={{     
                            columns: {       
                                columnVisibilityModel: { id: false,},    },  }}/>
                        <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="parent-modal-title"
                                                    aria-describedby="parent-modal-description"
                                                >
                                                    <Box sx={{
                                                        position: 'absolute' as 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: 450,
                                                        bgcolor: 'background.paper',
                                                        border: '2px solid #000',
                                                        boxShadow: 24,
                                                        pt: 2,
                                                        px: 4,
                                                        pb: 3,
                                                    }}>
                                                        <Typography variant="h4" textAlign={'center'} paddingTop={3}
                                                                    marginBottom={2}>
                                                            Szczegóły pracownika
                                                        </Typography>
                                                        {workerData ? (
                                                            <div>
                                                                <Typography><b>Płeć:</b> {workerData.gender === "male" ? "Mężczyzna" : workerData.gender === "female" ? "Kobieta" : "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Wiek:</b> {workerData.age || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Opis:</b> {workerData.description || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Doświadczenie:</b> {workerData.experience || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Wykształcenie:</b> {workerData.education === "primary" ? "Podstawowe" : workerData.education === "secondary" ? "Średnie" : workerData.education === "bachelor" ? "Licencjat" : workerData.education === "master" ? "Magister" : workerData.education === "phd" ? "Doktor" : "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Preferowane
                                                                    wynagrodzenie:</b> {workerData.prefered_salary || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Preferowany styl
                                                                    pracy:</b> {workerData.prefered_style_of_work === "remote" ? "Zdalnie" : workerData.prefered_style_of_work === "office" ? "Stacjonarnie" : workerData.prefered_style_of_work === "hybrid" ? "Hybrydowo" : "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Imię:</b> {workerData?.user.first_name || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Nazwisko:</b> {workerData?.user.last_name || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Email:</b> {workerData?.user.email || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Miasto:</b> {workerData.city?.name || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Specjalizacja:</b> {workerData.specialization?.name || "Nie sprecyzowano"}
                                                                </Typography>
                                                                <Typography><b>Języki programowania:</b> </Typography>
                                                                {workerData.programming_languages?.length === 0 ? (
                                                                    <Typography>Nie sprecyzowano</Typography>
                                                                ) : (
                                                                    <ul>
                                                                        {workerData.programming_languages?.map((language) => (
                                                                            <li style={{
                                                                                fontSize: "1rem",
                                                                                fontWeight: '400',
                                                                                fontFamily: "Roboto,Helvetica,Arial,sans-serif"
                                                                            }}
                                                                                key={language.programming_languages}>{language.programming_languages} - {language.advanced === "beginner" ? "Junior" : language.advanced === "intermediate" ? "Mid" : language.advanced === "advanced" ? "Senior" : "Nie sprecyzowano"}</li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    fullWidth
                                                                    size="large"
                                                                    onClick={() => setOpenInvitation(true)}
                                                                    type="submit"
                                                                >Wyślij zaproszenie
                                                                </Button>
                                                                <Modal
                                                    open={openInvitation}
                                                    onClose={setOpenInvitation}
                                                    aria-labelledby="parent-modal-title"
                                                    aria-describedby="parent-modal-description"
                                                >
                                                    <Box sx={{
                                                        position: 'absolute' as 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: 350,
                                                        bgcolor: 'background.paper',
                                                        border: '2px solid #000',
                                                        boxShadow: 24,
                                                        pt: 2,
                                                        px: 4,
                                                        pb: 3,
                                                    }}>
                                                        <div>
                                                        <Typography variant="h5" textAlign={'center'} paddingTop={3}
                                                                    marginBottom={2}>
                                                            Wybierz datę zaproszenie
                                                        </Typography>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                                <DemoContainer components={['DateTimePicker']} >

                                                            {/* dodanie defaultowej daty dzisiejszej*/}
                                                          <DateTimePicker ampm={false} defaultValue={mindate} minDateTime={mindate} onChange={(newValue) => newValue && setDate(newValue.toDate())}/>
                                                          </DemoContainer>
                                                             </LocalizationProvider>
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    fullWidth
                                                                    size="large"
                                                                    onClick={() => sendInvitation(workerData?.id, date)}
                                                                    type="submit"
                                                                >Wyślij zaproszenie
                                                                </Button>
                                                            </div>
                                                    </Box>
                                                </Modal>
                                                            </div>
                                                        ) : (
                                                            <Typography variant="body1" textAlign={'center'}>
                                                                Brak danych o pracownikach
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Modal>
                        </>
                    ) : (
                        <Typography variant="body1" textAlign={'center'}>Nie znaleziono pracowników.</Typography>
                    )}
                </Grid>
            </Paper>
        </Grid>
    );
}

export default ListOfFavorites;
