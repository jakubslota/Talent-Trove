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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {useFormik} from "formik";
import axios from "axios";
import {useAuthUser} from 'react-auth-kit';
import {City, ProgrammingLanguage, Specialization} from "../../models/WorkerModel";
import {message} from "antd";
import {useAuthHeader} from 'react-auth-kit';


interface CheckboxValues {
    checkboxPreferedSalary: boolean;
    checkboxExperience: boolean;
    checkboxSpecialization: boolean;
    checkboxEducation: boolean;
    checkboxStyleOfWork: boolean;
    checkboxDescription: boolean;
}

function RegisterInfoWorker() {
    const [listOfCities, setListOfCities] = useState<City[]>();
    const [listOfSpecializations, setListOfSpecializations] = useState<Specialization[]>();
    const [listOfProgrammingLanguages, setListOfProgrammingLanguages] = useState<ProgrammingLanguage[]>();
    const authUser = useAuthUser();
    const authHeader = useAuthHeader();

    const [checkboxValues, setCheckboxValues] = useState<CheckboxValues>({
        checkboxPreferedSalary: false,
        checkboxExperience: false,
        checkboxSpecialization: false,
        checkboxEducation: false,
        checkboxStyleOfWork: false,
        checkboxDescription: false,
    });

    const handleCheckboxChange = (checkboxName: keyof CheckboxValues) => {
        setCheckboxValues((prev) => ({
            ...prev,
            [checkboxName]: prev[checkboxName] === false ? true : false,
        }));
    };

    const convertCheckboxValuesToBinary = (checkboxValues: CheckboxValues): string => {
        const binaryValues = Object.values(checkboxValues).map((value) => (value === true ? '1' : '0'));
        return binaryValues.join('');
    };

    

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

            fetchCitiesOnPageLoad();
            fetchSpecializationsOnPageLoad();
            fetchProgrammingLanguagesOnPageLoad();
        }
        }, []);

    const formik = useFormik({
        initialValues: {
            gender: "",
            age: null,
            description: "",
            experience: null,
            education: "",
            prefered_salary: null,
            prefered_style_of_work: "",
            account_visibility: false,
            field_visibility: 1234,
            user: authUser()?.user_id,
            city: null,
            specialization: null
        },
        validate: (values) => {
            const errors: Record<string, string | number | boolean> = {};

            if (values.age && (values.age < 18 || values.age > 70)) {
                errors.age = 'Wiek musi być większy niż 18 i mniejszy niż 70 lat.';
            }

            if (values.experience && (values.experience <= 0 || values.experience > 50)) {
                errors.experience = 'Doświadczenie musi być większe niż 0 i mniejsze niż 50 lat.';
            }
            if (values.description && values.description.length > 500) {
                errors.description = 'Opis nie może być dłuższy niż 500 znaków.';
            }
            if (values.prefered_salary && isNaN(values.prefered_salary)) {
                errors.prefered_salary = 'Wynagrodzenie musi być liczbą.';
            }
            else if (values.prefered_salary && (values.prefered_salary < 3000 || values.prefered_salary > 1000000)) {
                errors.prefered_salary = 'Wynagrodzenie musi być większe niż 3 000 i mniejsze niż 1 000 000 zł.';
            }

            return errors;
        },
        onSubmit: async (values: any) => {
            // const foundCity = listOfCities?.find((city) => city.id === values.city);
            // values.city = foundCity;
            // const foundSpecialization = listOfSpecializations?.find((spec) => spec.id === values.specialization);
            // values.specialization = foundSpecialization;
            // values.user = formik.initialValues.user;
            const user_role_id = authUser()?.user_role_id;
            

            const binaryValues: string = convertCheckboxValuesToBinary(checkboxValues);
            

            values.field_visibility = binaryValues;

            try {
                const response = await axios.put(`http://localhost:8000/api/workers/${user_role_id}/`, values,{ headers: { 'Authorization': authHeader() }});
                //navigate("/");
                message.success("Pomyślnie zaktualizowano dane!", 2)
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

        <Grid container justifyContent="center" alignItems="center">
            <Paper elevation={10} style={styles.paper}>
                <Grid>
                    <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>Uzupełnij swoje
                        dane</Typography>
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
                        helperText={
                            formik.touched.prefered_salary &&
                            String(formik.errors.prefered_salary)
                          }
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
                        type="number"
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
                        <MenuItem value={'primary'}>Podstawowe</MenuItem>
                        <MenuItem value={'secondary'}>Średnie</MenuItem>
                        <MenuItem value={'bachelor'}>Licencjat</MenuItem>
                        <MenuItem value={'master'}>Magister</MenuItem>
                        <MenuItem value={'phd'}>Doktor</MenuItem>
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

                    <FormLabel component="legend" id="demo-radio-group-label">
                        Płeć
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-group-label"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                    >
                        <FormControlLabel value="female" control={<Radio/>} label="Kobieta"/>
                        <FormControlLabel value="male" control={<Radio/>} label="Mężczyzna"/>
                        <FormControlLabel value="other" control={<Radio/>} label="Inna"/>
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
                        <MenuItem value={'office'}>Stacjonary</MenuItem>
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
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && String(formik.errors.description)}
                    />
                    <InputLabel id="demo-simple-select-label">Które pola mają być publiczne?</InputLabel>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Wynagrodzenie</TableCell>
                                    <TableCell>Staż pracy</TableCell>
                                    <TableCell>Specjalizacja</TableCell>
                                    <TableCell>Wykształcenie</TableCell>
                                    <TableCell>Styl pracy</TableCell>
                                    <TableCell>Opis</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            checked={checkboxValues.checkboxPreferedSalary}
                                            onChange={() => handleCheckboxChange('checkboxPreferedSalary')}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={checkboxValues.checkboxExperience}
                                            onChange={() => handleCheckboxChange('checkboxExperience')}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={checkboxValues.checkboxSpecialization}
                                            onChange={() => handleCheckboxChange('checkboxSpecialization')}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={checkboxValues.checkboxEducation}
                                            onChange={() => handleCheckboxChange('checkboxEducation')}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={checkboxValues.checkboxStyleOfWork}
                                            onChange={() => handleCheckboxChange('checkboxStyleOfWork')}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={checkboxValues.checkboxDescription}
                                            onChange={() => handleCheckboxChange('checkboxDescription')}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained" color="secondary" fullWidth size={"large"} sx={{marginTop: 2}}
                            type={'submit'}>
                        Zapisz
                    </Button>
                </form>
            </Paper>
        </Grid>
    );
}

export default RegisterInfoWorker;

const styles = {
    paper: {
        margin: '20px',
        padding: '10px',
        width: 'auto',
    },
    img: {
        display: 'block',
        margin: 'auto'
    }
}