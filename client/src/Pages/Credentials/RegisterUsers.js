import React, {useEffect, useState} from "react";
import './RegisterUsers.css'
import {
    Alert, Collapse, FormControlLabel,
    FormHelperText, FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper, Radio, RadioGroup,
    Select, Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Connection from "../../Communication/Connection";
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";
import {useNavigate} from "react-router-dom";
import * as Space from 'react-spaces';

// for offline testing
const roles_system_manager = [
    {
        roleEnum: "INSTRUCTOR",
        role: 'מדריכ/ה'
    },
    {
        roleEnum: "GENERAL_SUPERVISOR",
        role: 'מפקח/ת כללי/ת',
    },
    {
        roleEnum: "SUPERVISOR",
        role: 'מפקח/ת',
    },
]

const roles_supervisor = [
    {
        roleEnum: "INSTRUCTOR",
        role: 'מדריכ/ה'
    },
    {
        roleEnum: "GENERAL_SUPERVISOR",
        role: 'מפקח/ת כללי/ת',
    },
]

// TODO: for some reason a supervisor becomes an admin after something is happening. can't tell what atm

export default function RegisterUsers(props){
    // data
    const [values, setValues] = useState({
        username: '',
        password: '',
        workField: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
    });

    // password
    const [showPassword, setShowPassword] = useState(false);

    // error
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // role choice
    const [roleChoiceEnum, setRoleChoiceEnum] = useState('');

    // radio
    const [radioValue, setRadioValue] = useState("0"); // 0 - add new user. 1 - replace supervisor

    // supervisor choice
    const [supervisorChoiceUsername, setSupervisorChoiceUsername] = useState('');

    // select options
    const [roles, setRoles] = useState([]);
    const [supervisors, setSupervisors] = useState([]);

    // notification snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    let navigate = useNavigate();

    // STRINGS
    const header_string = 'רישום משתמשים';

    const user_credentials_string = 'פרטי התחברות:';
    const user_info_string = 'פרטים אישיים:';
    const user_assign_info = 'הקצאות:'

    const username_label_string = 'שם משתמש';
    const password_label_string = 'סיסמה';
    const first_name_label_string = 'שם פרטי';
    const last_name_label_string = 'שם משפחה';
    const email_label_string = 'דוא"ל';
    const phone_number_label_string = 'מספר טלפון';
    const city_label_string = 'עיר מגורים';

    const register_button_string = 'בצע/י רישום';
    const finished_button_string = 'סיום';

    const work_field_button_string = 'תחום';
    const select_role_label_string = 'תפקיד';

    const select_supervisor_label_string = 'מפקח/ת';
    const select_role_helper_text_string = 'תפקיד המשתמש הנרשם';
    const select_supervisor_helper_text_string = 'המפקח/ת שתחתיו/ה המשתמש יוגדר';

    const action_radio_title_string = "פעולה:";
    const add_new_user_radio_string = "הוספת משתמש";
    const replace_existing_radio_string = "החלפת נוכחי/ת";

    /**
     * before the screen loads sets the relevant components according to the type of user who got to the screen
     */
    useEffect(() => {
        let selected_roles = props.type === 'SUPERVISOR' ? roles_supervisor : roles_system_manager;
        setRoles(selected_roles);
        setRoleChoiceEnum(selected_roles[0]['ruleEnum']);

        if (props.type === "SYSTEM_MANAGER"){
            new Connection().getSupervisors(arrangeSupervisorsCallback)
        }
    },[]);

    const refresh_supervisors = () => {
        new Connection().getSupervisors(arrangeSupervisorsCallback);
    }

    const arrangeSupervisorsCallback = (data) => {
        if (!data.failure){
            setSupervisors(data.result);
        }
    }

    /**
     * onChange handler for the text-fields
     * @param props the field who's been changed
     * @returns {(function(*): void)|*} updating the new values in the state hook
     */
    const handleTextFieldsChange = (props) => (event) => {
        setValues({ ...values, [props]: event.target.value})
    }

    /**
     * an on change handler for the radio
     * @param event the radio element in which the change occurred
     */
    const handleRadioChange = (event) => {
        setSupervisorChoiceUsername('');
        setRadioValue(event.target.value);
    }

    /**
     * callback function for the response of the server for the register request
     * @param data the data from the server
     */
    const registerCallback = (data) => {
        if(data.failure){
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('ההרשמה נדחתה');
        }
        else{
           setValues({
               username: '',
               password: '',
               workField: '',
               firstName: '',
               lastName: '',
               email: '',
               phoneNumber: '',
               city: '',
           });
           setRoleChoiceEnum('');
           setOpenSnackbar(true);
           setSnackbarSeverity('success');
           setSnackbarMessage('המשתמש נרשם בהצלחה');
        }
    }

    /**
     * on submitting to register a new user, checks all the fields and not empty and sends request to the server to
     * register a new user with the given input
     * @param event wrapper for the state of the components at the moment of the submit
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        if(values.username === '' || values.password === '' ||
            (radioValue === '0' && (roleChoiceEnum === undefined || roleChoiceEnum === '')) ||
            (roleChoiceEnum === 'SUPERVISOR' && values.workField === '') ||
            (props.type === "SYSTEM_MANAGER" && (roleChoiceEnum === "INSTRUCTOR" || roleChoiceEnum === "GENERAL_SUPERVISOR" ||
                radioValue === "1") && supervisorChoiceUsername === '')){

            setShowError(true);
            setErrorMessage('נא למלא את כל שדות החובה')
        }
        else{
            setShowError(false);

            if (props.type === 'SUPERVISOR'){
                new Connection().registerUser(
                    values.username,
                    values.password,
                    roleChoiceEnum,
                    values.firstName,
                    values.lastName,
                    values.email,
                    values.phoneNumber,
                    values.city,
                    registerCallback);
            }

            if (props.type === 'SYSTEM_MANAGER'){
                if(radioValue === "0"){
                    new Connection().registerUserBySystemManager(
                        values.username,
                        values.password,
                        roleChoiceEnum,
                        values.firstName,
                        values.lastName,
                        values.email,
                        values.phoneNumber,
                        values.city,
                        values.workField,
                        supervisorChoiceUsername,
                        registerCallback
                    );
                }

                if(radioValue === "1"){
                    new Connection().transferSuperVisionWithRegistration(
                        supervisorChoiceUsername,
                        values.username,
                        values.password,
                        values.firstName,
                        values.lastName,
                        values.email,
                        values.phoneNumber,
                        values.city,
                        registerCallback
                    );
                }

                if (roleChoiceEnum === "SUPERVISOR") {
                    refresh_supervisors();
                }
            }
        }
    }

    /**
     * onChange handler for the dropdown list of roles
     * @param event wrapper for the changed component
     */
    const handleRoleChoiceChange = (event) => {
        setRoleChoiceEnum(event.target.value);
    };

    /**
     * onChange handler for the dropdown list of supervisors
     * @param event wrapper for the changed component
     */
    const handleSupervisorChoiceChange = (event) => {
        setSupervisorChoiceUsername(event.target.value);
    }

    return (
        <Space.Fill scrollable>
            <div className="Register-users">
                <h1>{header_string}</h1>
                <Paper className="Register-users-paper" sx={{width: "25%"}} elevation={3}>
                    <Grid container spacing={1} >

                        {/*user credentials sub-title*/}
                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%", marginTop: "3%"}}>
                            <Typography variant="h7">{user_credentials_string}</Typography>
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                            {/* username text field */}
                            <TextField
                                id="register_username"
                                color="secondary"
                                value={values.username}
                                onChange={handleTextFieldsChange('username')}
                                error={showError && values.username.trim() === ''}
                                margin="normal"
                                variant="outlined"
                                required
                                fullWidth
                                label={ username_label_string }
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                            {/* password text field */}
                            <TextField
                                id="register_password"
                                color="secondary"
                                value={values.password}
                                onChange={handleTextFieldsChange('password')}
                                error={showError && values.password.trim() === ''}
                                margin="normal"
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label={password_label_string}
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
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
                                }}
                            />
                        </Grid>

                        {/*user into sub-title*/}
                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%", marginTop: "3%"}}>
                            <Typography variant="h7">{user_info_string}</Typography>
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                            {/*additional information fields*/}
                            <Grid container spacing={1}>
                                {/*first name*/}
                                <Grid item xs={6}>
                                    <TextField
                                        id="register_first_name"
                                        color="secondary"
                                        variant="outlined"
                                        margin="normal"
                                        label={first_name_label_string}
                                        value={values.firstName}
                                        onChange={handleTextFieldsChange('firstName')}
                                        error={showError && values.firstName.trim() === ''}
                                        fullWidth
                                        required
                                    />
                                </Grid>

                                {/*last name*/}
                                <Grid item xs={6}>
                                    <TextField
                                        id="register_last_name"
                                        color="secondary"
                                        variant="outlined"
                                        margin="normal"
                                        label={last_name_label_string}
                                        value={values.lastName}
                                        onChange={handleTextFieldsChange('lastName')}
                                        error={showError && values.lastName.trim() === ''}
                                        fullWidth
                                        required
                                    />
                                </Grid>

                                {/*email name*/}
                                <Grid item xs={12}>
                                    <TextField
                                        id="register_email"
                                        color="secondary"
                                        variant="outlined"
                                        margin="normal"
                                        label={email_label_string}
                                        value={values.email}
                                        onChange={handleTextFieldsChange('email')}
                                        fullWidth
                                    />
                                </Grid>

                                {/*phone number name*/}
                                <Grid item xs={12}>
                                    <TextField
                                        id="register_phone_number"
                                        color="secondary"
                                        variant="outlined"
                                        margin="normal"
                                        label={phone_number_label_string}
                                        value={values.phoneNumber}
                                        onChange={handleTextFieldsChange('phoneNumber')}
                                        fullWidth
                                    />
                                </Grid>

                                {/*city name*/}
                                <Grid item xs={12}>
                                    <TextField
                                        id="register_city"
                                        color="secondary"
                                        variant="outlined"
                                        margin="normal"
                                        label={city_label_string}
                                        value={values.city}
                                        onChange={handleTextFieldsChange('city')}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/*user into sub-title*/}
                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%", marginTop: "3%"}}>
                            <Typography variant="h7">{user_assign_info}</Typography>
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%", marginTop: "3%"}}>
                            {/* registration action radio */}
                            {props.type === "SYSTEM_MANAGER" && <FormControl id="register_action">
                                <FormLabel>{action_radio_title_string}</FormLabel>
                                <RadioGroup
                                    value={radioValue}
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel value="0" control={<Radio />} label={add_new_user_radio_string} />
                                    <FormControlLabel value="1" control={<Radio />} label={replace_existing_radio_string} />
                                </RadioGroup>
                            </FormControl>}
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                            {/* role choice form */}
                            {radioValue === "0" && <FormControl error={showError && roleChoiceEnum === ''}  color="secondary" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="role-select-helper-label">{select_role_label_string}</InputLabel>
                                <Select
                                    id="register_role_choice"
                                    labelId="role-select-helper-label"
                                    value={roleChoiceEnum}
                                    label={select_role_label_string}
                                    onChange={handleRoleChoiceChange}
                                >
                                    {roles.map(x => <MenuItem value={x['roleEnum']}>{x['role']}</MenuItem>)}
                                </Select>
                                <FormHelperText>{select_role_helper_text_string}</FormHelperText>
                            </FormControl>}
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                            {/*optional select if the user is admin and want to register a non-supervisor user under an existing supervisor*/}
                            {props.type === 'SYSTEM_MANAGER' && radioValue === "0" && (roleChoiceEnum === "INSTRUCTOR" || roleChoiceEnum === "GENERAL_SUPERVISOR") &&
                                <FormControl error={showError && supervisorChoiceUsername === ''}  color="secondary" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="supervisor-select-helper-label">{select_supervisor_label_string}</InputLabel>
                                    <Select
                                        id="register_supervisor_choice"
                                        labelId="supervisor-select-helper-label"
                                        value={supervisorChoiceUsername}
                                        label={select_supervisor_label_string}
                                        onChange={handleSupervisorChoiceChange}
                                    >
                                        {supervisors.map(x => <MenuItem value={x['username']}>{x['firstName'] + " " + x['lastName'] + "בתחום " + x['workField']}</MenuItem>)}
                                    </Select>
                                    <FormHelperText>{select_supervisor_helper_text_string}</FormHelperText>
                                </FormControl>}
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                            {/*optional text-field if the user chose to register a supervisor*/}
                            {roleChoiceEnum === "SUPERVISOR" && radioValue === "0" &&
                                <TextField
                                    id="register_work_field"
                                    color="secondary"
                                    value={values.workField}
                                    onChange={handleTextFieldsChange('workField')}
                                    error={showError && values.workField.trim() === ''}
                                    margin="normal"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label={ work_field_button_string }
                                />}
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                            {/*optional select if the user is admin and want to register a user and make it a supervisor in the place of an existing one*/}
                            {(props.type === 'SYSTEM_MANAGER' && radioValue === "1") &&
                                <FormControl error={showError && supervisorChoiceUsername === ''} color="secondary" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel>{select_supervisor_label_string}</InputLabel>
                                    <Select
                                        id="register_supervisor_to_replace"
                                        value={supervisorChoiceUsername}
                                        label={select_supervisor_label_string}
                                        onChange={handleSupervisorChoiceChange}
                                    >
                                        {supervisors.map(x => <MenuItem value={x['username']}>{x['firstName'] + " " + x['lastName'] + "בתחום " + x['workField']}</MenuItem>)}
                                    </Select>
                                    <FormHelperText>{select_supervisor_helper_text_string}</FormHelperText>
                                </FormControl>}
                        </Grid>

                        <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                            {/*alert for errors*/}
                            <Collapse in={showError}>
                                <Alert id="register_alert" severity="error">{errorMessage}</Alert>
                            </Collapse>
                        </Grid>

                        <Grid item xs={4}/>
                        <Grid item xs={8}>
                            {/* submit register button */}
                            <Button
                                id="register_submit_button"
                                color="secondary"
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ mt: 3, mb: 2, width: "50%" }}
                            >
                                {register_button_string}
                            </Button>
                        </Grid>

                        <Grid item xs={4}/>
                        <Grid item xs={8}>
                            <Button id="register_finish_button" sx={{marginBottom: 1, width: "50%"}} color='success' fullWidth variant="contained" onClick={() => navigate(-1)}>{finished_button_string}</Button>
                        </Grid>

                    </Grid>
                </Paper>
                <NotificationSnackbar
                    open={openSnackbar}
                    setOpen={setOpenSnackbar}
                    severity={snackbarSeverity}
                    message={snackbarMessage}/>
            </div>
        </Space.Fill>
    )
}