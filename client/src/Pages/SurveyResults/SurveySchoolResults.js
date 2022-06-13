import React, {useEffect, useState} from "react";
import '../SurveyBuilder/SurveyBuilder.css';
import {Alert, AlertTitle, Box, Grid, Pagination, Paper, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import * as Space from 'react-spaces';
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";
import Connection from "../../Communication/Connection";
import {navigate} from "react-big-calendar/lib/utils/constants";
import {useNavigate} from "react-router-dom";
import SurveySchoolResultsQuestion from './SurveySchoolResultsQuestion';

const mock = [
    {
        id: 0,
        question: 'a',
        type: 'OPEN_ANSWER',
        answer: '',
    },
    {
        id: 1,
        question: 'b',
        type: 'NUMERIC_ANSWER',
        answer: '',
    },
    {
        id: 2,
        choices: ['אנקין', 'פדמה',],
        question: 'c',
        type: 'MULTIPLE_CHOICE',
        answer: '',
    },
    {
        id: 3,
        question: 'e',
        type: 'NUMERIC_ANSWER',
        answer: '',
    },
    {
        id: 4,
        question: 't',
        type: 'NUMERIC_ANSWER',
        answer: '',
    },
    {
        id: 5,
        question: 'u',
        type: 'NUMERIC_ANSWER',
        answer: '',
    },
    {
        id: 6,
        question: 'q',
        type: 'NUMERIC_ANSWER',
        answer: '',
    },
    {
        id: 7,
        question: 'z',
        type: 'NUMERIC_ANSWER',
        answer: '',
    },
];

const questionsPerPage = 5;

export default function SurveySchoolResults(){

    const [surveyTitle, setSurveyTitle] = useState('');
    const [surveyDescription, setSurveyDescription] = useState('');
    const [surveyID, setSurveyID]= useState('');

    // initializing with dummy data for offline testing
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [violatedGoalsMap, setViolatedGoalsMap] = useState({});
    const [loadedAnswers, setLoadedAnswers] = useState(false)

    // STRINGS
    const finish_view_survey_string = 'סיום צפייה וחזרה לנתוני הסקר';


    let navigate = useNavigate();

    useEffect(() => {
        var url = new URL(window.location.href);
        var urlSurveyID = url.searchParams.get("surveyID");
        var urlSchoolID = url.searchParams.get("schoolID");

        setSurveyID(urlSurveyID);

        new Connection().getSurvey(urlSurveyID, arrangeSurvey);
        new Connection().getSchoolSurveyAnswers(urlSurveyID, urlSchoolID, arrangeSurveyAnswers)

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

            let questionIndexer = 0;
            zippedQuestionsList.forEach(([question, type, answers], index) => setQuestions(questions =>
                [...questions, {id: index, question: question, type: type, choices: answers}]));
        }
        else {
            // TODO: have a page for when showing the survey fails
        }
    }

    /**
     * arrange the data received from the server regarding the answers of a school to the current survey
     * @param data
     */
    const arrangeSurveyAnswers= (data) => {
        if(!data.failure){
            function zip(arrays) {
                return arrays[0].map(function(_,i){
                    return arrays.map(function(array){return array[i]})
                });
            }

            let answers_data = data.result;

            let zippedAnswersData = zip([answers_data.answers, answers_data.isLegal])

            zippedAnswersData.forEach(([answer, legality, goals]) => setAnswers(answers =>
                [...answers, {answer: answer, isLegal: legality}]));
            
            console.log(answers_data.goals)
            setViolatedGoalsMap(answers_data.goals);

            setLoadedAnswers(true);
        }
    }


    return (
        <Space.Fill scrollable>
            <div style={{margin: '5vh'}} className="Survey">

                <Typography></Typography>

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

                {/*the question of the survey*/}
                {loadedAnswers && questions.map((question, index) =>
                    <SurveySchoolResultsQuestion id={question.id}
                                                  questionString={question.question}
                                                  choices={question.type === "MULTIPLE_CHOICE" ? question.choices : []}
                                                  type={question.type}
                                                  answer={answers[index].answer}
                                                  isLegal={answers[index].isLegal}
                                                  violatedGoals={violatedGoalsMap[question.id] === undefined ? [] : violatedGoalsMap[question.id]}/>)}


                <br/>

                {/*done viewing the survey button*/}
                <Button color="secondary" variant="contained" onClick={() => navigate(`../surveyResults?surveyID=${surveyID}`, {replace: false})}>{finish_view_survey_string}</Button>

            </div>
        </Space.Fill>
    )
}