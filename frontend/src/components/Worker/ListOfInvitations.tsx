import React, {useEffect, useRef, useState} from 'react';
import {Button, Grid, Paper, Typography} from "@mui/material";
import axios from "axios";
import {useAuthUser,useAuthHeader} from 'react-auth-kit';
import {DataGrid} from "@mui/x-data-grid";
import {message} from "antd";

type Invitation = {
    status: string;
};

const ListOfInvitations: React.FC = () => {
    const [invitations, setInvitations] = useState<any[]>([]);

    const authUser = useAuthUser();
    const role_id = authUser()?.user_role_id;
    const authHeader = useAuthHeader();
    const shouldLog = useRef(true);
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const fetchInvitationsOnPageLoad = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/invitations/workers/${role_id}`,{ headers: { 'Authorization': authHeader() }});
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
                        message.error(err.response?.data.detail, 4);
                    } else {
                        message.error("Wystąpił błąd: " + err, 4);
                    }
                }
            };

            fetchInvitationsOnPageLoad();
        }
        }, [role_id]);

    const handleAccept = async (id: number, values: string) => {
        const status: Invitation = {
            status: values,
        };

        try {
            await axios.put(`http://localhost:8000/api/invitations/${id}/`, status,{ headers: { 'Authorization': authHeader() }});

            const updatedInvitations = invitations.map((inv: any) => {
                if (inv.id === id) {
                    return {
                        ...inv,
                        status: values === "accepted" ? "Akceptowane" : "Odrzucone",
                    };
                }
                return inv;
            });

            setInvitations(updatedInvitations);
            message.success("Pomyślnie zaktualizowano status zaproszenia!", 4);
        } catch (error: any) {
            if (error.response !== undefined) {
                for (let [key, value] of Object.entries(error.response.data)) {
                    message.error(`${value}`, 4);
                }
            }
        }
    };

    const dynamicStatusHeader = invitations.length > 0 ? invitations[0].status : "Status";

    const columns: any = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center'  },
        { field: 'company_name', headerName: 'Firma', width: 200, headerAlign: 'center' },
        { field: 'status', headerName: dynamicStatusHeader, width: 250, headerAlign: 'center' },
        { field: 'date', headerName: 'Data', width: 200, headerAlign: 'center' },
        {
            field: 'accepted',
            headerName: 'Akceptuj',
            width: 200,
            headerAlign: 'center',
            renderCell: (params: any) => (
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAccept(params.row.id, "accepted")}
                    disabled={params.row.status !== 'Nowe'} // Disable if status is not 'new'
                >
                    Akceptuj
                </Button>
            ),
        },
        {
            field: 'rejected',
            headerName: 'Odrzuć',
            width: 200,
            headerAlign: 'center',
            renderCell: (params: any) => (
                <Button
                    variant="contained"
                    color='error'
                    onClick={() => handleAccept(params.row.id, "rejected")}
                    disabled={params.row.status !== 'Nowe'} // Disable if status is not 'new'
                >
                    Odrzuć
                </Button>
            ),
        },
    ];

    return (
        <Grid justifyContent="center" alignItems="center" width={"100%"}>
            <Paper elevation={10}>
                <Grid>
                    <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>
                        Lista zaproszeń
                    </Typography>
                    {invitations && invitations.length > 0 ? (
                        <DataGrid rows={invitations} columns={columns }
                        initialState={{     
                            columns: {       
                                columnVisibilityModel: { id: false,},    },  }} />
                    ) : (
                        <Typography variant="body1" textAlign={'center'}>
                            Nie znaleziono zaproszeń.
                        </Typography>
                    )}
                </Grid>
            </Paper>
        </Grid>
    );
};

export default ListOfInvitations;