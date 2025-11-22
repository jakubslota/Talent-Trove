import React, {useEffect, useRef, useState} from 'react';
import {Box, Grid, Modal, Paper, Typography} from "@mui/material";
import axios from "axios";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Button from "@mui/material/Button";
import {useAuthHeader, useAuthUser} from 'react-auth-kit';
import {DataGridWorkerProps, FavouriteWorker, Worker} from "../../models/WorkerModel";
import {DetailsOutlined} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import {message} from "antd";


function ListOfWorkers() {
    const [open, setOpen] = React.useState(false);
    const authUser = useAuthUser();
    const authHeader = useAuthHeader();
    const [workerData, setWorker] = useState<Worker>();
    const [listOfWorkers, setListOfWorkers] = useState<Worker[]>();
    const [ListOfIds, setListOfIds] = useState<number[]>([]);

    const columns: any = [{field: 'id', headerName: 'ID', width: 100, headerAlign: 'center'},
        {field: 'firstName', headerName: 'Imię', width: 200, headerAlign: 'center'},
        {field: 'lastName', headerName: 'Nazwisko', width: 200, headerAlign: 'center'},
        {field: 'city', headerName: 'Miasto', width: 200, headerAlign: 'center'},
        {field: 'experience', headerName: 'Doświadczenie zawodowe w latach', width: 250, headerAlign: 'center'},
        {field: 'prefered_style_of_work', headerName: 'Preferowany styl pracy', width: 200, headerAlign: 'center'},
        {field: 'specialization', headerName: 'Specializacja', width: 200, headerAlign: 'center'},
        {
            field: 'follow', headerName: 'Obserwuj', width: 200, headerAlign: 'center', renderCell: (params: any) => {
                return (
                    !(ListOfIds.includes(params.row.id)) ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                size="large"
                                onClick={() => handleFollow(params.row.id)}
                                type="submit"
                            >
                                <FavoriteBorderIcon/>
                            </Button>
                        ) :
                        (<FavoriteIcon/>)
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

            const response = await axios.post(
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
        listOfWorkers?.forEach((worker) => {
            if (worker.id === worker_id) {
                setWorker(worker);
            }
        })
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [employees, setEmployees] = React.useState<DataGridWorkerProps[]>([]);

    const shouldLog = useRef(true);
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const fetchWorkersOnPageLoad = async () => {
                try {
                    const response = await axios.get<Worker[]>("http://localhost:8000/api/workers/",{ headers: { 'Authorization': authHeader() }});
                    for (const worker of response.data) {
                        
                        setEmployees(prevState => {
                            return [...prevState, {
                                id: worker.id,
                                firstName: worker.user.first_name,
                                lastName: worker.user.last_name,
                                city: worker.city?.name || "Nie sprecyzowano",
                                age: worker.age || "Nie sprecyzowano",
                                gender: worker.gender === "male" ? "Mężczyzna" : worker.gender === "female" ? "Kobieta" : worker.gender === "other" ? "Inna" : "Nie sprecyzowano",
                                experience: worker.experience || "Nie sprecyzowano",
                                education: worker.education === "primary" ? "Podstawowe" : worker.education === "secondary" ? "Średnie" : worker.education === "bachelor" ? "Licencjat" : worker.education === "master" ? "Magister" : worker.education === "phd" ? "Doktor" : "Nie sprecyzowano",
                                prefered_salary: worker.prefered_salary || "Nie sprecyzowano",
                                prefered_style_of_work: worker.prefered_style_of_work === "remote" ? "Zdalnie" : worker.prefered_style_of_work === "office" ? "Stacjonarnie" : worker.prefered_style_of_work === "office" ? "Hybrydowo" : "Nie sprecyzowano",
                                specialization: worker.specialization?.name || "Nie sprecyzowano",
                            }];
                        })
                    }
                    setListOfWorkers(response.data);
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {
                        
                    } else {
                        
                    }
                }
            }

            const fetchFavoriteWorkersOnPageLoad = async () => {
                try {
                    const recruiter_id = authUser()?.user_role_id;
                    const response = await axios.get<FavouriteWorker[]>(
                        `http://localhost:8000/api/favorites/recruiters/${recruiter_id}`,{ headers: { 'Authorization': authHeader() }}
                    );

                    setListOfIds(response.data.map(favWorker => favWorker.worker.id));
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {
                        
                    } else {
                        
                    }
                }
            };

            fetchFavoriteWorkersOnPageLoad();
            fetchWorkersOnPageLoad();
        }
    }, []);

    async function handleFollow(worker: number) {
        try {
            const recruiter = authUser()?.user_role_id;
            
            const response = await axios.post(
                'http://localhost:8000/api/favorites/create/',
                {worker, recruiter},{ headers: { 'Authorization': authHeader() }}
            );
            handleTableRefresh();
            message.success("Pomyślnie zaobserwowano!", 2)
        } catch (error: any) {
            if (error.response !== undefined) {
                for (let [key, value] of Object.entries(error.response.data)) {
                        message.error(`${value}`, 4);
                }
            }
    }
    }

    const fetchData = async () => {
        try {
            const response = await axios.get<Worker[]>("http://localhost:8000/api/workers/",{ headers: { 'Authorization': authHeader() }});
            setListOfWorkers(response.data);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }

        try {
            const recruiter_id = authUser()?.user_role_id;
            const response = await axios.get<FavouriteWorker[]>(
                `http://localhost:8000/api/favorites/recruiters/${recruiter_id},`,{ headers: { 'Authorization': authHeader() }}
            );

            setListOfIds(response.data.map(favWorker => favWorker.worker.id));
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleTableRefresh = () => {
        fetchData();
    };


    return (

        <Grid justifyContent="center" alignItems="center" width={"100%"} >
<Paper elevation={10}>
                <Grid>
                    <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>Lista
                        pracowników</Typography>
                    {listOfWorkers && listOfWorkers.length > 0 ? (
                        <>
                    <DataGrid rows={employees} columns={columns} pageSizeOptions={[3, 10, 25]} initialState={{
                            columns: {       
                                columnVisibilityModel: { id: false,},    },
                    pagination: { paginationModel: { pageSize: 3 } },}}/>
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
                                                                        <li style={{fontSize: "1rem", fontWeight: '400', fontFamily: "Roboto,Helvetica,Arial,sans-serif"}}
                                                                            key={language.programming_languages}>{language.programming_languages} - {language.advanced=== "beginner" ? "Junior" : language.advanced === "intermediate" ? "Mid" : language.advanced === "advanced" ? "Senior" : "Nie sprecyzowano"}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
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
                        <Typography variant="body1" textAlign={'center'}>Nie znaleziono pracownikóws.</Typography>
                    )}
                </Grid></Paper>
        </Grid>
    );
}

export default ListOfWorkers;
