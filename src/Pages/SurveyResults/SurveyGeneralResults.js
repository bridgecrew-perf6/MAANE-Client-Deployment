import React, {useEffect, useState} from "react";
import Connection from "../../Communication/Connection";
import * as Space from "react-spaces";
import {
    Alert,
    AlertTitle,
    Box, Collapse,
    Grid, IconButton, List, ListItem, ListItemText,
    Pagination,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow,
    TextField, Typography
} from "@mui/material";
import SurveyQuestion from "../Survey/SurveyQuestion";
import Button from "@mui/material/Button";
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";
import SurveyGeneralResultsQuestion from "./SurveyGeneralResultsQuestion";
import {navigate} from "react-big-calendar/lib/utils/constants";
import {useNavigate} from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * a function that returns an object containing the data for a row in the table
 * @param id the id of the school
 * @param name the name of the shcool
 * @returns {{name, id}}
 */
function createData(id, name){
    return {
        id,
        name
    }
}

/**
 * this function is a hook of a row in the table
 * @param props data for a row
 * @returns {JSX.Element} JSX element of the row
 */
function Row(props) {
    const { row } = props;

    const view_survey_answers_button_string = "צפייה";

    let navigate = useNavigate();

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                {/* main goal's info */}
                <TableCell/>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                {/*view survey answers button*/}
                <TableCell>
                    <Button onClick={() => navigate(`../schoolSurveyAnswers?surveyID=${props.surveyID}&schoolID=${row.id}`, {replace: false})}>{view_survey_answers_button_string}</Button>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}


const mock = [
    {
        id: 1,
        question: 'b',
        type: 'NUMERIC_ANSWER',
        statistics: 12,
    },
    {
        id: 2,
        choices: ['אנקין', 'פדמה',],
        question: 'c',
        type: 'MULTIPLE_CHOICE',
        statistics: [24, 12],
    },
];

const mock_stats_avg = {
    1: 123
}

const mock_stats_histo = {
    2: [123, 12]
}

const table_rows_mock = [createData(12, "jedi academy"), createData(66, "sith academy")];

const questionsPerPage = 5;

export default function SurveyGeneralResults(){

    const [surveyTitle, setSurveyTitle] = useState("");
    const [surveyDescription, setSurveyDescription] = useState('');
    const [surveyID, setSurveyID] = useState('')

    const [schoolTableRows, setSchoolTableRows] = useState([])

    // initializing with dummy data for offline testing
    const [questions, setQuestions] = useState([]);
    const [averageMap, setAverageMap] = useState({});
    const [histogramMap, setHistogramMap] = useState({});
    const [statsLoaded, setStatsLoaded] = useState(false);
    const [page, setPage] = React.useState(1);

    // error states
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorSeverity, setErrorSeverity] = useState('error');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // STRINGS
    const school_symbol_cell_head_string = "סמל";
    const school_name_cell_head_string = "שם";
    const school_view_answers_head_string = "צפייה בתשובות";

    const page_title_string = "נתוני העונים עבור הסקר";
    const schools_who_submitted_an_answer_string = "בתי ספר שענו על הסקר:";
    const survey_general_info_string = "נתונים כלליים על הסקר:";

    const finish_view_button_string = "סיום צפייה וחזרה לתפריט";

    let navigate = useNavigate();


    useEffect(() => {
        var url = new URL(window.location.href);
        var urlSurveyID = url.searchParams.get("surveyID");
        setSurveyID(urlSurveyID)

        new Connection().getSurvey(urlSurveyID, arrangeSurvey);

        new Connection().getSurveyStats(urlSurveyID, arrangeStats)

    }, []);

    /**
     * arranges the data received from the server regarding the request to view and fill a survey
     * @param data the data recieved from the server
     */
    const arrangeSurvey = (data) => {
        if(!data.failure){
            function zip(arrays) {
                return arrays[0].map(function(_,i){
                    return arrays.map(function(array){return array[i]})
                });
            }

            const survey = data.result;

            setSurveyTitle(survey.title);
            setSurveyDescription(survey.description);

            const zippedQuestionsList = zip([survey.questions, survey.types, survey.answers]);
            console.log(zippedQuestionsList.slice(1))
            let questionIndexer = 0;
            zippedQuestionsList.slice(1).forEach(([question, type, answers], index) => setQuestions(questions => // don't need the first question
                [...questions, {id: index, question: question, type: type, choices: answers}]));
        }
        else {
            // TODO: have a page for when showing the survey fails
        }
    }

    /**
     * arrange the statistics data the just received from the server
     * @param data the data from the server
     */
    const arrangeStats = (data) => {
        if (!data.failure){

            let stats = data.result

            setHistogramMap(stats.multipleHistogram)
            setAverageMap(stats.numericAverage)

            function zip(arrays) {
                return arrays[0].map(function(_,i){
                    return arrays.map(function(array){return array[i]})
                });
            }

            const zippedSchoolsList = zip([stats.symbols, stats.schoolNames]);

            zippedSchoolsList.map(([symbol, name]) => setSchoolTableRows(row => [
                ...row, createData(symbol, name)
            ]))

            setStatsLoaded(true);
        }
    }

    /**
     * handler for changing a page in the survey
     * @param event required but not used
     * @param value the new page to go to
     */
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Space.Fill scrollable>
            <div style={{margin: '5vh'}} className="Survey">
                {/*page title*/}
                <Typography variant={"h3"} display={"inline"}>{page_title_string} <Typography variant={"h3"} color={"blue"} display={"inline"}>{surveyTitle}</Typography></Typography>

                <br/>
                <br/>
                {/*table for the school who answered the survey*/}
                <Box sx={{width: '80%'}}>
                    <Typography variant={"h5"}>{schools_who_submitted_an_answer_string}</Typography>
                </Box>
                <TableContainer sx={{width: '80%'}} component={Paper}>
                    <Table aria-label={"collapsible table"}>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell>{school_symbol_cell_head_string}</TableCell>
                                <TableCell>{school_name_cell_head_string}</TableCell>
                                <TableCell>{school_view_answers_head_string}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {schoolTableRows.map((tableRow) => (
                                <Row key={tableRow.id} row={tableRow} surveyID={surveyID}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <br/>
                <br/>

                <Box sx={{width: '80%'}}>
                    <Typography variant={"h5"}>{survey_general_info_string}</Typography>
                </Box>
                <Paper className="Survey-paper" elevation={3}>
                    {/*TODO: have this big and in bold*/}
                    {/*title of the survey*/}
                    <TextField
                        color="secondary"
                        margin="normal"
                        className="Survey-text-field"
                        value={surveyTitle}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="standard"
                    />
                    {/*TODO: have this a little smaller*/}
                    {/*description of the survey*/}
                    <TextField
                        color="secondary"
                        margin="normal"
                        className="Survey-text-field"
                        value={surveyDescription}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="standard"
                    />
                </Paper>

                {/*/!*the question of the survey*!/*/}
                {/*{questions.slice((page-1) * questionsPerPage, Math.min(page * questionsPerPage, questions.length)).map(question =>*/}
                {/*    <SurveyGeneralResultsQuestion id={question.id}*/}
                {/*                    questionString={question.question}*/}
                {/*                    choices={question.type === "MULTIPLE_CHOICE" ? question.choices : []}*/}
                {/*                    type={question.type}*/}
                {/*                    statistics={question.type === "MULTIPLE_CHOICE" ? histogramMap[question.id] : averageMap[question.id]} />)}*/}

                {/*the question of the survey*/}
                {statsLoaded && questions.filter((question) => question.type !== 'OPEN_ANSWER').map(question =>
                    <SurveyGeneralResultsQuestion id={question.id}
                                                  questionString={question.question}
                                                  choices={question.type === "MULTIPLE_CHOICE" ? question.choices : []}
                                                  type={question.type}
                                                  statistics={question.type === "MULTIPLE_CHOICE" ? histogramMap[question.id+2] : averageMap[question.id+2]} />)}

                {/*paging component*/}
                {/*<Pagination count={Math.ceil(questions.length/questionsPerPage)} page={page} onChange={handlePageChange} />*/}
                <br/>
                {/*submitting the survey*/}
                <Button color="secondary" variant="contained" onClick={() => navigate('../menu')}>{finish_view_button_string}</Button>

                {/*pop up notification*/}
                <NotificationSnackbar
                    open={openSnackbar}
                    setOpen={setOpenSnackbar}
                    severity={errorSeverity}
                    message={errorMessage}/>
            </div>
        </Space.Fill>
    )
}