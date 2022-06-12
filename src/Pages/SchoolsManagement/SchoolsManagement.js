import * as Space from 'react-spaces';
import {
    Alert, Autocomplete,
    Box, Button,
    Collapse, Dialog, DialogTitle, Divider, FormControl, Grid,
    IconButton, InputAdornment, InputLabel,
    List, ListItem, ListItemText, MenuItem,
    Paper, Select, Skeleton, Stack,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

//css
import "./SchoolsManagement.css"
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Connection from "../../Communication/Connection";
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";

/**
 * a function that returns an object containing the data for a row in the table
 * @param id the id of the school
 * @param name the name of the school
 * @param address the address of the school
 * @param instructor the supervisor or instructor of the school
 * @param educationLevel the education level of the school
 * @param sector the sector of the school
 * @param numOfPupils the number of pupils in the school
 * @param phoneNumber the phone number of the school
 * @param educationType the education type of the school
 * @param city the city in which the school is located
 * @param cityForMail the idk
 * @param principleName the name of the principle of the school
 * @param zipCode the zip code of the shcool
 * @param supervisionType the type of supervision of the school is under
 * @param secretaryMail the email address of the secretary office of the school
 * @returns {{zipCode, address, educationType, city, supervisionType, phoneNumber, educationLevel, principleName, name, numOfPupils, id, sector, secretaryMail, supervisor, cityForMail}}
 */
function createData(id, name, address, instructor, educationLevel, sector, numOfPupils, phoneNumber, educationType,
                    city, cityForMail, principleName, zipCode, supervisionType, secretaryMail) {
    return {
        id,
        name,
        address,
        instructor,
        educationLevel,
        sector,
        numOfPupils,
        phoneNumber,
        educationType,
        city,
        cityForMail,
        principleName,
        zipCode,
        supervisionType,
        secretaryMail,
    }
}


/**
 * this function is a hook of a row in the table
 * @param props data for a row
 * @returns {JSX.Element} JSX element of the row
 */
function Row(props) {
    const { row } = props;

    // administrative info strings
    const administrative_info_string = "מידע אדמיניסטרטיבי:";
    const principle_name_string = "שם מנהל";
    const address_primary_string = "כתובת";
    const phone_number_primary_string = "מספר טלפון";
    const zip_primary_string = "מיקוד";
    const secretary_office_email_primary_string = 'דוא"ל מזכירות';
    const city_for_mails_primary_string = "יישוב למכתבים";

    // educational info strings
    const educational_info_string = "מידע חינוכי:";
    const number_of_pupils_primary_string = "מספר תלמידים";
    const education_level_primary_string = "שלב חינוך";
    const education_type_primary_string = "סוג חינוך";
    const sector_primary_string = "מגזר";
    const supervisor_primary_string = "מפקח";
    const supervision_type_primary_string = "סוג פיקוח";

    // coordinator's strings
    const coordinator_title_string = "רכזים:";
    const coordinator_does_not_exist = "לא רשום רכז לבית ספר זה.";
    const coordinator_name_primary_string = "שם";
    const coordinator_email_primary_string = 'דוא"ל';
    const coordinator_phone_number_primary_string = "מספר טלפון";
    const remove_coordinator_button_string = "הסרת רכז/ת";

    // action strings
    const action_title_string = "פעולות:";
    const add_coordinator_string = "הוספת רכז/ת";
    const work_field_select_string = "תחום הרכז/ת";

    /**
     * on chagen function for the work fields select
     * @param event the affected element
     */
    const workFieldSelectedOnChange = (event) => {
        props.workFieldChange(row.id, event.target.value);
    }

    return (
        <React.Fragment>
            <Paper sx={{width: "70%"}} elevation={3}>
                        <Grid container spacing={1}>
                            <Grid sx={{margin: 1}} item xs={12}>
                                <Typography variant={'h3'}>{row.name} ({row.id}), {row.city}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ margin: 1}}>
                                    <List
                                        sx={{
                                            width: "40%",
                                            bgcolor: "background.paper",
                                        }}
                                    >
                                        {/*administrative info*/}
                                        <ListItem>
                                            <ListItemText primary={administrative_info_string} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary={principle_name_string} secondary={row.principleName} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={address_primary_string} secondary={row.address} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={zip_primary_string} secondary={row.zipCode} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={phone_number_primary_string} secondary={row.phoneNumber} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={secretary_office_email_primary_string} secondary={row.secretaryMail} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={city_for_mails_primary_string} secondary={row.cityForMail} />
                                        </ListItem>
                                    </List>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ margin: 1}}>
                                    <List
                                        sx={{
                                            width: "40%",
                                            bgcolor: "background.paper",
                                        }}
                                    >
                                        {/*educational info*/}
                                        <ListItem>
                                            <ListItemText primary={educational_info_string} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary={number_of_pupils_primary_string} secondary={row.numOfPupils} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={education_level_primary_string} secondary={row.educationLevel} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={education_type_primary_string} secondary={row.educationType} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={sector_primary_string} secondary={row.sector} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={supervisor_primary_string} secondary={row.instructor} />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText primary={supervision_type_primary_string} secondary={row.supervisionType} />
                                        </ListItem>
                                    </List>
                                </Box>
                            </Grid>
                            <Grid sx={{margin: 1}} item xs={12}>
                                <Typography>{coordinator_title_string}</Typography>
                            </Grid>

                            {/*coordinator info*/}
                            {props.userType !== "SYSTEM_MANAGER" ? (<Grid sx={{margin: 1}} item xs={12}>
                                {props.coordinator !== null && <List>
                                    <ListItem>
                                        <ListItemText primary={coordinator_name_primary_string} secondary={props.coordinator.firstName + " " + props.coordinator.lastName} />
                                        <ListItemText primary={coordinator_email_primary_string} secondary={props.coordinator.email} />
                                        <ListItemText primary={coordinator_phone_number_primary_string} secondary={props.coordinator.phoneNumber} />
                                        <Button id={`remove_coordinator`} onClick={() => props.handleOpenRemoveCoordinatorDialog(props.coordinator.firstName + " " + props.coordinator.lastName, row.id, '')} variant="outlined" color="error">{remove_coordinator_button_string}</Button>
                                    </ListItem>
                                </List>}
                            </Grid>) :
                                (
                                <Grid sx={{margin: 1}} item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel >{work_field_select_string}</InputLabel>
                                                <Select
                                                    id="work-field-select"
                                                    value={props.selectedWorkField}
                                                    onChange={workFieldSelectedOnChange}
                                                >
                                                    {props.workFields.map((workField) => <MenuItem value={workField}>{workField}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {props.coordinator !== null && props.selectedWorkField !== '' && <List>
                                                <ListItem>
                                                    <ListItemText primary={coordinator_name_primary_string} secondary={props.coordinator.firstName + " " + props.coordinator.lastName} />
                                                    <ListItemText primary={coordinator_email_primary_string} secondary={props.coordinator.email} />
                                                    <ListItemText primary={coordinator_phone_number_primary_string} secondary={props.coordinator.phoneNumber} />
                                                    <Button id={`remove_coordinator`} onClick={() => props.handleOpenRemoveCoordinatorDialog(props.coordinator.firstName + " " + props.coordinator.lastName, row.id, props.selectedWorkField)} variant="outlined" color="error">{remove_coordinator_button_string}</Button>
                                                </ListItem>
                                            </List>}
                                        </Grid>
                                    </Grid>
                                </Grid>)
                            }

                            <Grid sx={{margin: 1}} item xs={12}>
                                {props.coordinator === null && props.userType !== "SYSTEM_MANAGER" && <Typography>{coordinator_does_not_exist}</Typography>}
                                {props.coordinator === null && props.userType === "SYSTEM_MANAGER" && props.selectedWorkField !== '' && <Typography>{coordinator_does_not_exist}</Typography>}
                            </Grid>

                            {/*actions*/}
                            <Grid sx={{margin: 1}} item xs={12}>
                                <Typography>{action_title_string}</Typography>
                            </Grid>
                            <Grid sx={{margin: 1}} item xs={6}>
                                <Button id={`school_add_coordinator_button`} disabled={(props.coordinator !== null)
                                    || (props.userType === "SYSTEM_MANAGER" && props.selectedWorkField === '')} onClick={() => props.handleOpenAddCoordinatorDialog(row.id, row.name, props.selectedWorkField)} variant="outlined" sx={{marginBottom: 1}}>{add_coordinator_string}</Button>
                            </Grid>
                        </Grid>
            </Paper>
        </React.Fragment>
    )
}

/**
 * a dialog element for adding a coordinator to a selected school
 * @param props the properties the element gets
 * @returns {JSX.Element} the element
 */
function AddCoordinatorDialog(props){
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    const [error, setError] = useState(false);

    // strings
    const title_string = "הוספת מפקח/ת עבור בית ספר";
    const first_name_label_string = "שם פרטי";
    const last_name_label_string = "שם משפחה";
    const email_label_string = 'דוא"ל';
    const phone_number_label_string = "מספר פלאפון";

    const error_message_string = "נא למלא את כל השדות";
    const submit_button_string = "הוספ/י";
    const cancel_button_string = "ביטול";

    /**
     * onChange handler for the text-fields
     * @param props the field who's been changed
     * @returns {(function(*): void)|*} updating the new values in the state hook
     */
    const handleTextFieldsChange = (props) => (event) => {
        setValues({ ...values, [props]: event.target.value})
    }

    /**
     * gathers the input and passing it to the provided callback
     * @param event the elements' status
     */
    const handleSubmit = (event) => {

        if (values.firstName.trim() === '' || values.lastName.trim() === '' || values.email.trim() === '' || values.phoneNumber.trim() === ''){
            setError(true);
        }
        else{
            setError(false);
            props.callback(props.workField, values.firstName, values.lastName, values.email, values.phoneNumber, props.schoolID);
            setValues({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
            })
        }
    }

    return (
        <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h5" align="center">{title_string} {props.schoolName} ({props.schoolID})</Typography></DialogTitle>

            <Collapse in={error}>
                <Alert id={"add_coordinator_alert"} severity="error">{error_message_string}</Alert>
            </Collapse>


            <Stack sx={{alignItems: "center"}} onSubmit={handleSubmit}>
                <Grid container spacing={1}>

                    <Grid item xs={12}  sx={{marginRight: "3%", marginLeft: "3%"}}>
                        <Grid container spacing={1}>
                            {/*last name*/}
                            <Grid item xs={6}>
                                <TextField
                                    id={"add_coordinator_last_name"}
                                    value={values.lastName}
                                    onChange={handleTextFieldsChange("lastName")}
                                    label={last_name_label_string}
                                    error={error && values.lastName.trim() === ''}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            {/*first name*/}
                            <Grid item xs={6}>
                                <TextField
                                    id={"add_coordinator_first_name"}
                                    value={values.firstName}
                                    onChange={handleTextFieldsChange("firstName")}
                                    label={first_name_label_string}
                                    error={error && values.firstName.trim() === ''}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/*email*/}
                    <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                        <TextField
                            id={"add_coordinator_email"}
                            value={values.email}
                            onChange={handleTextFieldsChange("email")}
                            label={email_label_string}
                            error={error && values.email.trim() === ''}
                            required
                            fullWidth
                        />
                    </Grid>
                    {/*phone number*/}
                    <Grid item xs={12} sx={{marginRight: "3%", marginLeft: "3%"}}>
                        <TextField
                            id={"add_coordinator_phone_number"}
                            value={values.phoneNumber}
                            onChange={handleTextFieldsChange("phoneNumber")}
                            label={phone_number_label_string}
                            error={error && values.phoneNumber.trim() === ''}
                            required
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Button id={"add_coordinator_submit_button"} onClick={() => handleSubmit()} type="submit" color="primary" variant="contained" sx={{width: "40%", marginBottom: "1%", marginTop: "1%"}}>{submit_button_string}</Button>

                <Button id={"add_coordinator_cancel_button"} color="error" onClick={() => props.onClose()} variant="contained" sx={{width: "40%", marginBottom: "1%", marginTop: "1%"}}>{cancel_button_string}</Button>
            </Stack>
        </Dialog>
    )
}

/**
 * a dialog element for removing a coordinator
 * @param props the properties the element gets
 * @returns {JSX.Element} the element
 */
function RemoveCoordinatorDialog(props){

    const title_string = "האם את/ה בטוח/ה שהינך רוצה למחוק את הרכז/ת";
    const delete_string = "מחק/י";
    const cancel_string = "ביטול";

    const handleSubmitDeletion = () => {
        props.callback(props.workField, props.schoolID);
    }

    return (
        <Dialog titleStyle={{textAlign: "center"}} sx={{alignItems: "right"}} fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h5" align="center">?{title_string} {props.name}</Typography></DialogTitle>
            <Grid container justifyContent="center" spacing={0}>
                <Grid item align="center" xs={6}>
                    {/*the cancel button*/}
                    <Button id={"remove_coordinator_cancel_button"} onClick={() => props.onClose()} sx={{marginBottom: 1, width: "50%"}} variant="outlined">{cancel_string}</Button>
                </Grid>
                <Grid item align="center" xs={6}>
                    {/*the delete button*/}
                    <Button id={"remove_coordinator_submit_button"} onClick={() => handleSubmitDeletion()} sx={{marginBottom: 1, width: "50%"}} color="error" variant="outlined">{delete_string}</Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}

const rows = [
    createData(432, "hello there", "grove street", "ronit", "elementary",
        "idk", 420, "050-1234567", "lame", "narnia", "idk",
        "shula","35423", "super supervision", "hahawhoreadsthis@lmao.lol",
        [{firstName: "a", lastName: "b", email: "idk@post.lol", phoneNumber: "050-lmao"},
            {firstName: "c", lastName: "d", email: "idk2@post.lol", phoneNumber: "054-lmao"}]),
    createData(431, "hello there", "grove street", "ronit", "elementary",
        "idk", 420, "050-1234567", "lame", "narnia", "idk",
        "shula","35423", "super supervision", "hahawhoreadsthis@lmao.lol",
        [{firstName: "c", lastName: "d", email: "idk2@post.lol", phoneNumber: "054-lmao"}])
]

const mockSchool = createData(432, "hello there", "grove street", "ronit", "elementary",
    "idk", 420, "050-1234567", "lame", "narnia", "idk",
    "shula","35423", "super supervision", "hahawhoreadsthis@lmao.lol",
    [{firstName: "a", lastName: "b", email: "idk@post.lol", phoneNumber: "050-lmao"},
        {firstName: "c", lastName: "d", email: "idk2@post.lol", phoneNumber: "054-lmao"}])

const mockSearchData = [{id: 123, label: 'idk (123)'}, {id: 1234, label: 'idk2 (1234)'}];

export default function SchoolsManagement(props){
    const [schools, setSchools] = useState([]);
    const [selectedSchoolSearchID, setSelectedSchoolSearchID] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchError, setSearchError] = useState(false);

    const [searching, setSearching] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [workFields, setWorkFields] = useState([]);
    const [searchedSchoolDetails, setSearchedSchoolDetails] = useState({});
    const [currentCoordinator, setCurrentCoordinator] = useState(null)


    // dialog states
    // add coordinator
    const [openACDialog, setOpenACDialog] = useState(false);
    const [selectedSchoolID, setSelectedSchoolID] = useState(-1);
    const [selectedSchoolName, setSelectedSchoolName] = useState('');
    const [selectedWorkField, setSelectedWorkField] = useState('');

    // remove coordinator
    const [openDCDialog, setOpenDCDialog] = useState(false);
    const [selectedCoordinatorName, setSelectedCoordinatorName] = useState('');

    // snackbar states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // STRINGS
    const page_title = "בתי הספר שלי";

    // search strings
    const search_school_label = 'חיפוש בית ספר';
    const search_error_string = "נא לבחור בית ספר";
    const search_button_string = "חיפוש";

    const school_id_cell_head_string = "סמל מוסד";
    const school_name_cell_head_string = "שם מוסד";
    const school_city_cell_head_string = "עיר מוסד";


    useEffect(() => {
        // if (props.userType === 'INSTRUCTOR' || props.userType === "GENERAL_SUPERVISOR"){
        //
        // }

        //new Connection().getUserSchools(arrangeSchoolCallback)


        if (props.userType === "SYSTEM_MANAGER"){
            new Connection().getWorkFields(arrangeWorkFields)
        }

        },[]);

    /**
     * arranges the school's data which got from the server
     * @param data the response from the server for the request to get the schools
     */
    const arrangeSchoolCallback = (data) => {
        if (!data.failure){

            data.result.forEach((element) => setSchools(schools => [...schools,
                {id: element.second, label: `${element.first} (${element.second})`}]))
        }
    }

    /**
     * arranges the data of the work fields
     * @param data the data from the server
     */
    const arrangeWorkFields = (data) => {
        if (!data.failure){
            setWorkFields(data.result)
        }
    }

    // function createData(id, name, address, instructor, educationLevel, sector, numOfPupils, phoneNumber, educationType,
    //                     city, cityForMail, principleName, zipCode, supervisionType, secretaryMail) {

    /**
     * arranges the school's data which got from the server
     * @param data the response from the server for the request to get the searched school
     */
    const getSchoolCallback = (data) => {
        if(!data.failure){
            setSearching(false);
            setLoaded(true);
            console.log('got the searched school')
            console.log(data.result)
            let school_data = data.result
            setSearchedSchoolDetails(createData(school_data.symbol,
                school_data.name,
                school_data.address,
                school_data.supervisor,
                school_data.education_stage,
                school_data.spector,
                school_data.num_of_students,
                school_data.phone,
                school_data.education_type,
                school_data.city,
                school_data.city_mail,
                school_data.principal,
                school_data.zipcode,
                school_data.supervisor_type,
                school_data.mail))

            if(school_data.coordinatorFirstName !== null && school_data.coordinatorLastName !== null){
                setCurrentCoordinator({firstName: school_data.coordinatorFirstName,
                lastName: school_data.coordinatorLastName,
                email: school_data.coordinatorEmail,
                phoneNumber: school_data.coordinatorPhone})
            }
        }
    }

    /**
     * refreshes the new school data
     */
    const refreshSchoolData = () => {

        if(props.userType === "SYSTEM_MANAGER"){
            new Connection().getCoordinatorOfSchool(selectedWorkField, selectedSchoolSearchID, arrangeCoordinatorData)
        }
        else{
            new Connection().getSchoolByID(selectedSchoolSearchID, getSchoolCallback)
        }
    }

    const submitSchoolSearch = () => {
        // checks if the current input matches any school
        const findInSchools = (label) => {
            return props.schools.find((ele) => ele.label === label) !== undefined
        }

        if(!findInSchools(searchText)){
            setSearchError(true);
        }
        else{
            setCurrentCoordinator(null);
            setSearchError(false);
            setSearching(true);
            setLoaded(false);
            setSelectedWorkField('');
            new Connection().getSchoolByID(selectedSchoolSearchID, getSchoolCallback)
        }
    }

    const arrangeCoordinatorData = (data) => {
        if (!data.failure){
            let coordinator_data = data.result;

            setCurrentCoordinator({firstName: coordinator_data.firstName,
                lastName: coordinator_data.lastName,
                email: coordinator_data.email,
                phoneNumber: coordinator_data.phoneNumber});
        }
    }

    /**
     * handler function for getting the data of a coordinator of a school under a work field
     * @param schoolID the id of the school of the coordinator
     * @param newWorkField the work field of the coordinator is under
     */
    const handleWorkFieldChange = (schoolID, newWorkField) => {
        setSelectedWorkField(newWorkField);
        new Connection().getCoordinatorOfSchool(newWorkField, schoolID, arrangeCoordinatorData)
    }

    // add coordinator functions

    /**
     * handles the opening of the dialog to add a coordinator to a given school
     * @param schoolID the id of the selected school
     * @param schoolName the name of the selected school
     * @param workField the work field to assign to
     */
    const handleOpenAddCoordinatorDialog = (schoolID, schoolName, workField) => {
        setOpenACDialog(true);
        setSelectedSchoolID(schoolID);
        setSelectedSchoolName(schoolName);
        setSelectedWorkField(workField);
    }

    /**
     * an onClose handler for the AddCoordinator dialog
     */
    const handleCloseACDialog = () => {
        setOpenACDialog(false);
    }

    /**
     * a call back which handles the response from the server regarding the request to add a coordinator to a selected school
     * @param data the response from the server
     */
    const addCoordinatorCallback = (data) => {
        if (!data.failure){
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage("הרכז הוסף בהצלחה");
            refreshSchoolData()
        }
        else{
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage("הפעולה נכשלה. אנא נסה/י שנית");
        }

        setOpenACDialog(false);
    }

    /**
     * an handler for adding a coordinator to a given school
     * @param workField the work field to which the coordinator is related to
     * @param firstName the first name of the coordinator to add
     * @param lastName the last name of the coordinator to add
     * @param email the email of the coordinator to add
     * @param phoneNumber the phone number of the coordinator to add
     * @param schoolID the school id of the school to which add the coordinator to
     */
    const handleAddCoordinator = (workField, firstName, lastName, email, phoneNumber, schoolID) => {
        new Connection().addCoordinator(
            workField,
            firstName,
            lastName,
            email,
            phoneNumber,
            schoolID,
            addCoordinatorCallback
        )
    }

    // remove coordinator functions

    /**
     * handles the opening of the dialog to remove a coordinator of a given school
     * @param coordinatorName the name of the coordinator to remove
     * @param schoolID the id of the school from which to remove the coordinator
     * @param workField the work field of the coordinator
     */
    const handleOpenRemoveCoordinatorDialog = (coordinatorName, schoolID, workField) => {
        setOpenDCDialog(true);
        setSelectedCoordinatorName(coordinatorName);
        setSelectedSchoolID(schoolID)
        setSelectedWorkField(workField)
    }

    /**
     * an onClose handler for the RemoveCoordinator dialog
     */
    const handleCloseDCDialog = () => {
        setOpenDCDialog(false);
    }

    /**
     * a call back which handles the response from the server regarding the request to remove a coordinator from a selected school
     * @param data the response from the server
     */
    const removeCoordinatorCallback = (data) => {
        if (!data.failure){
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage("הרכז הוסר בהצלחה");
            setCurrentCoordinator(null)
            refreshSchoolData()
        }
        else{
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage("הפעולה נכשלה. אנא נסה/י שנית");
        }

        setOpenDCDialog(false);
    }

    /**
     * an handler for removing a coordinator of a given school
     */
    const handleRemoveCoordinator = (workField, schoolID) => {
        new Connection().removeCoordinator(
            workField,
            schoolID,
            removeCoordinatorCallback
        )
    }


    return (
        <Space.Fill scrollable>
            <div id="Schools-management">
                {/*title*/}
                <h1>{page_title}</h1>
                {/*the table presenting the schools*/}

                <Collapse in={searchError}>
                    <Alert id={'school-search-alert'} severity={'error'} sx={{marginBottom: "2%"}}>{search_error_string}</Alert>
                </Collapse>


                <Autocomplete
                    freeSolo
                    id="search-schools"
                    disableClearable
                    onChange={(event, newValue) => {
                        setSelectedSchoolSearchID(newValue.id)
                    }}
                    onInputChange={(event, newInputValue) => {
                        setSearchText(newInputValue);
                    }}
                    options={props.schools}
                    renderInput={(params) => (
                        <TextField
                            id={'search_schools_text_field'}
                            {...params}
                            label={search_school_label}
                            onKeyDown={(e) => {
                                if(e.keyCode === 13){
                                    submitSchoolSearch()
                                }
                            }}
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                                endAdornment: (
                                    <Button id={'search_school_button'} variant={"outlined"} onClick={() => submitSchoolSearch()}>{search_button_string}</Button>
                                )
                            }}
                            error={searchError}
                            sx={{marginBottom: "2%"}}
                        />
                    )}
                    sx={{width: "70%"}}
                />

                {searching ? (<Skeleton variant="rectangular" width={"70%"} height={500} />) : <div/>}

                {loaded ? <Row key={searchedSchoolDetails.id} row={searchedSchoolDetails} handleOpenAddCoordinatorDialog={handleOpenAddCoordinatorDialog}
                                handleOpenRemoveCoordinatorDialog={handleOpenRemoveCoordinatorDialog}
                               workFieldChange={handleWorkFieldChange}
                               selectedWorkField={selectedWorkField}
                               workFields={workFields}
                               coordinator={currentCoordinator}
                               userType={props.userType}/> : <div/>}

                {/*add coordinator dialog pop up*/}
                <AddCoordinatorDialog
                    schoolID={selectedSchoolID}
                    schoolName={selectedSchoolName}
                    workField={selectedWorkField}
                    open={openACDialog}
                    onClose={handleCloseACDialog}
                    callback={handleAddCoordinator}
                />

                {/*remove coordinator dialog pop up*/}
                <RemoveCoordinatorDialog
                    name={selectedCoordinatorName}
                    schoolID={selectedSchoolID}
                    workField={selectedWorkField}
                    open={openDCDialog}
                    onClose={handleCloseDCDialog}
                    callback={handleRemoveCoordinator}
                />

                {/*snackbar for notification on actions*/}
                <NotificationSnackbar
                    open={openSnackbar}
                    setOpen={setOpenSnackbar}
                    severity={snackbarSeverity}
                    message={snackbarMessage}/>
            </div>
        </Space.Fill>
    )
}