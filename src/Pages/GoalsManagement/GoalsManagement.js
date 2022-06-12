import React, { useState, useEffect } from "react";
import './GoalsManagement.css'
import * as Space from 'react-spaces';
import { Alert,
    Box, Button,
    Collapse, Dialog, DialogTitle, FormControl, Grid,
    IconButton, InputLabel, List, ListItem, ListItemText, MenuItem,
    Paper, Select, Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Connection from "../../Communication/Connection";
import gematriya from "gematriya";
import {add} from "react-big-calendar/lib/utils/dates";
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";

// TODO: have the option to edit a goal

/**
 * a function that returns an object containing the data for a row in the table
 * @param title the title of the goal
 * @param description the description of the goal
 * @param weight the weight of the goal
 * @param quarter the quarter of the goal
 * @returns {{description, weight, title, quarter}}
 */
function createData(id, title, description, quarter, weight) {
    return {
        id,
        title,
        description,
        quarter,
        weight
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

    const goal_description_string = "תיאור היעד";

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                {/* the arrow to open the extra info */}
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {/* main goal's info */}
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.quarter}</TableCell>
                <TableCell>{row.weight}</TableCell>
                {/*goal deletion button*/}
                <TableCell>
                    <IconButton id={`delete_goal_${row.id}`} color="error" onClick={() => props.handleOpenDeleteDialog(row.id)}>
                        <DeleteIcon/>
                    </IconButton>
                </TableCell>
            </TableRow>
            {/*secondary goal's into*/}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1}}>
                            <List
                                sx={{
                                    width: "40%",
                                    bgcolor: "background.paper",
                                }}
                            >
                                <ListItem>
                                    <ListItemText primary={goal_description_string} secondary={row.description}/>
                                </ListItem>
                            </List>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

        </React.Fragment>
    )
}

function NewGoalForm(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState(0);
    const [quarter, setQuarter] = useState(0);
    const [years, setYears] = useState([]);
    const [hebrewYear, setHebrewYear] = useState(0);

    // errors
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)

    const form_title_string = "הוספת יעד חדש";
    const form_title_field_label_string = "כותרת היעד";
    const form_description_field_label_string = "תיאור היעד";
    const form_choose_quarter_string = "בחירת רבעון";
    const form_quarter_string = "רבעון השלמת היעד";
    const form_choose_weight_string = "בחירת משקל";
    const form_weight_string = "משקל היעד";
    const form_choose_year_string = "בחירת שנה";
    const form_year_string = "שנת לימודים";
    const form_add_button_string = "הוספ/י יעד";

    useEffect(() => {
        // calculating the numeric hebrew years
        let years_range = [];
        let currentYear = new Date().getFullYear();
       

        let delta = -7;

        while (delta <= 7) { // calculating up to 7 previous and ahead years
            years_range.push(currentYear + delta);
            delta++;
        }

        //setHebrewYear(gematriya(currentYear + 3760, {punctuate: true, limit: 3}))
        setYears(years_range);
    }, []);


    /**
     * handles the change of the title
     * @param event the change of the element bound to the function
     */
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    /**
     * handles the change of the description
     * @param event the change of the element bound to the function
     */
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }

    /**
     * handles the change of the selection of quarter
     * @param event the selection element bound to the function
     */
    const handleQuarterChange = (event) => {
        setQuarter(event.target.value);
    };

    /**
     * handles the change of the selection of weight
     * @param event the selection element bound to the function
     */
    const handleWeightChange = (event) => {
        setWeight(event.target.value);
    };

    /**
     * handles the change of the selection of year
     * @param event the selection element bound to the function
     */
    const handleYearChange = (event) => {
        setHebrewYear(event.target.value);
    }

    const submitCallback = (data) => {
        if(data.failure){
            props.setOpenSnackbar(true);
            props.setSnackbarSeverity("error");
            props.setSnackbarMessage("היעד לא הוסף");
        }
        else{
            props.setOpenSnackbar(true);
            props.setSnackbarSeverity("success");
            props.setSnackbarMessage("יעד הוסף בהצלחה");

            setTitle('');
            setDescription('');
            setWeight(0);
            setQuarter(0);
            setHebrewYear('');
            props.refreshData();
        }
    }

    /**
     * handles the submission of the add goal form (collecting and sending the data of the form)
     * @param event
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        if(title === '' || description === ''){
            setError(true);
            setOpenSnackbar(true)
            setErrorMessage("נא למלא את כל השדות");
        }
        else{
            setError(false);
            new Connection().addGoal(
                {
                    goalId: -1,
                    title: title,
                    description: description,
                    quarterly: quarter,
                    weight: weight,
                },
                hebrewYear,
                submitCallback);
        }
    }

    return (
            <Paper sx={{marginTop: "1%"}} elevation={2}>

                <Stack
                    component="form"
                    onSubmit={handleSubmit}
                    spacing={2}
                    sx={{
                        '& .MuiTextField-root': { width: '100%' },
                        paddingBottom: "1%",
                        paddingTop: "1%",
                        paddingLeft: "1%",
                        paddingRight: "1%"
                    }}
                    noValidate
                    autoComplete="off">

                    <Typography sx={{paddingLeft: "1%"}} variant="h5">{form_title_string}</Typography>

                    {/*alert*/}
                    <Collapse in={error}>
                        <Alert id={"add_goal_alert"} severity="error">{errorMessage}</Alert>
                    </Collapse>

                    {/*form title*/}
                    <TextField
                        id={"add_goal_title"}
                        name="title"
                        value={title}
                        onChange={handleTitleChange}
                        label={form_title_field_label_string}
                        error={error && title.trim() === ''}
                    />

                    {/*form description*/}
                    <TextField
                        id={"add_goal_description"}
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        label={form_description_field_label_string}
                        multiline
                        rows={4}
                        error={error && description.trim() === ''}
                    />

                    {/*form weight select*/}
                    <FormControl error={error && weight === 0} sx={{width: "40%"}}>
                        <InputLabel id="weight-label">{form_weight_string}</InputLabel>
                        <Select
                            id={"add_goal_weigh_selection"}
                            labelId="weight-label"
                            value={weight}
                            label={form_weight_string}
                            onChange={handleWeightChange}
                        >
                            <MenuItem value={0}>{form_choose_weight_string}</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                        </Select>
                    </FormControl>

                    {/*form quarter select*/}
                    <FormControl error={error && quarter === 0} sx={{width: "40%"}}>
                        <InputLabel id="quarter-label">{form_quarter_string}</InputLabel>
                        <Select
                            id={"add_goal_quarter_selection"}
                            labelId="quarter-label"
                            value={quarter}
                            label={form_quarter_string}
                            onChange={handleQuarterChange}
                        >
                            <MenuItem value={0}>{form_choose_quarter_string}</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                        </Select>
                    </FormControl>

                    {/*hebrew year picker*/}
                    <FormControl error={error && hebrewYear === 0} sx={{width: "40%"}}>
                        <InputLabel id="year-label">{form_year_string}</InputLabel>
                        <Select
                            id={"add_goal_hebrew_year_picker"}
                            labelId="year-label"
                            value={hebrewYear}
                            label={form_year_string}
                            onChange={handleYearChange}
                        >
                            <MenuItem value={0}>{form_choose_year_string}</MenuItem>
                            {years.map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/*form submit button*/}
                    <Button id={"add_goal_submit_button"} type="submit" variant={"contained"} sx={{width: "20%", marginBottom: "1%"}}>{form_add_button_string}</Button>
                </Stack>
                {/*notification snackbar*/}
                <NotificationSnackbar
                    open={openSnackbar}
                    setOpen={setOpenSnackbar}
                    severity={'error'}
                    message={errorMessage}/>
            </Paper>
    );
}

function DeleteGoalDialog(props){
    const title_string = "האם את/ה בטוח/ה שהינך רוצה למחוק את היעד";
    const delete_string = "מחק/י";
    const cancel_string = "ביטול";

    const handleSubmitDeletion = () => {
        props.callback(props.goalID);
    }

    return (
        <Dialog id={"delete_goal_dialog"} titleStyle={{textAlign: "center"}} sx={{alignItems: "right"}} fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h5" align="center">?{title_string}</Typography></DialogTitle>
            <Grid container justifyContent="center" spacing={0}>
                <Grid item align="center" xs={6}>
                    {/*the cancel button*/}
                    <Button id={"delete_goal_cancel"} onClick={() => props.onClose()} sx={{marginBottom: 1, width: "50%"}} variant="outlined">{cancel_string}</Button>
                </Grid>
                <Grid item align="center" xs={6}>
                    {/*the delete button*/}
                    <Button id={"delete_goal_submit"} onClick={() => handleSubmitDeletion()} sx={{marginBottom: 1, width: "50%"}} color="error" variant="outlined">{delete_string}</Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}


const rows = [
    createData(0, "the tragedy of darth plaguis the wise", "Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.", 1, 3),
]

export default function GoalsManagement(props){
    const [tableRows, setTableRows] = useState([]);
    const [showNewGoalForm, setShowNewGoalForm] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedGoalID, setSelectedGoalID] = useState(-1);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [addButtonPressed, setAddButtonPressed] = useState(false);

    const year_to_view_string = "שנה להצגה";
    const page_title_string = "ניהול יעדים";
    const goal_title_cell_head_string = "יעד";
    const goal_quarter_cell_head_string = "רבעון";
    const goal_weight_cell_head_string = "משקל";
    const goal_actions_cell_head_string = "פעולות";
    const add_goal_button_string = "הוספת יעד";

    useEffect(() => {

        let years_range = [];
        let currentYear = new Date().getFullYear();

        let delta = -7;

        while (delta <= 7) { // calculating up to 7 previous and ahead years
            years_range.push(currentYear + delta);
            delta++;
        }

        setYears(years_range);

        //setSelectedYear(gematriya(year + 3760, {punctuate: true, limit: 3}));
        setSelectedYear(currentYear)
        new Connection().getGoals(currentYear,
            handleReceivedData);
    }, []);

    /**
     * refreshes the new table
     */
    const refreshData = () => {
        new Connection().getGoals(selectedYear, handleReceivedData);
    }

    /**
     * handler for the response from the server for the table data
     * @param data the table data to arrange
     */
    const handleReceivedData = (data) => {
        if(!data.failure){
            let rows = []

            for (const row of data.result){
                rows.push(createData(
                    row.goalId,
                    row.title,
                    row.description,
                    row.quarterly,
                    row.weight,
                ));
            }

            setTableRows(rows);
        }
    }

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);

        new Connection().getGoals(event.target.value, handleReceivedData);
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    }

    /**
     * handles the opening of the dialog to delete a selected goal
     * @param goalID the selected goal
     */
    const handleOpenDeleteDialog = (goalID) => {
        setOpenDeleteDialog(true);
        setSelectedGoalID(goalID);
    }

    /**
     * handles the closing of the dialog for deleting a selected goal
     */
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    const deleteGoalCallback = (data) => {
        if (!data.failure){
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage("היעד נמחק בהצלחה");
            refreshData();
        }
        else{
            setOpenSnackbar(true);
            setSnackbarSeverity("error");
            setSnackbarMessage("הפעולה נכשלה. אנא נסה/י שנית");
        }
    }

    /**
     * handler for removing a goal
     * @param goalID the id of the goal
     */
    const handleDeleteGoal = (goalID) => {

        new Connection().removeGoal(
            selectedYear,
            goalID,
            deleteGoalCallback
        )

        setOpenDeleteDialog(false);
    }

    return (
        <Space.Fill scrollable>
            <div id="Manage-goals">
                <h1>{page_title_string}</h1>
                <div id="Add-goal-button-div">
                    <Button id={"goal_management_add_goal_collapse_button"} onClick={function () {setShowNewGoalForm(!showNewGoalForm); setAddButtonPressed(!addButtonPressed)}}
                        variant={addButtonPressed ? "outlined" : "contained"} startIcon={addButtonPressed ? <ExpandLessIcon/> : <ExpandMoreIcon/>}>
                        {add_goal_button_string}</Button>
                    {/*collapsed new goal form*/}
                    <Collapse sx={{width: "40%"}} in={showNewGoalForm}><NewGoalForm setOpenSnackbar={setOpenSnackbar}
                                                                                    setSnackbarSeverity={setSnackbarSeverity}
                                                                                    setSnackbarMessage={setSnackbarMessage}
                                                                                    refreshData={refreshData}/></Collapse>
                </div>


                {/*the table presenting the goals*/}
                <TableContainer sx={{width: "80%", marginTop: "1%"}} component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <FormControl sx={{width: "50%", marginTop: "3%"}}>
                                    <InputLabel>{year_to_view_string}</InputLabel>
                                    <Select
                                        id={"goals_management_year_selection"}
                                        value={selectedYear}
                                        onChange={handleYearChange}
                                        label={year_to_view_string}
                                    >
                                        {years.map((year) => (
                                            <MenuItem value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableRow>
                            <TableRow>
                                <TableCell/>
                                <TableCell>{goal_title_cell_head_string}</TableCell>
                                <TableCell>{goal_quarter_cell_head_string}</TableCell>
                                <TableCell>{goal_weight_cell_head_string}</TableCell>
                                <TableCell>{goal_actions_cell_head_string}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((tableRow) => (
                                <Row key={tableRow.id} row={tableRow}
                                     handleOpenDeleteDialog={handleOpenDeleteDialog}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/*notification snackbar*/}
                <NotificationSnackbar
                    open={openSnackbar}
                    setOpen={setOpenSnackbar}
                    severity={snackbarSeverity}
                    message={snackbarMessage}/>

                {/*deleting a goal dialog*/}
                <DeleteGoalDialog
                    open={openDeleteDialog}
                    goalID={selectedGoalID}
                    onClose={handleCloseDeleteDialog}
                    callback={handleDeleteGoal}
                />
            </div>
        </Space.Fill>
    );
}