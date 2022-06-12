import React, {useCallback, useEffect, useState} from "react";
import './WorkPlan.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// COMPONENTS
import * as Space from 'react-spaces';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import Connection from "../../Communication/Connection";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import 'moment/locale/he'
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";
import {
    Alert, Autocomplete,
    Box,
    Button,
    Collapse, Dialog, DialogTitle,
    FormControl, Grid,
    InputLabel, MenuItem,
    Paper, Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DateTimePicker, StaticDateTimePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from "date-fns/locale";

const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment); // localizer to represent the data according to our location (israel)

const timezoneOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

function NewActivityForm(props) {
    const [title, setTitle] = useState('');
    const [years, setYears] = useState([])
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedGoal, setSelectedGoal] = useState(-1)
    const [selectedSchoolSearchID, setSelectedSchoolSearchID] = useState('')
    const [searchText, setSearchText] = useState('')
    const [activityStart, setActivityStart] = useState(new Date())
    const [activityEnd, setActivityEnd] = useState(new Date())


    const [goals, setGoals] = useState([])

    // errors
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)

    const form_title_string = "הוספת פעילות חדשה";
    const form_title_field_label_string = "כותרת הפעילות";
    const form_year_label_string = 'בחירת שנת היעדים';
    const form_choose_goal_string = "בחירת יעד";
    const form_goal_string = "יעד";
    const search_school_string = "חיפוש בתי ספר";
    const activity_start_label_string = "תאריך ושעת התחלה";
    const activity_end_label_string = "תאריך ושעת סיום";
    const form_add_button_string = "הוספ/י פעילות";

    useEffect(() => {
        new Connection().getGoals(selectedYear, arrangeGoalsData) // getting the goals

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
     * arranges the data received from the server regarding the goals
     * @param data the data from the server
     */
    const arrangeGoalsData = (data) => {

        if(!data.failure){
            setSelectedGoal(-1);
            setGoals([])

            for (const row of data.result){
                setGoals(goals => [...goals, {value: row.goalId, description: row.title}]);
            }
        }
    }

    /**
     * on change handler for selecting a new year
     * @param event the element on which the on change happened
     */
    const yearChange = (event) => {
        setSelectedYear(event.target.value)

        new Connection().getGoals(event.target.value, arrangeGoalsData) // getting the new goals
    }

    /**
     * handles the submission of the add goal form (collecting and sending the data of the form)
     * @param event
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        if(title.trim() === '' || selectedGoal === -1 || selectedSchoolSearchID === -1){
            setError(true);
            setErrorMessage("נא למלא את כל השדות");
        }
        else{
            setError(false);
            props.callback(title, selectedGoal, selectedSchoolSearchID, activityStart, activityEnd)

            // resetting the data
            setTitle('')
            setSelectedGoal(-1)
            setSelectedSchoolSearchID(-1)
            setSearchText('')
            setActivityStart(new Date())
            setActivityEnd(new Date())
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
                    <Alert id={"add_activity_alert"} severity="error">{errorMessage}</Alert>
                </Collapse>

                {/*form title*/}
                <TextField
                    id={"add_activity_title"}
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    label={form_title_field_label_string}
                    error={error && title.trim() === ''}
                />

                {/*form year select*/}
                <FormControl  sx={{width: "40%"}}>
                    <InputLabel>{form_year_label_string}</InputLabel>
                    <Select
                        value={selectedYear}
                        label={form_year_label_string}
                        onChange={yearChange}
                    >
                        {years.map(year => <MenuItem value={year}>{year}</MenuItem>)}
                    </Select>
                </FormControl>

                {/*form goal select*/}
                <FormControl error={error && selectedGoal === -1} sx={{width: "40%"}}>
                    <InputLabel>{form_goal_string}</InputLabel>
                    <Select
                        id={"add_activity_goal_selection"}
                        value={selectedGoal}
                        label={form_goal_string}
                        onChange={(event) => setSelectedGoal(event.target.value)}
                    >
                        <MenuItem value={-1}>{form_choose_goal_string}</MenuItem>
                        {goals.map(goal => <MenuItem value={goal.value}>{goal.description}</MenuItem>)}
                    </Select>
                </FormControl>

                {/*school search*/}
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
                            error={error && selectedSchoolSearchID === -1}
                            sx={{marginBottom: "2%"}}
                        />
                    )}
                    fullWidth
                />

                {/*activity start*/}
                <LocalizationProvider locale={he} dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        displayStaticWrapperAs="desktop"
                        label={activity_start_label_string}
                        value={activityStart}
                        onChange={(newValue) => {
                            setActivityStart(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="dd/MM/yyyy hh:mm a"
                    />
                </LocalizationProvider>

                {/*activity start*/}
                <LocalizationProvider locale={he} dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        displayStaticWrapperAs="desktop"
                        label={activity_end_label_string}
                        value={activityEnd}
                        onChange={(newValue) => {
                            setActivityEnd(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="dd/MM/yyyy hh:mm a"
                    />
                </LocalizationProvider>

                {/*form submit button*/}
                <Button id={"add_activity_submit_button"} type="submit" variant={"contained"} sx={{width: "20%", marginBottom: "1%"}}>{form_add_button_string}</Button>
            </Stack>
        </Paper>
    );
}

function RemoveActivityDialog(props){
    const title_string = "האם את/ה בטוח/ה שהינך רוצה למחוק את הפעילות";
    const delete_string = "מחק/י";
    const cancel_string = "ביטול";

    const handleSubmitDeletion = () => {
        props.callback(props.activityStart);
    }

    return (
        <Dialog id={"remove_activity_dialog"} titleStyle={{textAlign: "center"}} sx={{alignItems: "right"}} fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h5" align="center">?{title_string}</Typography></DialogTitle>
            <Grid container justifyContent="center" spacing={0}>
                <Grid item align="center" xs={6}>
                    {/*the cancel button*/}
                    <Button id={"remove_activity_cancel"} onClick={() => props.onClose()} sx={{marginBottom: 1, width: "50%"}} variant="outlined">{cancel_string}</Button>
                </Grid>
                <Grid item align="center" xs={6}>
                    {/*the delete button*/}
                    <Button id={"remove_activity_submit"} onClick={() => handleSubmitDeletion()} sx={{marginBottom: 1, width: "50%"}} color="error" variant="outlined">{delete_string}</Button>
                </Grid>
            </Grid>
        </Dialog>
    )
}

// dummy data for offline testing
// const myEventsList = [
//     {
//         title: "בטיחות במעבדה",
//         start: "May 6th 2022, 13:00:00 pm",
//         end: "May 6th 2022, 15:00:00 pm",
//         allDay: false,
//         resource: "https://momentjs.com/",
//     },
//
//     // {
//     //     title: "קידום תלמידים",
//     //     start: "7/5/2022",
//     //     end: "7/5/2022",
//     //     allDay: false,
//     //     resource: "https://momentjs.com/",
//     // },
//
//     {
//         title: "שעות פרטניות",
//         start: "1/10/2022",
//         end: "1/10/2022",
//         allDay: false,
//         resource: "https://momentjs.com/",
//     }
// ]

const myEventsList = [
    {
        title: "dunno",
        start: new Date(2022, 4, 13, 8, 0, 0), // that's how you do it
        end: new Date(2022, 4, 13, 10, 0, 0),
    },
    {
        title: "בטיחות במעבדה",
        start: new Date(2022, 4, 13, 13, 0, 0), // that's how you do it
        end: new Date(2022, 4, 13, 14, 0, 0),
    },
]

const messages = {
    week: 'שבוע',
    work_week: 'שבוע עבודה',
    day: 'יום',
    month: 'חודש',
    previous: 'הקודם',
    next: 'הבא',
    today: 'היום',
    agenda: "אג'נדה",
}

export default function WorkPlan(props){
    const [dataDate, setDataDate] = useState(new Date())
    const [viewingDate, setViewingDate] = useState(new Date())
    const [eventList, setEventList] = useState([])
    const [currentInstructor, setCurrentInstructor] = useState('')

    // add activity data
    const [addButtonPressed, setAddButtonPressed] = useState(false)
    const [showNewActivityForm, setShowNewActivityForm] = useState(false)

    // remove activity data
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
    const [selectedActivityStart, setSelectedActivityStart] = useState('');

    // snackbar data
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarSeverity, setSnackbarSeverity] = useState('')
    const [snackbarMessage, setSnackbarMessage] = useState('')

    const page_title = "לוח העבודה שלי";
    const add_activity_button_string = 'הוספת פעילות';

    /**
     * sends a request to the server to get work plan of the current user
     */
    useEffect(() => {
        let currentYear = dataDate.getFullYear();
        let currentMonth = dataDate.getMonth();

        if(props.userType === 'SUPERVISOR' || props.userType === "SYSTEM_MANAGER"){
            var url = new URL(window.location.href);
            var instructor = url.searchParams.get("instructor");
            setCurrentInstructor(instructor)
            new Connection().getWorkPlanOfInstructor(instructor, currentYear, currentMonth+1, arrangeActivities)
        }

        if(props.userType === 'INSTRUCTOR'){
            new Connection().getWorkPlan(currentYear, currentMonth+1, arrangeActivities);
        }
    }, []);

    /**
     * 
     */
    const arrangeActivities = (data) => {
        if(!data.failure){

            console.log('parsing dates')
            setEventList([])

            let dates = data.result.calendar
            for(const date of dates){
                let parsedStartDate = new Date(date.first);
                let parsedEndDate = new Date(date.second.endActivity)

                let startAct = new Date(parsedStartDate.getFullYear(), parsedStartDate.getMonth(), parsedStartDate.getDate(),
                    parsedStartDate.getHours(), parsedStartDate.getMinutes(), parsedStartDate.getSeconds())

                let endAct = new Date(parsedEndDate.getFullYear(), parsedEndDate.getMonth(), parsedEndDate.getDate(),
                    parsedEndDate.getHours(), parsedEndDate.getMinutes(), parsedEndDate.getSeconds())

                // TODO: check what happens if an activity is showing in the current month
                if(date.second.schoolId === 'Holiday'){
                    console.log('hi')
                    console.log(date.second.title)
                    console.log(startAct)
                    console.log(endAct)
                    setEventList(eventList => [...eventList, {title: date.second.title, start: startAct, end: endAct, isDraggable: false}])
                }
                else{
                    let schoolName = props.schools.filter((element => `${element.id}` === date.second.schoolId))[0].label
                    setEventList(eventList => [...eventList, {title: `${date.second.title} [${schoolName}]`, start: startAct, end: endAct, isDraggable: true}])
                }
            }

        }
    }

    /**
     * onNavigate handler for when the user changes the viewed dates
     * @param newDate the new date presented on the calendar
     */
    const onNavigate = (newDate) => {
        if (newDate.getMonth() !== dataDate.getMonth()){
            setDataDate(newDate)
            setEventList([])

            // calling for new data to view

            if(currentInstructor === ''){
                new Connection().getWorkPlan(newDate.getFullYear(), newDate.getMonth()+1, arrangeActivities);
            }
            else{
                new Connection().getWorkPlanOfInstructor(currentInstructor, newDate.getFullYear(),
                    newDate.getMonth()+1, arrangeActivities)
            }
        }

        setViewingDate(newDate)
    }

    /**
     * call back function for the various event editing requests
     * @param data the data from the server
     */
    const eventUpdateCallback = (data) => {
        if(data.failure){
            setOpenSnackbar(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('אירעה שגיאה. הפעילות לא התעדכנה')
        }
        else{
            setOpenSnackbar(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('הפעילות התעדכנה בהצלחה')

            // calling for new data to view
            new Connection().getWorkPlan(dataDate.getFullYear(), dataDate.getMonth()+1, arrangeActivities);
        }
    }

    /**
     * handler for setting the style of the event
     * @param event the event to style
     */
    const eventPropGetter = (event) => {
        var style = {
            backgroundColor: event.isDraggable ? '#3174ad' : '#bed7ec',
            color: event.isDraggable ? '#ffffff' : '#000000'
        }

        return {
            style: style
        }
    }

    /**
     * onMoveEvent handler which updates the times of the moved event
     * @param event the event which has been moved
     * @param start the new start date and time
     * @param end the new end date and time
     */
    const moveEvent = ({event, start, end}) => {
        new Connection().editActivity(new Date(event.start - timezoneOffset).toISOString().split('.')[0],
            new Date(start - timezoneOffset).toISOString().split('.')[0],
            new Date(end - timezoneOffset).toISOString().split('.')[0], eventUpdateCallback)
    }

    /**
     * onResizeEvent handler which updates the times of the resized event
     * @param event the event which has been resized
     * @param start the new start date and time
     * @param end the new end date and time
     */
    const resizeEvent = ({event, start, end}) => {
        new Connection().editActivity(new Date(event.start - timezoneOffset).toISOString().split('.')[0],
            new Date(start - timezoneOffset).toISOString().split('.')[0],
            new Date(end - timezoneOffset).toISOString().split('.')[0], eventUpdateCallback)
    }

    /**
     * a callback function for the request to add a new activity
     * @param data the response from the server
     */
    const addActivityCallback = (data) => {
        if(data.failure){
            setOpenSnackbar(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('אירעה שגיאה. הפעילות לא הוספה')
        }
        else{
            setOpenSnackbar(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('הפעילות הוספה בהצלחה')

            setEventList([])
            // calling for new data to view
            new Connection().getWorkPlan(dataDate.getFullYear(), dataDate.getMonth()+1, arrangeActivities);
        }
    }

    /**
     * handler for adding a new activity
     * @param title the title of the activity
     * @param goalID the goal to which the activity is related
     * @param schoolID the school to which the activity is related
     * @param startDate the start date and time of the activity
     * @param endDate the end date and time of the activity
     */
    const handleAddActivity = (title, goalID, schoolID, startDate, endDate) => {
        new Connection().addActivity(new Date(startDate - timezoneOffset).toISOString().split('.')[0],
            schoolID, goalID, title, new Date(endDate - timezoneOffset).toISOString().split('.')[0], addActivityCallback)
        setShowNewActivityForm(false);
        setAddButtonPressed(false);
    }

    /**
     * a callback function for the request to remove an event
     * @param data the response from the server about the request
     */
    const eventRemoveCallback = (data) => {
        if(data.failure){
            setOpenSnackbar(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('אירעה שגיאה. הפעילות לא נמחקה')
        }
        else{
            setOpenSnackbar(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('הפעילות נמחקה בהצלחה')

            setEventList([])
            // calling for new data to view
            new Connection().getWorkPlan(dataDate.getFullYear(), dataDate.getMonth()+1, arrangeActivities);
        }
    }

    /**
     * handler for removing an activity
     * @param activityStart the start date and time of the activity to remove
     */
    const handleRemoveActivity = (activityStart) => {

        new Connection().removeActivity(new Date(activityStart - timezoneOffset).toISOString().split('.')[0], eventRemoveCallback)
        setOpenRemoveDialog(false)
    }

    /**
     * onDoubleClick on event handler. used for removing an activity
     * @param event the doubled clicked event
     */
    const onDoubleClickEvent = (event) => {
        setOpenRemoveDialog(true)
        setSelectedActivityStart(event.start)
    }

    return (
        // all the spaces around are for placing the calendar
        <Space.Fill>
            <Space.Top size="5%"/>
            <Space.Fill>
                <Space.Left size="5%"/>
                <Space.Fill scrollable>

                    <h1>{page_title}</h1>
                    {props.userType === "INSTRUCTOR" && <Box sx={{width: '80%', marginBottom: '1%'}}>
                        <Button id={"work_plan_add_activity_collapse_button"} onClick={function () {setShowNewActivityForm(!showNewActivityForm); setAddButtonPressed(!addButtonPressed)}}
                                variant={addButtonPressed ? "outlined" : "contained"} startIcon={addButtonPressed ? <ExpandLessIcon/> : <ExpandMoreIcon/>}>
                            {add_activity_button_string}</Button>
                        {/*collapsed new goal form*/}
                        <Collapse sx={{width: "40%"}} in={showNewActivityForm}>
                            <NewActivityForm schools={props.schools} callback={handleAddActivity}/>
                        </Collapse>
                    </Box>}

                    {/* the calendar for instructors (drag and drop*/}
                    {/*todo: for some reason when dragging on month view it's inverted*/}
                    {props.userType === 'INSTRUCTOR' && <DnDCalendar
                        draggableAccessor="isDraggable"
                        date={viewingDate}
                        events={eventList}
                        messages={messages}
                        localizer={localizer}
                        onNavigate={onNavigate}
                        onEventDrop={moveEvent}
                        onEventResize={resizeEvent}
                        onDoubleClickEvent={onDoubleClickEvent}
                        eventPropGetter={eventPropGetter}
                        popup
                        resizable
                        rtl={true}
                    />}

                    {/*the calendar for the system manager and supervisors (view only)*/}
                    {(props.userType === 'SYSTEM_MANAGER' || props.userType === 'SUPERVISOR') &&
                    <Calendar
                        date={viewingDate}
                        events={eventList}
                        messages={messages}
                        localizer={localizer}
                        onNavigate={onNavigate}
                        rtl={true}
                    />}

                    {/*remove activity dialog*/}
                    <RemoveActivityDialog
                        open={openRemoveDialog}
                        activityStart={selectedActivityStart}
                        onClose={() => setOpenRemoveDialog(false)}
                        callback={handleRemoveActivity}
                    />

                    {/*notification snackbar*/}
                    <NotificationSnackbar
                        open={openSnackbar}
                        setOpen={setOpenSnackbar}
                        severity={snackbarSeverity}
                        message={snackbarMessage}/>
                </Space.Fill>
                <Space.Right size="5%"/>
            </Space.Fill>
            <Space.Bottom size="5%"/>
        </Space.Fill>
    )
}