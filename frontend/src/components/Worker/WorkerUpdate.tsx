import React, {useEffect, useRef, useState} from 'react';
import {
    Checkbox,
    FormControlLabel,
    FormLabel,
    Grid,
    InputLabel,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {useFormik} from "formik";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {City, ProgrammingLanguage, Specialization, Worker} from "../../models/WorkerModel";
import {message} from "antd";
import {useAuthHeader} from "react-auth-kit"


function WorkerUpdate() {
    const navigate = useNavigate();
    const [listOfCities, setListOfCities] = useState<City[]>();
    const [listOfSpecializations, setListOfSpecializations] = useState<Specialization[]>();
    const [listOfProgrammingLanguages, setListOfProgrammingLanguages] = useState<ProgrammingLanguage[]>();
    const [workerData, setWorker] = useState<Worker>();
    const authHeader = useAuthHeader();
    const { id } = useParams();

    const shouldLog = useRef(true);
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const fetchCitiesOnPageLoad = async () => {
                try {
                    const response = await axios.get<City[]>("http://localhost:8000/api/cities/",{ headers: { 'Authorization': authHeader() }});
                    setListOfCities(response.data);
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {

                    } else {

                    }
                }
            };

            const fetchSpecializationsOnPageLoad = async () => {
                try {
                    const response = await axios.get<Specialization[]>("http://localhost:8000/api/specializations/",{ headers: { 'Authorization': authHeader() }});
                    setListOfSpecializations(response.data);
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {

                    } else {

                    }
                }
            };

            const fetchProgrammingLanguagesOnPageLoad = async () => {
                try {
                    const response = await axios.get<ProgrammingLanguage[]>("http://localhost:8000/api/programming-languages/",{ headers: { 'Authorization': authHeader() }});
                    setListOfProgrammingLanguages(response.data);
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {

                    } else {

                    }
                }
            };
            const fetchWorkersOnPageLoad = async () => {
                try {
                    const response = await axios.get<Worker>(`http://localhost:8000/api/workers/${id}`,{ headers: { 'Authorization': authHeader() }});
                    setWorker(response.data);
                } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {

                    } else {

                    }
                }
            };

            fetchWorkersOnPageLoad();
            fetchCitiesOnPageLoad();
            fetchSpecializationsOnPageLoad();
            fetchProgrammingLanguagesOnPageLoad();
        }
        }, [id]);

    const formik = useFormik({
        initialValues: {
            gender: workerData?.gender || "",
            age: workerData?.age || null,
            description: workerData?.description || "",
            experience: workerData?.experience || null,
            education: workerData?.education || "",
            prefered_salary: workerData?.prefered_salary || null,
            prefered_style_of_work: workerData?.prefered_style_of_work || "",
            account_visibility: workerData?.account_visibility || false,
            field_visibility: 1234,
            user: id,
            city: workerData?.city || null,
            specialization: workerData?.specialization || null
        },
        validate: (values) => {
            const errors: Record<string, string | number | boolean> = {};

            if (values.age && (values.age < 18 || values.age > 70)) {
                errors.age = 'Wiek musi być większy niż 18 i mniejszy niż 70 lat.';
            }

            if (values.experience && (values.experience <= 0 || values.experience > 50)) {
                errors.experience = 'Doświadczenie musi być większe niż 0 i mniejsze niż 50 lat.';
            }

            if (values.prefered_salary && (values.prefered_salary < 3000 || values.prefered_salary > 1000000)) {
                errors.prefered_salary = 'Wynagrodzenie musi być większe niż 3 000 i mniejsze niż 1 000 000 zł.';
            }

            return errors;
        },
        onSubmit: async (values: any) => {
            
            try {
                const response = await axios.put(`http://localhost:8000/api/workers/${id}/`, values);
                //navigate("/");
                message.success("Pomyślnie zaktualizowano dane pracownika!", 2)
            } catch (error: any) {
                if (error.response !== undefined) {
                    for (let [key, value] of Object.entries(error.response.data)) {
                        message.error(`${value}`, 4);
                    }
                }
            }
        },
    });

    return (
        <Grid justifyContent="center" alignItems="center" width={"100%"}>
            <Paper elevation={10}>
                <Grid>
                    <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>Witaj pracowniku!</Typography>
                    <Typography variant="h6" textAlign={'center'} paddingTop={3} marginBottom={2}>Dziękujemy za stworzenie konta pracowniczego, aby móc przejść dalej uzupełnij swoje dodatkowe informacje</Typography>
                </Grid>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        label="Preferowane wynagrodzenie"
                        placeholder="Preferowane wynagrodzenie"
                        fullWidth
                        required
                        margin={"dense"}
                        name={'prefered_salary'}
                        onChange={formik.handleChange}
                        value={formik.values.prefered_salary}
                        error={formik.touched.prefered_salary && Boolean(formik.errors.prefered_salary)}
                        helperText={formik.touched.prefered_salary && String(formik.errors.prefered_salary)}
                    />
                    <TextField
                        label="Wiek"
                        placeholder="wiek"
                        fullWidth
                        type="number"
                        required
                        margin={"dense"}
                        name={'age'}
                        onChange={formik.handleChange}
                        value={formik.values.age}
                        error={formik.touched.age && Boolean(formik.errors.age)}
                        helperText={formik.touched.age && String(formik.errors.age)}
                    />
                    <TextField
                        label="Staż pracy w latach"
                        placeholder="Staż pracy w latach"
                        fullWidth
                        required
                        margin={'dense'}
                        name={'experience'}
                        onChange={formik.handleChange}
                        value={formik.values.experience}
                        error={formik.touched.experience && Boolean(formik.errors.experience)}
                        helperText={formik.touched.experience && String(formik.errors.experience)}
                    />
                    <InputLabel id="miasto-label">Miasto</InputLabel>
                    <Select
                        label="Miasto"
                        name="city"
                        required
                        fullWidth
                        onChange={formik.handleChange}
                        value={formik.values.city}
                    >
                        {listOfCities &&
                            listOfCities.map((city) => (
                                <MenuItem key={city.id} value={city.id}>
                                    {city.name}
                                </MenuItem>
                            ))}
                    </Select>
                    <InputLabel id="specjalizacja-label">Specjalizacja</InputLabel>
                    <Select
                        label="Specjalizacja"
                        name="specialization"
                        required
                        fullWidth
                        onChange={formik.handleChange}
                        value={formik.values.specialization}
                    >
                        {listOfSpecializations &&
                            listOfSpecializations.map((specialization) => (
                                <MenuItem key={specialization.id} value={specialization.id}>
                                    {specialization.name}
                                </MenuItem>
                            ))}
                    </Select>

                    <InputLabel id="demo-simple-select-label">Wykształcenie</InputLabel>
                    <Select
                        label="Wykształcenie"
                        name={'education'}
                        required
                        fullWidth
                        onChange={formik.handleChange}
                        value={formik.values.education}
                    >
                        <MenuItem value={'primary'}>podstawowe</MenuItem>
                        <MenuItem value={'secondary'}>średnie</MenuItem>
                        <MenuItem value={'higher'}>wyższe</MenuItem>
                    </Select>

                    <FormLabel id="demo-checkbox-group-label">Widoczność konta</FormLabel>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formik.values.account_visibility}
                                onChange={formik.handleChange}
                                name="account_visibility"
                                color="primary"
                            />
                        }
                        label="widoczne"
                    />

                    <FormLabel id="demo-radio-group-label">
                        Płeć
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-group-label"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                    >
                        <FormControlLabel value="female" control={<Radio />} label="Kobieta" />
                        <FormControlLabel value="male" control={<Radio />} label="Mężczyzna" />
                    </RadioGroup>

                    <InputLabel id="demo-simple-select-label">Preferowany styl pracy</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Preferowany styl pracy"
                        name={'prefered_style_of_work'}
                        required
                        fullWidth
                        onChange={formik.handleChange}
                        value={formik.values.prefered_style_of_work}
                    >
                        <MenuItem value={'stationary'}>Stacjonary</MenuItem>
                        <MenuItem value={'remote'}>Zdalny</MenuItem>
                        <MenuItem value={'hybrid'}>Hybrydowy</MenuItem>
                    </Select>
                    <TextField
                        id="outlined-textarea"
                        fullWidth
                        label="Opis"
                        multiline
                        margin={'dense'}
                        required
                        name={'description'}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                    />
                    <Button variant="contained" color="secondary" fullWidth size={"large"} sx={{ marginTop: 2 }} type={'submit'}>
                        Dalej
                    </Button>
                </form>
            </Paper>
        </Grid>
    );
}

export default WorkerUpdate;

const styles = {
    paper: {
        padding: 20,
        width: 400,
        margin: '30px auto',
    },
    img: {
        display: 'block',
        margin: 'auto'
    }
}