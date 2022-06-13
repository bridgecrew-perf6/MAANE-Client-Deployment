import React, {useEffect, useState} from "react";
import './UsersManagement.css'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from "@mui/material/Box";
import {
    Alert, Autocomplete,
    Avatar,
    Collapse,
    Dialog,
    DialogTitle,
    Divider,
    Grid,
    IconButton, InputAdornment,
    List,
    ListItem,
    ListItemText, Stack, TextField, Tooltip, Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import * as Space from 'react-spaces';
import Connection from "../../Communication/Connection";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";
import DeleteIcon from '@mui/icons-material/Delete';
import {navigate} from "react-big-calendar/lib/utils/constants";

/**
 * a function to return an object of the data the tables accepts
 * @param username username of the user
 * @param name the full name of the user
 * @param role the role of the user
 * @param email the email of user
 * @param phoneNumber the phone number of the user
 * @param city the city of the user
 * @param schools the schools under the user
 * @param instructors the instructors under the supervisor. if the objects represents an instructor or general supervisor then it's empty
 * @returns {{role, phoneNumber, city, schools, name, email, username}} the object to return
 */
function createData(username, name, role, email, phoneNumber, city, schools, instructors) {
    return {
        username,
        name,
        role,
        email,
        phoneNumber,
        city,
        schools,
        instructors,
    }
}

/**
 * this function is a hook of a row in the table
 * @param props data for a row
 * @returns {JSX.Element} JSX element of the row
 */
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    // actions
    const delete_user_button_string = 'מחיקת משתמש';
    const change_password_button_string = 'שינוי סיסמה';
    const edit_schools_button_string = 'עריכת בתי ספר';
    const view_work_plan_button_string = 'צפייה בלוח עבודה';
    const make_supervisor_button_string = "הפיכה למפקח/ת";

    // data
    const user_email_string = 'דוא"ל';
    const user_phone_number_string = 'מספר פלאפון';
    const city = 'עיר';
    const schools = 'בתי ספר';
    const actions = 'פעולות:';

    let navigate = useNavigate();

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                {/* the arrow to open the extra info */}
                <TableCell>
                    <IconButton
                        id={`user_collapse_button_${row.username}`}
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {/* main user's info */}
                <TableCell id={`td_non_supervisor_username_${row.username}`} component="th" scope="row">
                    <Grid container spacing={1}>
                        <Grid item xs={2}><Avatar>{row.name.charAt(0)}</Avatar></Grid>
                        <Grid item xs={4}>{row.name}</Grid>
                    </Grid>
                </TableCell>
                <TableCell id={`td_role_${row.username}`}>{row.role}</TableCell>
            </TableRow>
            {/*secondary user's into*/}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {/* the user's general info */}
                            <List
                                sx={{
                                    width: '80%',
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <ListItem>
                                    <ListItemText primary={user_email_string} secondary={row.email} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary={user_phone_number_string} secondary={row.phoneNumber} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary={city} secondary={row.city} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary={schools} secondary={row.schools.reduce((previous, current) => previous + `${current.label}, `, '')} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary={actions}/>
                                </ListItem>
                            </List>
                            <br/>
                            {/* the action buttons for each user */}
                            <Grid sx={{marginBottom: 1}} container spacing={1}>
                                {/*editing actions*/}
                                <Grid item xs={1.5}><Button id={`change_password_${row.username}`} fullWidth onClick={() => props.handleOpenCPDialog(row.username, row.name)} color="secondary" variant="outlined">{change_password_button_string}</Button></Grid>
                                <Grid item xs={1.5}><Button id={`edit_schools_${row.username}`} fullWidth onClick={() => props.handleOpenEditSchoolsDialog(row.username, row.name, row.schools)} color="secondary" variant="outlined">{edit_schools_button_string}</Button></Grid>
                                {props.supervisor === undefined && <Grid item xs={1.5}>
                                    <Button id={`view_work_plan_${row.username}`} fullWidth onClick={() => navigate(`../viewWorkPlan?instructor=${row.username}`, {replace: false})} color="secondary" variant="outlined">{view_work_plan_button_string}</Button>
                                </Grid>}
                                {props.supervisor !== undefined && <Grid item xs={1.5}>
                                    <Button id={`transfer_supervision_to_${row.username}`} fullWidth onClick={() => props.handleOpenTransferSuperDialog(row.name, row.username, props.supervisorName, props.supervisor)} color="secondary" variant="outlined">{make_supervisor_button_string}</Button>
                                </Grid>}
                            </Grid>
                            <Grid container spacing={1}>
                                {/*removing user*/}
                                <Grid item xs={1.5}><Button id={`remove_user_${row.username}`} fullWidth onClick={() => props.handleOpenDeleteDialog(row.username, row.name)} color="error" variant="outlined">{delete_user_button_string}</Button></Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

/**
 * this function is a hook of a row in the table showen to the system manager
 * @param props data for a row
 * @returns {JSX.Element} JSX element of the row
 */
function SystemManagerRow(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    // actions
    const delete_user_button_string = 'מחיקת משתמש';
    const change_password_button_string = 'שינוי סיסמה';
    const edit_schools_button_string = 'עריכת בתי ספר';

    // data
    const user_email_string = 'דוא"ל';
    const user_phone_number_string = 'מספר פלאפון';
    const city = 'עיר';
    const schools = 'בתי ספר';
    const actions = 'פעולות:';

    // inner table
    const instructors_string = "מדריכות ומדריכים ומפקחים כלליים תחת המפקח/ת:"
    const empty_instructors_string = "למפקח/ת זה/ו אין מדריכים או מפקחים כלליים"
    const table_name_col_string = 'שם';
    const table_role_col_string = 'תפקיד';

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                {/* the arrow to open the extra info */}
                <TableCell>
                    <IconButton
                        id={`supervisor_collapse_button_${row.username}`}
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {/* main user's info */}
                <TableCell id={`td_supervisor_username_${row.username}`} component="th" scope="row">
                    <Grid container spacing={1}>
                        <Grid item xs={2}><Avatar>{row.name.charAt(0)}</Avatar></Grid>
                        <Grid item xs={4}>{row.name}</Grid>
                    </Grid>
                </TableCell>
                <TableCell id={`td_work_field_${row.username}`}>{row.role}</TableCell>
            </TableRow>
            {/*secondary user's into*/}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {/* the user's general info */}
                            <List
                                sx={{
                                    width: '80%',
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <ListItem>
                                    <ListItemText primary={user_email_string} secondary={row.email} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary={user_phone_number_string} secondary={row.phoneNumber} />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary={city} secondary={row.city} />
                                </ListItem>
                                <Divider component="li" />
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText primary={instructors_string} secondary={row.instructors.length === 0 ? empty_instructors_string : ""}/>
                                </ListItem>
                                {row.instructors.length !== 0 && <ListItem>
                                    <TableContainer id="Manage-users-inner-table" component={Paper}>
                                        {/* the table */}
                                        {/*TODO: implement a case for an empty table*/}
                                        <Table aria-label="collapsible table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell />
                                                    <TableCell>{table_name_col_string}</TableCell>
                                                    <TableCell>{table_role_col_string}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {row.instructors.map((tableRows) => (
                                                    <Row key={tableRows.username} row={tableRows} userType={props.userType}
                                                         handleOpenEditSchoolsDialog={props.handleOpenEditSchoolsDialog}
                                                         handleOpenCPDialog={props.handleOpenCPDialog}
                                                         handleOpenDeleteDialog={props.handleOpenDeleteDialog}
                                                         handleOpenTransferSuperDialog={props.handleOpenTransferSuperDialog}
                                                         supervisor={row.username}
                                                         supervisorName={row.name}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </ListItem>}
                                <ListItem>
                                    <ListItemText primary={actions}/>
                                </ListItem>
                            </List>
                            <br/>
                            {/* the action buttons for each user */}
                            <Grid sx={{marginBottom: 1}} container spacing={1}>
                                {/*editing actions*/}
                                <Grid item xs={1.5}><Button id={`change_password_${row.username}`} fullWidth onClick={() => props.handleOpenCPDialog(row.username, row.name)} color="secondary" variant="outlined">{change_password_button_string}</Button></Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                {/*removing user*/}
                                <Grid item xs={1.5}><Button fullWidth onClick={() => props.handleOpenDeleteDialog(row.username, row.name)} color="error" variant="outlined">{delete_user_button_string}</Button></Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

/**
 * a dialog element for removing a user
 * @param props the properties the element gets
 * @returns {JSX.Element} the element
 */
function DeleteUserDialog(props){

    const title_string = "האם את/ה בטוח/ה שהינך רוצה למחוק את";
    const delete_string = "מחק/י";
    const cancel_string = "ביטול";

    const handleSubmitDeletion = () => {
        props.callback(props.selectUser);
    }

    return (
        <Dialog titleStyle={{textAlign: "center"}} sx={{alignItems: "right"}} fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h5" align="center">?{title_string} {props.selectedName}</Typography></DialogTitle>
            <Grid container justifyContent="center" spacing={0}>
                <Grid item align="center" xs={6}>
                    {/*the cancel button*/}
                    <Button id={"remove_user_cancel_button"} onClick={() => props.onClose()} sx={{marginBottom: 1, width: "50%"}} variant="outlined">{cancel_string}</Button>
                </Grid>
                <Grid item align="center" xs={6}>
                    {/*the delete button*/}
                    <Button id={"remove_user_submit_button"} onClick={() => handleSubmitDeletion()} sx={{marginBottom: 1, width: "50%"}} color="error" variant="outlined">{delete_string}</Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}

/**
 * a dialog element for transferring supervision between users
 * @param props the properties the element gets
 * @returns {JSX.Element} the element
 */
function TransferSupervisionDialog(props){

    const title_string = `האם את/ה בטוח/ה שהינך רוצה להפוך את `;
    const title_cont_string = "למפקח/ת במקום "
    const delete_string = "אישור";
    const cancel_string = "ביטול";

    const handleSubmitDeletion = () => {
        props.callback(props.selectedSupervisorUsername, props.selectedUser);
    }

    return (
        <Dialog titleStyle={{textAlign: "center"}} sx={{alignItems: "right"}} fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h5" align="center">{title_string} {props.selectedName} {title_cont_string} {props.selectedSupervisorName}</Typography></DialogTitle>
            <Grid container justifyContent="center" spacing={0}>
                <Grid item align="center" xs={6}>
                    {/*the cancel button*/}
                    <Button id={'transfer_supervision_decline_button'} onClick={() => props.onClose()} sx={{marginBottom: 1, width: "50%"}} color={'error'} variant="outlined">{cancel_string}</Button>
                </Grid>
                <Grid item align="center" xs={6}>
                    {/*the transfer button*/}
                    <Button id={`transfer_supervision_accept_button`} onClick={() => handleSubmitDeletion()} sx={{marginBottom: 1, width: "50%"}} variant="outlined">{delete_string}</Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}

/**
 * a dialog element for changing a password for a user
 * @param props the properties the element gets
 * @returns {JSX.Element} the element
 */
function ChangePasswordDialog(props){
    const [values, setValues] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // error states
    const [error, setError] = useState(false);
    const [noMatchError, setNoMatchError] = useState(false);
    const [errorSeverity, setErrorSeverity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const title_string = "שינוי סיסמה עבור";
    const password_string = "סיסמה חדשה";
    const confirm_password_string = "אימות סיסמה";
    const change_string = "שנה/י";
    const cancel_string = "ביטול";

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
        event.preventDefault();

        if (values.newPassword === '' || values.confirmPassword === ''){
            setError(true);
            setNoMatchError(false);
            setErrorSeverity('error');
            setErrorMessage('נא למלא את כל השדות');
        }
        else{
            if (values.newPassword === values.confirmPassword){
                props.callback(props.selectedUser, values.newPassword, values.confirmPassword);
            }
            else{
                setNoMatchError(true);
                setError(false);
                setErrorSeverity('error');
                setErrorMessage('הסיסמאות שהוכנסו לא תואמות');
            }
        }
    }

    return (
        <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h5" align="center">{title_string} {props.selectedName}</Typography></DialogTitle>
            <Stack component="form" sx={{alignItems: "center"}} onSubmit={handleSubmit}>
                <Collapse in={error || noMatchError}>
                    <Alert id={`change_password_alert`} severity={errorSeverity}>
                        {errorMessage}
                    </Alert>
                </Collapse>

                {/*the new password field*/}
                {/*todo: the adornment is on the wrong side for some reason*/}
                <TextField
                    id={`change_password_new`}
                    error={noMatchError || (error && values.newPassword.trim() === '')}
                    value={values.newPassword}
                    onChange={handleTextFieldsChange('newPassword')}
                    sx={{paddingBottom: 1, width: "50%"}}
                    label={password_string}
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
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
                {/*confirm password*/}
                <TextField
                    id={`change_password_confirm`}
                    error={noMatchError || (error && values.confirmPassword.trim() === '')}
                    value={values.confirmPassword}
                    onChange={handleTextFieldsChange('confirmPassword')}
                    sx={{paddingBottom: 1, width: "50%"}}
                    label={confirm_password_string}
                    variant="outlined"
                    type={showConfirmPassword ? 'text' : 'password'}
                    InputProps={{
                       endAdornment: (
                           <InputAdornment position="end">
                               <IconButton
                                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                   onMouseDown={(event) => event.preventDefault()}
                               >
                                   {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                               </IconButton>
                           </InputAdornment>
                       ),
                   }}/>
                {/*the submit button*/}
                <Grid container justifyContent="center" spacing={0}>
                    <Grid item align="center" xs={4}>
                        {/*the cancel button*/}
                        <Button id={`change_password_cancel_button`} onClick={() => props.onClose()} sx={{marginBottom: 1, width: "50%"}} variant="outlined">{cancel_string}</Button>
                    </Grid>
                    <Grid item align="center" xs={4}>
                        {/*the change button*/}
                        <Button id={`change_password_submit_button`} type="submit" color="success" sx={{marginBottom: 1, width: "50%"}} variant="outlined">{change_string}</Button>
                    </Grid>
                </Grid>
            </Stack>
        </Dialog>
    )
}

// offline mock data for general testing of the Autocomplete component
const schools = [
    { label: "סתם", id: 1},
    { label: "כלום", id: 2},
]

/**
 * a dialog element for editing the assigned school of a user
 * @param props the properties the element gets
 * @returns {JSX.Element} the element
 */
function EditSchoolsDialog(props){
    const [searchError, setSearchError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [schoolsToSearch] = useState(props.schools)
    const [selectedSchoolSearchID, setSelectedSchoolSearchID] = useState('');
    const [searchText, setSearchText] = useState('');

    const [schoolSearchValue, setSchoolSearchValue] = useState('');
    const [selectedSchoolId, setSelectedSchoolId] = useState(-1);

    const title_string = "עריכת בתי ספר תחת";
    const search_school_string = "חפש/י בית ספר";
    const add_school_button_string = "הוספת בית ספר";
    const add_school_cancel_button_string = "סגירה";

    // tooltips' strings
    const delete_tooltip_string = "הסרת בית ספר";


    const addSchool = () => {
        const findInSchools = (label) => {
            return props.schools.find((ele) => ele.label === label) !== undefined
        }

        if (!findInSchools(searchText)){
            setSearchError(true);
            setErrorMessage("נא לבחור בית ספר מהרשימה")
        }
        else{
            setSearchError(false);
            setSchoolSearchValue('');
            setSearchText('')
            setSelectedSchoolId(-1);
            props.addSchoolCallback(props.selectedUser, schoolSearchValue, selectedSchoolSearchID);
        }
    }

    return (
        <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h5" align="center">{title_string} {props.selectedName}</Typography></DialogTitle>

            <Collapse in={searchError}>
                <Alert id={'edit_schools_alert'} sx={{marginBottom: 1}} severity="error">{errorMessage}</Alert>
            </Collapse>

            <Stack sx={{alignItems: "center"}}>
                {/*a list of the current schools assigned to the user*/}
                <List sx={{width: "50%"}}>
                    {props.selectedSchools.map((school) =>
                        <div>
                            {/*representation of each school*/}
                            <ListItem
                                secondaryAction={
                                    <Tooltip title={delete_tooltip_string}>
                                        <IconButton id={`remove_school_${school.id}`} onClick={() => props.removeSchoolCallback(props.selectedUser, school.id)} edge="end">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemText
                                    primary={school.label}
                                />

                            </ListItem>
                            <Divider component="li" />
                        </div>
                    )}
                    <ListItem>
                        {/*field for adding new school to a givel user*/}
                        {/*<TextField*/}
                        {/*    value={addSchoolName}*/}
                        {/*    onChange={handleAddSchoolNameChange}*/}
                        {/*    error={error}*/}
                        {/*    fullWidth*/}
                        {/*    InputProps={{*/}
                        {/*        endAdornment: (*/}
                        {/*            <InputAdornment position="end">*/}
                        {/*                <Tooltip title={add_tooltip_string}>*/}
                        {/*                    <IconButton*/}
                        {/*                        onClick={addSchool}*/}
                        {/*                        onMouseDown={(event) => event.preventDefault()}*/}
                        {/*                    >*/}
                        {/*                        <AddIcon color="primary"/>*/}
                        {/*                    </IconButton>*/}
                        {/*                </Tooltip>*/}
                        {/*            </InputAdornment>*/}
                        {/*        ),*/}
                        {/*    }}/>*/}

                        <Autocomplete
                            freeSolo
                            id="search-schools"
                            disableClearable
                            value={searchText}
                            onChange={(event, newValue) => {
                                setSelectedSchoolSearchID(newValue.id)
                            }}
                            onInputChange={(event, newInputValue) => {
                                setSearchText(newInputValue);
                            }}
                            options={props.schools}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={search_school_string}
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    error={searchError}
                                    sx={{marginBottom: "2%"}}
                                />
                            )}
                            fullWidth
                        />

                        {/*<Autocomplete*/}
                        {/*    disablePortal*/}
                        {/*    value={schoolSearchValue}*/}
                        {/*    onChange={function (event, newValue){*/}
                        {/*            if (newValue !== null){*/}
                        {/*                setSchoolSearchValue(newValue.label);*/}
                        {/*                setSelectedSchoolId(newValue.id);*/}
                        {/*            }*/}
                        {/*        }*/}
                        {/*    }*/}
                        {/*    options={props.schoolsToSearch}*/}
                        {/*    // todo: is the below thingy bad?*/}
                        {/*    isOptionEqualToValue={(option, value) => true}*/}
                        {/*    fullWidth*/}
                        {/*    renderInput={(params) => <TextField {...params} label={search_school_string} error={error} />}*/}
                        {/*/>*/}
                    </ListItem>
                </List>
                <Button id={'edit_schools_add_school_button'} onClick={addSchool} variant='contained'>{add_school_button_string}</Button>

                <Button id={'edit_schools_cancel_button'} sx={{margin: '1%'}} onClick={() => props.onClose()} variant={'contained'} color={'success'} >{add_school_cancel_button_string}</Button>


            </Stack>
        </Dialog>
    )
}

// data for offline testing
const rows_supervisor = [
    createData("Ronit", 'רונית שושי', "מפקחת", "ronit@post.bgu.ac.il", "000-123-4567", "פתח תקווה", ["מקיף ז'", "רגר"], []),
    createData("Shoshi", 'שושי רונית', "מדריכה", "shoshi@post.bgu.ac.il", "002-123-4567", "ירוחם", ["יהלום", "שהם"], []),
];

const rows_system_manager = [
    createData("Ronit", 'רונית שושי', "אנא ערף", "ronit@post.bgu.ac.il", "000-123-4567", "פתח תקווה", ["מקיף ז'", "רגר"],
        [createData("anakin", 'אנקין', "מדריכה", "ana@post.bgu.ac.il", "000-123-4567", "naboo", ["מקיף ז'", "רגר"], [])]),
    createData("Shoshi", 'שושי רונית', "לא יודע", "shoshi@post.bgu.ac.il", "002-123-4567", "ירוחם", ["יהלום", "שהם"], []),
]

export default function UsersManagement(props){
    const [tableRows, setTableRows] = useState([]); // props.userType === "SUPERVISOR" ? rows_supervisor : rows_system_manager

    // dialogs states
    const [openCPDialog, setOpenCPDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditSchoolsDialog, setOpenEditSchoolsDialog] = useState(false);

    const [selectedUser, setSelectedUser] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [schoolsToSearch, setSchoolsToSearch] = useState([])

    // supervision dialog
    const [openSupervisionTransferDialog, setOpenSupervisionTransferDialog] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [selectedSupervisorName, setSelectedSupervisorName] = useState('');

    // snackbar states
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const table_name_col_string = 'שם';
    const table_role_col_string = 'תפקיד';
    const table_work_field_col_string = "תחום המפקחת";
    const page_title_string = 'ניהול משתמשים';

    let navigate = useNavigate();

    useEffect(() => {
        props.setHideBars(false);
        
        setTimeout(() => {
            if(props.userType === "SUPERVISOR"){
                new Connection().getAppointedUsers(handleReceivedData);
            }
            else if(props.userType === "SYSTEM_MANAGER"){
                new Connection().getAllUsers(handleReceivedData);
            }
        }, 1000)

        let timer = setTimeout(() => {
            if(window.sessionStorage.getItem('auth_result')){
                setOpenSnackbar(true)
                setSnackbarSeverity(window.sessionStorage.getItem('auth_result'))
                setSnackbarMessage(window.sessionStorage.getItem('auth_message'))

                window.sessionStorage.removeItem('auth_result');
                window.sessionStorage.removeItem('auth_message');
            }
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, []);


    /**
     * handler for the response from the server for the table data
     * @param data the table data to arrange
     */
    const handleReceivedData = (data) => {
        if (!data.failure){
            let rows = [];
            let school_id_map = JSON.parse(window.sessionStorage.getItem('schools'));
            if (props.userType === "SUPERVISOR") {
                for (const row of data.result) {
                    let role = "";

                    if (row.userStateEnum === "INSTRUCTOR") {
                        role = "מדריכ/ה";
                    } else if (row.userStateEnum === "SUPERVISOR") {
                        role = "מפקח/ת" + row.workField;
                    } else if (row.userStateEnum === "GENERAL_SUPERVISOR") {
                        role = "מפקח/ת כללי/ת";
                    }

                    // for live updating of the dialog while adding school to a user
                    if (selectedUser === row.username) {
                        setSelectedSchools(row.schools);
                    }

                    // not including admins in the table
                    if (row.username === 'admin') { //todo: is that considered hardcoded?
                        continue;
                    }

                    let user_schools = school_id_map.filter((element) => row.schools.includes(element.id))

                    rows.push(createData(
                        row.username,
                        row.firstName + " " + row.lastName,
                        role,
                        row.email,
                        row.phoneNumber,
                        row.city,
                        user_schools,
                        []
                    ));
                }
            }
            else if(props.userType === "SYSTEM_MANAGER"){

                console.log('hello there')
                console.log(data.result)

                let workFieldsDict = {}
                // first iteration to get all the work fields
                for (const row of data.result) {
                    if (row.userStateEnum === "SUPERVISOR") {
                        workFieldsDict[row.workField] = []
                    }
                }

                // second iteration to populate with the instructors and general supervisors
                for (const row of data.result) {
                    if (row.userStateEnum === "INSTRUCTOR" || row.userStateEnum === "GENERAL_SUPERVISOR") {
                        let role = "";

                        if (row.userStateEnum === "INSTRUCTOR") {
                            role = "מדריכ/ה";
                        } else if (row.userStateEnum === "GENERAL_SUPERVISOR") {
                            role = "מפקח/ת כללי/ת";
                        }
                        console.log(row.username)
                        workFieldsDict[row.workField].push(createData(
                            row.username,
                            row.firstName + " " + row.lastName,
                            role,
                            row.email,
                            row.phoneNumber,
                            row.city,
                            row.schools,
                            []
                        ));
                    }
                }

                // third iteration to populate with the supervisors
                for (const row of data.result) {
                    if (row.userStateEnum === "SUPERVISOR"){
                        rows.push(createData(
                            row.username,
                            row.firstName + " " + row.lastName,
                            row.workField,
                            row.email,
                            row.phoneNumber,
                            row.city,
                            row.schools,
                            workFieldsDict[row.workField]
                        ));
                    }
                }
            }

            setTableRows(rows);
        }
    }

    /**
     * refreshes the new table
     */
    const refreshData = () => {
        if(props.userType === "SUPERVISOR"){
            new Connection().getAppointedUsers(handleReceivedData);
        }
        else if(props.userType === "SYSTEM_MANAGER"){
            new Connection().getAllUsers(handleReceivedData);
        }
    }

    // USER DELETION DIALOG

    /**
     * handles the opening of the dialog to delete a selected user
     * @param username the selected user
     * @param name the name of the selected user
     */
    const handleOpenDeleteDialog = (username, name) => {
        setOpenDeleteDialog(true);
        setSelectedUser(username);
        setSelectedName(name);
    }

    /**
     * handles the closing of the dialog for deleting a selected user
     */
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    /**
     * callback for the response of the server for the deletion of a user request
     * @param data the response from the server
     */
    const userDeletionCallback = (data) => {
        props.setAuthAvailability(false);

        if(!data.failure){
            window.sessionStorage.setItem('auth_result', "success");
            window.sessionStorage.setItem('auth_message', "המשתמש נמחק בהצלחה");
        }
        else{
            window.sessionStorage.setItem('auth_result', "error");
            window.sessionStorage.setItem('auth_message', "אירעה שגיאה. אנא נסה/י שנית");
        }
    }

    /**
     * handler for deleting a user. sends a request to the server to delete the given user
     * @param username the user to delete
     */
    const handleUserDeletion = (username) => {
        props.setAuthCallBack(() => () =>
            new Connection().removeUser( username, userDeletionCallback)
        );
        props.setAuthAvailability(true);
        props.setAuthCalleePage('../home');
        props.setAuthGoToPage('../home');
        navigate(`../auth`, {replace: true})
    }

    // CHANGE USER PASSWORD DIALOG

    /**
     * handles the opening of the dialog to change password to a selected user
     * @param username the selected user
     * @param name the name of the selected user
     */
    const handleOpenCPDialog = (username, name) => {
        setOpenCPDialog(true);
        setSelectedUser(username);
        setSelectedName(name);
    }

    /**
     * handles the closing of the dialog for changing the password for a selected user
     */
    const handleCloseCPDialog = () => {
        setOpenCPDialog(false);
    }

    /**
     * callback for the response of the server for the changing a password for a user
     * @param data the response from the server
     */
    const userChangePasswordCallback = (data) => {
        props.setAuthAvailability(false);
        if (!data.failure){
            window.sessionStorage.setItem('auth_result', "success");
            window.sessionStorage.setItem('auth_message', "הסיסמה שונתה בהצלחה");
        }
        else{
            window.sessionStorage.setItem('auth_result', "error");
            window.sessionStorage.setItem('auth_message', 'הסיסמה לא שונתה');
        }
    }

    /**
     * handler for changing the password of a user. sends a request to the server to change the password of the given user
     * @param username the user to change the password to
     * @param newPassword the new password of the user
     * @param newPasswordConfirmation confirmation of the password
     */
    const handleUserChangePassword = (username, newPassword, newPasswordConfirmation) => {
        setOpenCPDialog(false);

        props.setAuthCallBack(() => () => new Connection().changePasswordToUser(
            username, newPassword, newPasswordConfirmation, userChangePasswordCallback));
        props.setAuthAvailability(true);
        props.setAuthCalleePage('../home');
        props.setAuthGoToPage('../home');
        navigate(`../auth`, {replace: true})
    }

    // MAKE USER SUPERVISOR DIALOG

    /**
     * handles the opening of the dialog to change password to a selected user
     * @param username the selected user
     * @param name the name of the selected user
     * @param supervisorName the name of the selected supervisor
     * @param supervisorUsername the username of the selected supervisor
     */
    const handleOpenSupervisionTransferDialog = (name, username, supervisorName, supervisorUsername) => {
        setOpenSupervisionTransferDialog(true);
        setSelectedUser(username);
        setSelectedName(name);
        setSelectedSupervisor(supervisorUsername);
        setSelectedSupervisorName(supervisorName)
    }

    /**
     * handles the closing of the dialog for changing the password for a selected user
     */
    const handleCloseSupervisionTransferDialog = () => {
        setOpenSupervisionTransferDialog(false);
    }

    /**
     * callback for the response of the server for transferring supervision
     * @param data the response from the server
     */
    const makeUserSupervisorCallback = (data) => {
        props.setAuthAvailability(false);
        if (!data.failure){

            window.sessionStorage.setItem('auth_result', "success");
            window.sessionStorage.setItem('auth_message', "הפעולה הסתייה בהצלחה");
        }
        else{
            window.sessionStorage.setItem('auth_result', "error");
            window.sessionStorage.setItem('auth_message', "הפעולה נכשלה. אנא נסה/י שוב");
        }
    }

    /**
     * handler for transferring supervision between two users
     * @param currentSupervisor the supervisor from which we are revoking the supervision
     * @param newSupervisor the user to which we give supervision
     */
    const handleMakeUserSupervisor = (currentSupervisor, newSupervisor) => {
        setOpenSupervisionTransferDialog(false);
        props.setAuthCallBack(() => () => new Connection().transferSupervisionToExistingUser(
            currentSupervisor, newSupervisor, makeUserSupervisorCallback));
        props.setAuthAvailability(true);
        props.setAuthCalleePage('../home');
        props.setAuthGoToPage('../home');
        navigate(`../auth`, {replace: true})
    }
    // EDIT SCHOOLS DIALOG

    /**
     * handles the opening of the dialog to edit the assigned school of a selected user
     * @param username the selected user
     * @param name the name of the selected user
     * @param schools the schools of the selected user
     */
    const handleOpenEditSchoolsDialog = (username, name, schools) => {
        setOpenEditSchoolsDialog(true);
        setSelectedUser(username);
        setSelectedName(name);
        setSelectedSchools(schools)
    }

    /**
     * handles the closing of the dialog for editing the assigned schools of a selected user
     */
    const handleCloseEditSchoolsDialog = () => {
        setOpenEditSchoolsDialog(false);
    }

    /**
     * a callback for the response from the server regarding adding an assigned school to a user request
     * @param data the response from the server
     */
    const userAddSchoolCallback = (data) => {
        if (!data.failure){
            setSnackbarSeverity('success');
            setSnackbarMessage('בית הספר הוסף בהצלחה למשתמש');
            setOpenSnackbar(true);
            refreshData();
        }
        else {
            setSnackbarSeverity('error');
            setSnackbarMessage('הפעולה להוספת בית ספר למשתמש נכשלה');
            setOpenSnackbar(true);

        }
    }

    /**
     * handler for sending a request to add a school assigned to a selected user
     * @param username the selected user
     * @param schoolName the name of the school to assign to the selected user
     * @param schoolId the id of the school to assign to the selected user
     */
    const handleUserAddSchool = (username, schoolName, schoolId) => {
        setOpenEditSchoolsDialog(false);
        new Connection().assignSchoolToUser(username, schoolId, userAddSchoolCallback)
    }

    /**
     * a callback for the response from the server regarding removing an assigned school from a user request
     * @param data the response from the server
     */
    const userRemoveSchoolCallback = (data) => {
        if (!data.failure){
            setSnackbarSeverity('success');
            setSnackbarMessage('בית הספר הוסר בהצלחה מהמשתמש');
            setOpenSnackbar(true);
            setOpenEditSchoolsDialog(false);
            refreshData();
        }
        else {
            setSnackbarSeverity('error');
            setSnackbarMessage('הפעולה להסרת בית ספר ממשתמש נכשלה');
            setOpenSnackbar(true);
        }
    }

    /**
     * handler for sending a request to add a school assigned to a selected user
     * @param username the selected user
     * @param schoolId the id of the school to remove from the selected user
     */
    const handleUserRemoveSchool = (username, schoolId) => {
        setOpenEditSchoolsDialog(false);
        new Connection().removeSchoolFromUser(username, schoolId, userRemoveSchoolCallback)
    }


    return (
        <Space.Fill scrollable>
            <div id="Manage-users">
                <h1>{page_title_string}</h1>
                {/* adding new users button */}
                <div>
                    <Button id={'register_users_button'} variant="outlined" color="secondary" onClick={() => navigate('../registerUsers')}>הוספת משתמש</Button>
                </div>

                {/*supervisor table*/}
                {props.userType === "SUPERVISOR" && <TableContainer id="Manage-users-table-supervisor" component={Paper}>
                    {/* the table */}
                    {/*TODO: implement a case for an empty table*/}
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>{table_name_col_string}</TableCell>
                                <TableCell>{table_role_col_string}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((tableRows) => (
                                <Row key={tableRows.username} row={tableRows} userType={props.userType}
                                     handleOpenEditSchoolsDialog={handleOpenEditSchoolsDialog}
                                     handleOpenCPDialog={handleOpenCPDialog}
                                     handleOpenDeleteDialog={handleOpenDeleteDialog}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}

                {/*system manager table*/}
                {props.userType === "SYSTEM_MANAGER" && <TableContainer id="Manage-users-table-system-manager" component={Paper}>
                    {/* the table */}
                    {/*TODO: implement a case for an empty table*/}
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>{table_name_col_string}</TableCell>
                                <TableCell>{table_work_field_col_string}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((tableRows) => (
                                <SystemManagerRow key={tableRows.username} row={tableRows} userType={props.userType}
                                                  handleOpenTransferSuperDialog={handleOpenSupervisionTransferDialog}
                                                  handleOpenEditSchoolsDialog={handleOpenEditSchoolsDialog}
                                                  handleOpenCPDialog={handleOpenCPDialog}
                                                  handleOpenDeleteDialog={handleOpenDeleteDialog}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}

                {/*change password dialog pop up*/}
                <ChangePasswordDialog
                    selectedUser={selectedUser}
                    selectedName={selectedName}
                    open={openCPDialog}
                    onClose={handleCloseCPDialog}
                    callback={handleUserChangePassword}
                />

                {/*delete user dialog pop up*/}
                <DeleteUserDialog
                    selectUser={selectedUser}
                    selectedName={selectedName}
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    callback={handleUserDeletion}
                />

                {/*edit schools dialog pop up*/}
                <EditSchoolsDialog
                    selectedUser={selectedUser}
                    selectedName={selectedName}
                    selectedSchools={selectedSchools}
                    schools={props.schools}
                    open={openEditSchoolsDialog}
                    onClose={handleCloseEditSchoolsDialog}
                    addSchoolCallback={handleUserAddSchool}
                    removeSchoolCallback={handleUserRemoveSchool}/>

                {/*transfer supervision dialog pop up*/}
                <TransferSupervisionDialog
                    selectedUser={selectedUser}
                    selectedName={selectedName}
                    selectedSupervisorUsername={selectedSupervisor}
                    selectedSupervisorName={selectedSupervisorName}
                    open={openSupervisionTransferDialog}
                    onClose={handleCloseSupervisionTransferDialog}
                    callback={handleMakeUserSupervisor}
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