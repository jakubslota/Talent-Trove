import React, {useEffect, useRef, useState} from 'react';
import {Grid, Paper, Typography} from "@mui/material";
import axios from "axios";
import {useAuthUser} from 'react-auth-kit';
import {Worker} from "../../models/WorkerModel";
import {useAuthHeader} from 'react-auth-kit';

function WorkerDetails() {
    // const navigate = useNavigate();
    // const authHeader = useAuthHeader();

    const [workerData, setWorker] = useState<Worker>();
    const authUser = useAuthUser();
    const userr = authUser()?.user_role_id;
    const shouldLog = useRef(true);
    const authHeader = useAuthHeader();
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
        const fetchWorkersOnPageLoad = async () => {
            try {
                const response = await axios.get<Worker>(`http://localhost:8000/api/workers/${userr}/`,{ headers: { 'Authorization': authHeader() }});
                setWorker(response.data);
            }
            catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    
                } else {
                    
                }
            }
        };

        fetchWorkersOnPageLoad();
      }
    }, []);

    return (
        <Grid container justifyContent="center" alignItems="center">
          <Paper elevation={10} style={styles.paper}>
            <Grid>
              <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>
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
                  </div>
              ) : (
                   <Typography variant="body1" textAlign={'center'}>
                                                            Brak danych o pracowniku
                                                        </Typography>
              )}
            </Grid>
          </Paper>
        </Grid>
    );
};

const styles = {
    paper: {
        padding: 20,
        width: 'auto',
        margin: '30px auto',
    },
    workerDetailsContainer: {
        margin: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    separator: {
        margin: '10px 0',
        border: '1px solid #ccc',
    },
};


export default WorkerDetails;