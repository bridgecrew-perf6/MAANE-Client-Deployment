import * as Space from 'react-spaces';
import React, {useEffect, useState} from "react";
import Connection from "../../Communication/Connection";
import {
    Alert,
    Button,
    Collapse, FormControl,
    Grid,
    IconButton,
    InputAdornment, InputLabel, MenuItem, Select,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";

import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import WorkReport from "../WorkReport/WorkReport";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from "date-fns/locale";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker, TimePicker} from "@mui/x-date-pickers";

/**
 * tab viewer
 */
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                    children
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

/**
 * containing the general information tab panel
 * @param props the properties passed to the element
 */
function InfoTabPanel(props){
    const [values, setValues] = useState({
        firstName: props.profileInfo.firstName,
        lastName: props.profileInfo.lastName,
        email: props.profileInfo.email,
        phoneNumber: props.profileInfo.phoneNumber,
        city: props.profileInfo.city
    });

    // tracks if there were changes to any of the values
    const [changes, setChanges] = useState(true);

    const [edit, setEdit] = useState(false);

    const [pickedDate, setPickedDate] = useState(new Date())

    const [pickedDayOfWeek, setPickedDayOfWeek] = useState(props.workHours.workDay);
    const [firstActivityStart, setFirstActivityStart] = useState(new Date(`2011-10-10T${props.workHours.act1Start}`)) // no use for the date only the time here
    const [firstActivityEnd, setFirstActivityEnd] = useState(new Date(`2011-10-10T${props.workHours.act1End}`))
    const [secondActivityStart, setSecondActivityStart] = useState(new Date(`2011-10-10T${props.workHours.act2Start}`))
    const [secondActivityEnd, setSecondActivityEnd] = useState(new Date(`2011-10-10T${props.workHours.act2End}`))
    const [workHoursError, setWorkHoursError] = useState(false)

    const [error, setError] = useState(false);
    const [errorSeverity, setErrorSeverity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const first_name_label_string = "שם פרטי";
    const last_name_label_string = "שם משפחה";
    const email_label_string = "כתובת דואר אלקטרוני";
    const phone_number_label_string = "מספר טלפון";
    const city_label_string = "עיר";
    const save_button_string = "שמירה";

    const private_info_title_string = 'מידע אישי'
    const edit_string = 'עריכת פרטים';

    const work_report_title_string = 'דו"ח עבודה'
    const download_report = `הורדת דו"ח עבודה`;
    const year_and_month_label_string = "בחירת שנה וחודש";

    const work_hours_title_string = "שעות עבודה";
    const work_hours_day_of_week = "בחירת יום עבודה:";
    const work_hours_first_activity = "שעות פעילות ראשונה:";
    const work_hours_second_activity = "שעות פעילות שנייה:";
    const work_hours_save_button = "שמירת שעות עבודה";
    const start_of_activity = "תחילת הפעילות";
    const end_of_activity = "סוף הפעילות";

    useEffect(() => {
        if (changes) {
            window.onbeforeunload = () => false
        } else {
            window.onbeforeunload = undefined
        }
    }, [])

    /**
     * handles the change of the text fields
     * @param prop the name of the value which has changed
     * @returns {(function(*): void)|*} function which saves the change
     */
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setChanges(true);
    }

    /**
     * a callback which handles the received data from the server regarding the save info request
     * @param data the message of the server regarding the request
     */
    const saveInfoCallback = (data) => {
        if (data.failure){
            props.setOpenSnackbar(true);
            props.setSnackbarSeverity('error');
            props.setSnackbarMessage('העדכון נכשל. אנא נסה/י שנית');
        }
        else {
            props.setOpenSnackbar(true);
            props.setSnackbarSeverity('success');
            props.setSnackbarMessage('הפרטים התעדכנו בהצלחה');
        }
    }

    /**
     * handler for saving the info data (sending the data to the server)
     */
    const saveInfoHandler = () => {
        if(values.firstName.trim() === '' || values.lastName.trim() === ''){
            setError(true)
            setErrorSeverity('error')
            setErrorMessage('שדות החובה לא יכולים להיות ריקים')
        }
        else{
            setError(false)
            new Connection().updateProfileInfo(
                values.firstName,
                values.lastName,
                values.email,
                values.phoneNumber,
                values.city,
                saveInfoCallback
            )
        }
    }

    /**
     * a call back function for the request to get the work report file of the current user
     * @param data the response from the server
     */
    const downloadReportCallback = (data) => {
        if(data.failure){
            setError(true)
            setErrorSeverity('error')
            setErrorMessage('יצירת הדו"ח החודשי נכשלה')
        }
        else{
            setError(false)
            WorkReport(data.result)
        }
    }

    /**
     * a handler for sending the request to download  the work report of the current user
     */
    const downloadReportHandler = () => {
        new Connection().getWorkReport(pickedDate.getMonth()+1, pickedDate.getFullYear(), downloadReportCallback)
    }

    /**
     * call back function for the response from the server regarding the request to save the work hours
     * @param data the response from the server
     */
    const saveWorkHoursCallback = (data) => {
        if(data.failure){
            props.setOpenSnackbar(true)
            props.setSnackbarSeverity('error')
            props.setSnackbarMessage('אירעה שגיאה. שעות העבודה לא נשמרו')
        }
        else{
            props.setOpenSnackbar(true)
            props.setSnackbarSeverity('success')
            props.setSnackbarMessage('שעות העבודה נשמרו בהצלחה')
        }
    }

    /**
     * handler for saving the work hours data
     */
    const saveWorkHoursHandler = () => {
        if(pickedDayOfWeek === -1){
            setWorkHoursError(true)
            props.setOpenSnackbar(true)
            props.setSnackbarSeverity('error')
            props.setSnackbarMessage('נא לבחור יום עבודה');
        }
        else{
            setWorkHoursError(false)
            new Connection().setWorkHours(pickedDayOfWeek, firstActivityStart.toLocaleTimeString('en-GB'),
                firstActivityEnd.toLocaleTimeString('en-GB'), secondActivityStart.toLocaleTimeString('en-GB'),
                secondActivityEnd.toLocaleTimeString('en-GB'), saveWorkHoursCallback)
        }
    }

    return (
        <Space.Fill scrollable>
            <Grid container spacing={2} rowSpacing={4} sx={{paddingTop: 1}}>

                <Grid item xs={12}>
                    <Typography  variant="h6">{private_info_title_string}</Typography>
                </Grid>

                {/*edit button*/}
                <Grid item xs={6}>
                    <Button id={"profile_edit_button"} onClick={() => setEdit(!edit)} variant={edit ? "outlined" : "contained"} startIcon={edit? <EditOffIcon />  : <EditIcon />}>
                        {edit_string}
                    </Button>
                </Grid>

                {error &&
                    <Grid item xs={12}>
                        <Alert id={"profile_edit_alert"} severity={errorSeverity}>
                            {errorMessage}
                        </Alert>
                    </Grid>
                    }


                {/*first name*/}
                <Grid item xs={6}>
                    <TextField
                        id={"profile_edit_first_name"}
                        value={values.firstName}
                        onChange={handleChange('firstName')}
                        label={first_name_label_string}
                        inputProps={{
                            readOnly: !edit,
                        }}
                        fullWidth
                        required
                        error={error && values.firstName.trim() === ''}
                    />
                </Grid>

                {/*last name*/}
                <Grid item xs={6}>
                    <TextField
                        id={"profile_edit_last_name"}
                        value={values.lastName}
                        onChange={handleChange('lastName')}
                        label={last_name_label_string}
                        inputProps={{
                            readOnly: !edit,
                        }}
                        fullWidth
                        required
                        error={error && values.lastName.trim() === ''}
                    />
                </Grid>

                {/*email*/}
                <Grid item xs={12}>
                    <TextField
                        id={"profile_edit_email"}
                        value={values.email}
                        onChange={handleChange('email')}
                        label={email_label_string}
                        inputProps={{
                            readOnly: !edit,
                        }}
                        fullWidth
                    />
                </Grid>

                {/*phone number*/}
                <Grid item xs={12}>
                    <TextField
                        id={"profile_edit_phone_number"}
                        value={values.phoneNumber}
                        onChange={handleChange('phoneNumber')}
                        label={phone_number_label_string}
                        inputProps={{
                            readOnly: !edit,
                        }}
                        fullWidth
                    />
                </Grid>

                {/*city*/}
                <Grid item xs={12}>
                    <TextField
                        id={"profile_edit_city"}
                        value={values.city}
                        onChange={handleChange('city')}
                        label={city_label_string}
                        inputProps={{
                            readOnly: !edit,
                        }}
                        fullWidth
                    />
                </Grid>

                {/*save button*/}
                <Grid item xs={4}>
                    <Button id={"profile_edit_submit"} disabled={!edit} onClick={saveInfoHandler} variant="contained" fullWidth>{save_button_string}</Button>
                </Grid>

                {props.userType === "INSTRUCTOR" && <Grid item xs={12}/>}

                {/*work report title*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={12}>
                    <Typography variant={'h6'}>{work_report_title_string}</Typography>
                </Grid>}

                {/*work report date picker*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={6}>
                    <LocalizationProvider locale={he} dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            displayStaticWrapperAs="desktop"
                            inputFormat="yyyy-MM"
                            views={['year', 'month']}
                            label={year_and_month_label_string}
                            openTo="year"
                            value={pickedDate}
                            onChange={(newValue) => {
                                setPickedDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>}

                {/*work report button*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={6}>
                    <Button id={"download_report_button"} onClick={() => downloadReportHandler()} sx={{margin: '1%'}} variant={"contained"}>
                        {download_report}
                    </Button>
                </Grid>}

                {props.userType === "INSTRUCTOR" && <Grid item xs={12}/>}

                {/*work hours title*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={12}>
                    <Typography variant={'h6'}>{work_hours_title_string}</Typography>
                </Grid>}

                {props.userType === "INSTRUCTOR" && <Grid item xs={3}>
                    <Typography>{work_hours_day_of_week}</Typography>
                </Grid>}

                {/*day of week menu*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={3}>
                    <FormControl error={workHoursError}>
                        <Select
                            value={pickedDayOfWeek}
                            onChange={(event) => setPickedDayOfWeek(event.target.value)}
                        >
                            <MenuItem value={-1}>{'בחירת יום'}</MenuItem>
                            <MenuItem value={0}>{'ראשון'}</MenuItem>
                            <MenuItem value={1}>{'שני'}</MenuItem>
                            <MenuItem value={2}>{'שלישי'}</MenuItem>
                            <MenuItem value={3}>{'רביעי'}</MenuItem>
                            <MenuItem value={4}>{'חמישי'}</MenuItem>
                            <MenuItem value={5}>{'שישי'}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>}

                {props.userType === "INSTRUCTOR" && <Grid item xs={6}/>}

                {props.userType === "INSTRUCTOR" && <Grid item xs={3}>
                    <Typography>{work_hours_first_activity}</Typography>
                </Grid>}

                {/*first activity start*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={4}>
                    <LocalizationProvider locale={he} dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label={start_of_activity}
                            value={firstActivityStart}
                            onChange={(newValue) => {
                                setFirstActivityStart(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>}

                {/*first activity end*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={4}>
                    <LocalizationProvider locale={he} dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label={end_of_activity}
                            value={firstActivityEnd}
                            onChange={(newValue) => {
                                setFirstActivityEnd(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>}

                {props.userType === "INSTRUCTOR" && <Grid item xs={1}/>}

                {props.userType === "INSTRUCTOR" && <Grid item xs={3}>
                    <Typography>{work_hours_second_activity}</Typography>
                </Grid>}

                {/*second activity start*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={4}>
                    <LocalizationProvider locale={he} dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label={start_of_activity}
                            value={secondActivityStart}
                            onChange={(newValue) => {
                                setSecondActivityStart(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>}

                {/*second activity end*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={4}>
                    <LocalizationProvider locale={he} dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label={end_of_activity}
                            value={secondActivityEnd}
                            onChange={(newValue) => {
                                setSecondActivityEnd(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>}

                {props.userType === "INSTRUCTOR" && <Grid item xs={1}/>}

                {/*save work hours button*/}
                {props.userType === "INSTRUCTOR" && <Grid item xs={6}>
                    <Button id={"save_work_hours_button"} onClick={() => saveWorkHoursHandler()} sx={{margin: '1%'}} variant={"contained"}>
                        {work_hours_save_button}
                    </Button>
                </Grid>}

                {/*margin at the end of the page*/}
                <Grid item xs={12}/>
                <Grid item xs={12}/>
                <Grid item xs={12}/>
                <Grid item xs={12}/>
                <Grid item xs={12}/>


            </Grid>
        </Space.Fill>
    )
}

/**
 * containing the security tab panel
 * @param props the properties passed to the element
 */
function SecurityTabPanel(props){
    const [values, setValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [error, setError] = useState(false);
    const [errorSeverity, setErrorSeverity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewConfirmedPassword, setShowNewConfirmedPassword] = useState(false);

    const change_password_title_section_string = "שינוי סיסמה";
    const current_password_label_string = "סיסמה נוכחית";
    const new_password_label_string = "סיסמה חדשה";
    const confirm_new_password_label_string = "אימות סיסמה חדשה";
    const update_password_button_string = "עדכון סיסמה";

    /**
     * handles the change of the text fields
     * @param prop the name of the value which has changed
     * @returns {(function(*): void)|*} function which saves the change
     */
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    }

    const updatePasswordCallback = (data) => {
        if(data.failure){
            // error
            props.setOpenSnackbar(true);
            props.setSnackbarSeverity('error');
            props.setSnackbarMessage('הפעולה נכשלה. אנא נסה/י שנית')
        }
        else{
            // success
            props.setOpenSnackbar(true);
            props.setSnackbarSeverity('success');
            props.setSnackbarMessage('הסיסמה שונתה בהצלחה');
        }

        // resetting the password fields no matter what
        setValues({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        })
    }

    /**
     * handles the update password action. sends a request to the server to change the password to the current user
     */
    const handleUpdatePassword = () => {
        if(values.currentPassword.trim() === '' || values.newPassword.trim() === '' ||
            values.confirmNewPassword.trim() === ''){
            setError(true);
            setErrorSeverity('error');
            setErrorMessage('נא למלא את כל השדות');
        }
        else{
            setError(false);
            new Connection().changePassword(
                values.currentPassword,
                values.newPassword,
                values.confirmNewPassword,
                updatePasswordCallback);
        }

    }

    return (
        <Grid container spacing={2} rowSpacing={4} sx={{paddingTop: 1}}>
            {/*current password*/}
            <Grid item xs={3}><Typography variant="h6">{change_password_title_section_string}</Typography></Grid>
            <Grid item xs={12}>
                <Collapse in={error}>
                    <Alert id={"change_password_alert"} severity={errorSeverity}>
                        {errorMessage}
                    </Alert>
                </Collapse>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id={"change_password_current"}
                    value={values.currentPassword}
                    onChange={handleChange('currentPassword')}
                    label={current_password_label_string}
                    type={showCurrentPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    error={error && values.currentPassword.trim() === ''}
                />
            </Grid>

            {/*new password*/}
            <Grid item xs={12}>
                <TextField
                    id={"change_password_new"}
                    value={values.newPassword}
                    onChange={handleChange('newPassword')}
                    label={new_password_label_string}
                    type={showNewPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    error={error && values.newPassword.trim() === ''}
                />
            </Grid>

            {/*confirm new password*/}
            <Grid item xs={12}>
                <TextField
                    id={"change_password_confirm"}
                    value={values.confirmNewPassword}
                    onChange={handleChange('confirmNewPassword')}
                    label={confirm_new_password_label_string}
                    type={showNewConfirmedPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowNewConfirmedPassword(!showNewConfirmedPassword)}
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    {showNewConfirmedPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    error={error && values.confirmNewPassword.trim() === ''}
                />
            </Grid>

            {/*save button*/}
            <Grid item xs={4}>
                <Button id={"change_password_submit_button"} onClick={handleUpdatePassword} variant="contained" fullWidth>{update_password_button_string}</Button>
            </Grid>
        </Grid>
    )
}

export default function ProfilePage(props){

    const [tabPage, setTabPage] = useState(0);
    const [profileInfoLoaded, setProfileInfoLoaded] = useState(false);
    const [hoursDataLoaded, setHoursDataLoaded] = useState(false);
    const [profileInfo, setProfileInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: ''
    });

    const [workHoursData, setWorkHoursData] = useState({
        workDay: -1,
        act1Start: new Date(),
        act1End: new Date(),
        act2Start: new Date(),
        act2End: new Date(),
    })

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const page_title_string = "פרופיל";
    const info_tab_string = "פרטים";
    const security_tab_string = "אבטחה";

    useEffect(() => {
        new Connection().getProfileInfo(profileInfoCallback);

        if (props.userType === 'INSTRUCTOR'){
            new Connection().getWorkHours(workHoursCallback);
        }
        else{
            setHoursDataLoaded(true)
        }
    }, []);

    /**
     * callback for arranging the profile data
     * @param data the data from the server
     */
    const profileInfoCallback = (data) => {
        if (data.failure){
            setOpenSnackbar(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('אירעה שגיאה בהצגת המידע האישי');
        }
        else{
            setProfileInfo(data.result)
        }
        setProfileInfoLoaded(true);
    }

    /**
     * callback for arranging the work hours data
     * @param data the data from the server
     */
    const workHoursCallback = (data) => {
        if (data.failure){
            setOpenSnackbar(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('אירעה שגיאה בהצגת שעות העבודה');
        }
        else{
            setWorkHoursData(data.result);
        }
        setHoursDataLoaded(true);
    }

    /**
     * handles the change of a tab by updating the value which save the current open tab
     * @param event the event of the change
     * @param newValue the new tab value
     */
    const handleTabChange = (event, newValue) => {
        setTabPage(newValue);
    };

    return (
        <Space.Fill>

            {/*title of the page*/}
            <Space.Top size="10%">
                <Space.Centered>
                    <h1>{page_title_string}</h1>
                </Space.Centered>
            </Space.Top>

            {/*tabs selection*/}
            {profileInfoLoaded && hoursDataLoaded && <Space.Fill>
                <Space.Right size="10%">
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={tabPage}
                        onChange={handleTabChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <Tab icon={<InfoIcon/>} iconPosition="start" label={info_tab_string} {...a11yProps(0)} />
                        <Tab icon={<LockIcon/>} iconPosition="start" label={security_tab_string} {...a11yProps(1)} />
                    </Tabs>
                </Space.Right>

                {/*tab panels*/}
                <Space.Fill>
                    <Space.Right size="30%"/>
                    <Space.Top size="10%"/>
                    <Space.Fill>
                        <Space.Top size="100%">

                                <TabPanel value={tabPage} index={0}>
                                    <InfoTabPanel profileInfo={profileInfo}
                                                  workHours={workHoursData}
                                                  setOpenSnackbar={setOpenSnackbar}
                                                  setSnackbarSeverity={setSnackbarSeverity}
                                                  setSnackbarMessage={setSnackbarMessage}
                                                  userType={props.userType}/>
                                </TabPanel>
                                <TabPanel value={tabPage} index={1}>
                                    <SecurityTabPanel setOpenSnackbar={setOpenSnackbar}
                                                      setSnackbarSeverity={setSnackbarSeverity}
                                                      setSnackbarMessage={setSnackbarMessage}/>
                                </TabPanel>
                        </Space.Top>
                    </Space.Fill>
                    <Space.Left size="30%"/>
                </Space.Fill>
            </Space.Fill>}

            {/*notification snackbar*/}
            <NotificationSnackbar
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                severity={snackbarSeverity}
                message={snackbarMessage}/>
        </Space.Fill>
    )
}