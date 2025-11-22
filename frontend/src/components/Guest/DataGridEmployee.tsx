import React, {useEffect, useRef} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {DataGridWorkerProps, Worker} from '../../models/WorkerModel';
import axios from "axios";

function DataGridEmployee() {
    const columns : any = [{field: 'id', headerName: 'ID', width: 100, headerAlign: 'center'},
        {field: 'firstName', headerName: 'Imię', width: 200, headerAlign: 'center'},
        {field: 'lastName', headerName: 'Nazwisko', width: 200, headerAlign: 'center'},
        {field: 'city', headerName: 'Miasto', width: 200, headerAlign: 'center'},
        {field: 'age', headerName: 'Wiek', type: 'number', width: 100, headerAlign: 'center'},
        {field: 'gender', headerName: 'Płeć', width: 100, headerAlign: 'center'},
        {field: 'experience', headerName: 'Doświadczenie zawodowe w latach', width: 250, headerAlign: 'center'},
        {field: 'education', headerName: 'Wykształcenie', width: 200, headerAlign: 'center'},
        {field: 'prefered_salary', headerName: 'Preferowane zarobki (zł)', width: 200, headerAlign: 'center'},
        {field: 'prefered_style_of_work', headerName: 'Preferowany styl pracy', width: 200, headerAlign: 'center'},
        {field: 'specialization', headerName: 'Specializacja', width: 200, headerAlign: 'center'},];
        // {field: 'actions', headerName: 'Akcje', width: 200, headerAlign: 'center', renderCell: (params: any) => {
        //     return (
        //         <div>
        //             <button style={{marginRight: 10}} onClick={() => console.log(params.row.id)}>Szczegóły</button>
        //             <button onClick={() => console.log(params.row.id)}>Zaproszenie</button>
        //         </div>
        //     )}
        

    const [employees, setEmployees] = React.useState<DataGridWorkerProps[]>([]);

    const shouldLog = useRef(true);
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const fetchWorkersOnPageLoad = async () => {
                try {
                    const response = await axios.get<Worker[]>(`http://localhost:8000/api/workers/public/`);
                    for (const worker of response.data) {
                        
                        setEmployees(prevState => {
                            return [...prevState, {
                                id: worker.id,
                                firstName: worker.user.first_name,
                                lastName: worker.user.last_name,
                                city: worker.city?.name,
                                age: worker.age,
                                gender: worker.gender === "male" ? "Mężczyzna" : worker.gender === "female" ? "Kobieta" : "Inna",
                                experience: worker.experience || "-",
                                education: worker.education === "primary" ? "Podstawowe" : worker.education === "secondary" ? "Średnie" : worker.education === "bachelor" ? "Licencjat" : worker.education === "master" ? "Magister" : "Doktor" || "-",
                                prefered_salary: worker.prefered_salary || "-",
                                prefered_style_of_work: worker.prefered_style_of_work === "remote" ? "Zdalnie" : worker.prefered_style_of_work === "office" ? "Stacjonarnie" : "Hybrydowy" || "-",
                                specialization: worker.specialization?.name
                            }];
                        })
                    }
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {
                        
                    } else {
                        
                    }
                }
            };
            fetchWorkersOnPageLoad();
        }
    }, []);


    return (
    <Container sx={{mt:4, mb:4}}>
        <Typography variant={"h4"} align={"center"} gutterBottom={true} sx={{mb:4}}>
            Oferty pracowników
        </Typography>
    {employees ?
                (<DataGrid rows={employees} columns={columns}initialState={{     
                    columns: {       
                        columnVisibilityModel: { id: false,},    },  }}/>)
                :
                (<Typography variant="body1" textAlign={'center'}>Nie znaleziono pracowników.</Typography>)
            }
    </Container>
    );
}

export default DataGridEmployee;