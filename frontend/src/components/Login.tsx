import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {useFormik} from "formik";
import axios from "axios";
import {useSignIn} from "react-auth-kit";
import {Grid, Paper, TextField} from "@mui/material";
import LOGO from "../images/logoVertical.png"
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {jwtDecode} from "jwt-decode";
import {useNavigation} from '../context/navigations';
import {message} from "antd";

export interface JwtPayload {
  role: string;
  user_role_id: number,
  user_id: number,
}

function Login(props: any) {
    const signIn = useSignIn();
    const navigateToHome = useNavigation();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values: any) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/token/",
          values
        );
        
        
        const decodedToken = jwtDecode<JwtPayload>(response.data.access);
        const authState = {
          user_role_id: decodedToken.user_role_id,
          user_id: decodedToken.user_id,
          role: decodedToken.role,
        }
        signIn({
          token: response.data.access,
          expiresIn: 5,
          tokenType: "Bearer",
          authState: authState,
          refreshToken: response.data.refresh,
          refreshTokenExpireIn: 89 * 24 * 60
        });
        message.success("Pomyślnie zalogowano!", 2)
        navigateToHome();
        window.localStorage.setItem("user_id", '' + decodedToken.user_id);        
      } catch (error: any) {
            if (error.response !== undefined) {
                for (let [, value] of Object.entries(error.response.data)) {
                    if (value === "No active account found with the given credentials") {
                        message.error('Nie znaleziono użytkownika o podanych danych!', 4);
                    }
                    else {
                        message.error(`${value}`, 4);
                    }
                }
            }
    }
    },
  });

  return (
    //
      <Grid container justifyContent='center' alignItems='center' height='90vh'>
        <Paper elevation={10} style={styles.paper}>
          <Grid paddingTop={5}>
              <img src={LOGO} alt="logo" width={'160px'} height={'130px'} style={styles.img}/>
            <Typography variant="h4" textAlign={'center'} paddingTop={3} marginBottom={2}>Logowanie</Typography>
          </Grid>
            <form onSubmit={formik.handleSubmit} method={'post'}>
            <TextField
                label="Nazwa użytkownika"
                placeholder="Nazwa użytkownika"
                fullWidth
                required
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                margin="normal"
            />
            <TextField
                label="Hasło"
                placeholder="Hasło"
                fullWidth
                type={"password"}
                required
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                margin="normal"
            />
            <Button variant="contained" color="secondary" fullWidth type={'submit'} size={"large"} sx={{marginTop: 2}}>
                Zaloguj się
            </Button>
            <Typography textAlign={'center'} paddingTop={3}>Nie masz konta? <a href={'/register'}>Zarejestruj się</a></Typography>
            </form>
        </Paper>
      </Grid>
  );
}
export default Login;

const styles = {
    paper: {
        padding: 20,
        width: 380,
        margin: '10px auto',
    },
    img: {
        display: 'block',
        margin: 'auto'
    }
}