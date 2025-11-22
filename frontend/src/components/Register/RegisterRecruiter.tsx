import React from 'react';
import {Grid, Paper, TextField, Typography} from "@mui/material";
import LOGO from "../../images/logoVertical.png"
import Button from "@mui/material/Button";
import {useFormik} from "formik";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {message} from "antd";

function RegisterWorker() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      last_name: "",
      first_name: "",
      company_name: ""
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      // Validation for username
      if (!values.username) {
        errors.username = "Wymagane";
      } else if (values.username.length < 3) {
        errors.username = "Nazwa użytkownika musi mieć co najmniej 3 znaki";
      } else if (values.username.length > 150) {
        errors.username = "Nazwa użytkownika musi mieć mniej niż 150 znaków";
      }

      // Validation for email
      if (!values.email) {
        errors.email = "Wymagane";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Niepoprawny adres email";
      } else if (values.email.length > 254) {
        errors.email = "Email musi mieć mniej niż 254 znaków";
      }

      // Validation for password
      if (!values.password) {
        errors.password = "Wymagane";
      } else if (values.password.length < 8) {
        errors.password = "Hasło musi mieć co najmniej 8 znaków";
      } else if (values.password.length > 128) {
        errors.password = "Hasło musi mieć mniej niż 128 znaków";
      }

      // Validation for first name
      if (!values.first_name) {
        errors.first_name = "Wymagane";
      } else if (values.first_name.length < 2) {
        errors.first_name = "Imię musi mieć co najmniej 2 znaki";
      } else if (values.first_name.length > 30) {
        errors.first_name = "Imię musi mieć mniej niż 30 znaków";
      }

      // Validation for last name
      if (!values.last_name) {
        errors.last_name = "Wymagane";
      } else if (values.last_name.length < 2) {
        errors.last_name = "Nazwisko musi mieć co najmniej 2 znaki";
      } else if (values.last_name.length > 150) {
        errors.last_name = "Nazwisko musi mieć mniej niż 150 znaków";
      }

      // Validation for company name
      if (!values.company_name) {
        errors.company_name = "Wymagane";
      } else if (values.company_name.length < 3) {
        errors.company_name = "Nazwa firmy musi mieć co najmniej 3 znaki";
      } else if (values.company_name.length > 150) {
        errors.company_name = "Nazwa firmy musi mieć mniej niż 150 znaków";
      }

      return errors;
    },
    onSubmit: async (values) => {
      
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/register/recruiter/",
          values
        );

        message.success("Pomyślnie zarejestrowano rekrutera!", 2)
          navigate("/"); // Navigate to the home page after the user has successfully logged in.
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
      <Paper style={styles.paper}>
        <Grid>
          <img src={LOGO} alt="logo" width={'160px'} height={'130px'} style={styles.img} />
          <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>Rejestracja</Typography>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Nazwa użytkownika"
            placeholder="Nazwa użytkownika"
            fullWidth
            required
            margin={"dense"}
            name={'username'}
            onChange={formik.handleChange}
            value={formik.values.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            label="Email"
            placeholder="Email"
            fullWidth
            required
            margin={'dense'}
            name={'email'}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Hasło"
            placeholder="Hasło"
            fullWidth
            required
            margin={'dense'}
            type={'password'}
            name={'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            label="Imię"
            placeholder="Imię"
            fullWidth
            required
            margin={'dense'}
            name={'first_name'}
            value={formik.values.first_name}
            onChange={formik.handleChange}
            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
          <TextField
            label="Nazwisko"
            placeholder="Nazwisko"
            fullWidth
            required
            margin={'dense'}
            name={'last_name'}
            value={formik.values.last_name}
            onChange={formik.handleChange}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
          />
          <TextField
            label="Nazwa firmy"
            placeholder="Nazwa firmy"
            fullWidth
            required
            margin={'dense'}
            name={'company_name'}
            value={formik.values.company_name}
            onChange={formik.handleChange}
            error={formik.touched.company_name && Boolean(formik.errors.company_name)}
            helperText={formik.touched.company_name && formik.errors.company_name}
          />

          <Button variant="contained" color="secondary" fullWidth size={"large"} sx={{ marginTop: 2 }} type={'submit'}>
            Zarejestruj się
          </Button>
          <Typography textAlign={'center'} paddingTop={3}>Masz już konto? <a href={'/login'}>Zaloguj się</a></Typography>
        </form>
      </Paper>
    </Grid>
  );
}

export default RegisterWorker;

const styles = {
  paper: {
    padding: 20,
    width: 400,
  },
  img: {
    display: 'block',
    margin: 'auto'
  }
}