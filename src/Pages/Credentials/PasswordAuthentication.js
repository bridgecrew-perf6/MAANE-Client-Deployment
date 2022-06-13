import React, { useState, useEffect } from "react";
import * as Space from 'react-spaces';
import {
    Alert,
    Button, Collapse,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {useNavigate} from "react-router-dom";
import Connection from "../../Communication/Connection";

// todo: refreshing on this page breaks the client

export default function PasswordAuthentication(props){
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    let navigate = useNavigate();

    const auth_password_string = "אימות סיסמה";
    const explanation_string = 'בבקשה הכניס/י את הסיסמה שלך לצורך אימות';
    const password_string = "סיסמה";
    const auth_string = "אימות";
    const cancel_string = "ביטול";

    useEffect(() => {
        props.setHideBars(true);
    });

    /**
     * a callback for the response from the server for the result of the authentication process
     * @param data the response from the server
     */
    const submitCallback = (data) => {
        if (data.failure){
            setError(true);
            setAlertMessage('סיסמה לא נכונה. נא נסה/י שנית');
        }
        else{
            setError(false);
            props.callback(); // sending the message after received positive authentication
            navigate(props.goto, {replace: true});
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (password.trim() === ''){
            setError(true);
            setAlertMessage('נא להכניס סיסמה');
        }
        else{
            setError(false);
            new Connection().authenticatePassword(password, submitCallback)
        }

    }

    return (
        <Space.Top size="40%">
            <Space.Centered>
                {/*the authentication paper*/}
                <Paper elevation={1} sx={{marginLeft: "25%", marginRight: "25%"}}>
                    <h2>{auth_password_string}</h2>
                    <p>{explanation_string}</p>
                    <Stack component="form" sx={{alignItems: "center"}} onSubmit={handleSubmit}>
                        <Collapse in={error}>
                            <Alert id={"auth_alert"} severity="error">
                                {alertMessage}
                            </Alert>
                        </Collapse>
                        <TextField
                            id={"auth_password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            sx={{paddingBottom: 1, width: "50%"}}
                            label={password_string}
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            error={error}
                            InputProps={{
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <IconButton
                                               onClick={() => setShowPassword(!showPassword)}
                                               onMouseDown={(event) => event.preventDefault()}
                                           >
                                               {showPassword ? <VisibilityOff /> : <Visibility />}
                                           </IconButton>
                                       </InputAdornment>
                                   ),
                               }}/>
                        <Grid container spacing={1} alignItems="center" justifyContent="center">
                            <Grid item xs={2.5}>
                                <Button id={'auth_submit_button'} fullWidth type="submit" sx={{marginBottom: 1, marginTop: 1}} variant="outlined">{auth_string}</Button>
                            </Grid>
                            <Grid item xs={0.5}/>
                            <Grid item xs={2.5}>
                                <Button id={'auth_cancel_button'} onClick={() => navigate(props.callee, {replace: true})} fullWidth color="error" sx={{marginBottom: 1, marginTop: 1}} variant="outlined">{cancel_string}</Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Paper>
            </Space.Centered>
        </Space.Top>
    )
}