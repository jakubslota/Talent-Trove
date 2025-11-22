import React, {useEffect, useRef, useState} from 'react';
import {Button, Grid, Paper, Typography} from "@mui/material";
import axios from "axios";
import {useAuthHeader, useAuthUser} from 'react-auth-kit';
import {DataGrid} from "@mui/x-data-grid";
import {DataGridInvitationsProps, ListOfRecruiterInvitations} from "../../models/RecruiterModel";
import {message} from "antd";

type Invitation = {
    status: string;
}

function ListOfInvitations() {
    const authUser = useAuthUser();
    const authHeader = useAuthHeader();
    const recruiter_id = authUser()?.user_role_id;

    type invitation = {
        status: string;
    }

    const columns: any = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center' },
        { field: 'first_name', headerName: 'Imię', width: 200, headerAlign: 'center' },
        { field: 'last_name', headerName: 'Nazwisko', width: 200, headerAlign: 'center' },
        { field: 'company_name', headerName: 'Firma', width: 200, headerAlign: 'center' },
        { field: 'status', headerName: 'Status', width: 250, headerAlign: 'center' },
        { field: 'date', headerName: 'Data', width: 200, headerAlign: 'center' },
        {
            field: 'canceled',
            headerName: 'Odrzuć',
            width: 200,
            headerAlign: 'center',
            renderCell: (params: any) => (
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleStatus(params.row.id, "canceled")}
                    disabled={params.row.status !== 'Zaakceptowane' && params.row.status !== "Nowe"} // Disable if status is not 'new'
                >
                    Odrzuć
                </Button>
            )
        },
        {
            field: 'done',
            headerName: 'Zakończ',
            width: 200,
            headerAlign: 'center',
            renderCell: (params: any) => (
                <Button
                    variant="contained"
                    color='success'
                    onClick={() => handleStatus(params.row.id, "done")}
                    disabled={params.row.status !== 'Zaakceptowane'} // Disable if status is not 'new'
                >
                    Zakończ
                </Button>
            )
        },
    ];

    const handleStatus = async (id: number, values: string) => {
        let status: invitation = {
            status: values
        };

        try {
            const response = await axios.put(`http://localhost:8000/api/invitations/${id}/`, status,{ headers: { 'Authorization': authHeader() }});
            
            for (const inv of invitations) {
                if (inv.id === id) {
                    inv.status = values === "canceled" ? "Anulowane" : "Zakończone";
                    setInvitations([...invitations]);
                }
            }
message.success("Pomyślnie zmieniono status!", 2)
        } catch (error: any) {
            if (error.response !== undefined) {
                for (let [key, value] of Object.entries(error.response.data)) {
                        message.error(`${value}`, 4);
                }
            }
    }
    }

    const [invitations, setInvitations] = useState<DataGridInvitationsProps[]>([]);

    const shouldLog = useRef(true);
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const fetchInvitationsOnPageLoad = async () => {
                try {
                    const response = await axios.get<ListOfRecruiterInvitations[]>(`http://localhost:8000/api/invitations/recruiters/${recruiter_id}`,{ headers: { 'Authorization': authHeader() }});
                    for (const invitation of response.data) {
                        setInvitations(prevState => [...prevState, {
                            id: invitation.id,
                            first_name: invitation.worker.user.first_name,
                            last_name: invitation.worker.user.last_name,
                            company_name: invitation.recruiter.company_name,
                            status: invitation.status === "new" ? "Nowe" : invitation.status === "accepted" ? "Zaakceptowane" : invitation.status === "rejected" ? "Odrzucone" : invitation.status === "canceled" ? "Anulowane" : invitation.status === "done" ? "Zakończone" : "Nieznany",
                            date: invitation.date.toString().substring(0, 16).replace("T", " "),
                        }]);
                    }
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {
                        
                    } else {
                        
                    }
                }
            };
            fetchInvitationsOnPageLoad();
        }
    }, []);

    return (
        <Grid justifyContent="center" alignItems="center" width={"100%"}>
            <Paper elevation={10}>
                <Grid>
                    <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>Lista zaproszeń</Typography>
                    {invitations && invitations.length > 0 ? (
                        <DataGrid rows={invitations} columns={columns} initialState={{     
                            columns: {       
                                columnVisibilityModel: { id: false,},    },  }} />
                    ) : (
                        <Typography variant="body1" textAlign={'center'}>No invitations found.</Typography>
                    )}
                </Grid>
            </Paper>
        </Grid>
    );
}
export default ListOfInvitations;