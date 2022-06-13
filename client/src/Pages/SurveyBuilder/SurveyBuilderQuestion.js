import React, { useState } from "react";
import {FormControlLabel, Grid, MenuItem, Paper, Radio, RadioGroup, Select, Tooltip} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function SurveyQuestionBuilder(props) {
    const [multipleAnswersID, setMultipleAnswersID] = useState(0);

    // STRINGS
    const question_label_string = 'שאלה';
    const answer_label_string = 'תשובה';
    const multiple_item_string = 'בחירה מרובה';
    const multiple_add_string = 'הוסף/י תשובה'
    const open_item_string = 'פתוחה';
    const open_number_item_string = 'מספרית';
    const question_delete_title_tooltip_string = 'מחיקת שאלה';
    const answer_delete_title_tooltip_string = 'מחיקת תשובה';

    /**
     * onChange handler when the text-field of the question changes. updated the value
     * @param event wrapper for the question element with the change
     */
    const handleQuestionChange = (event) => {
        props.modify(props.id, 'question', event.target.value);
    }

    /**
     * onChange handler for the dropdown list of type of question. changes the current question to the selected type
     * @param event wrapper for selection element with the new value
     */
    const handleChange = (event) => {
        props.modify(props.id, 'type', event.target.value);
    }

    /**
     * delets the current question from the survey
     */
    const delete_question = () => {
        props.delete(props.id)
    }

    /**
     * onChange handler for updating the text of an answer in multiple-choice questions
     * @param event
     */
    const handleAnswerChange = (event) => {
        props.modify(props.id, 'answers', event.target.value, event.target.id);
    }

    /**
     * adds a new answer to a multiple-choice question
     */
    const add_answer = () => {
        props.modify(props.id, 'answers', '', `question-${props.id}-answer-${multipleAnswersID}`);

        setMultipleAnswersID(multipleAnswersID+1);
    }

    /**
     * deletes an answer from a given multiple-choice question
     * @param answer_id id of the answer to delete
     */
    const delete_answer = (answer_id) => {
        props.delete_answer(props.id, answer_id);
    }

    return (
        <div className="SurveyQuestion">
            <Paper id={`question-${props.id}`} className="Survey-paper" elevation={3}>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        {/*the question*/}
                        <TextField
                            id={`create_question_title_${props.id}`}
                            sx={{width: "90%"}}
                            color="secondary"
                            margin="normal"
                            variant="filled"
                            disabled={props.id === -1}
                            required
                            value={props.question}
                            label={question_label_string}
                            error={props.showError && props.question.trim() === ''}
                            name="question"
                            autoFocus
                            onChange={handleQuestionChange}
                        />
                    </Grid>
                    {props.id !== -1 && <Grid item xs={2} sx={{margin: "1%"}}>
                        {/*selection of which type of question the question is*/}
                        <FormControl  sx={{ m: 1, minWidth: 80 }}>
                            <Select
                                id={`create_question_type_selection_${props.id}`}
                                value={props.type}
                                onChange={handleChange}
                            >
                                <MenuItem value={'MULTIPLE_CHOICE'}>{multiple_item_string}</MenuItem>
                                <MenuItem value={'OPEN_ANSWER'}>{open_item_string}</MenuItem>
                                <MenuItem value={'NUMERIC_ANSWER'}>{open_number_item_string}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>}
                    {props.id !== -1 && <Grid item xs={1}>
                        {/*button to the delete the current question*/}
                        <Tooltip title={question_delete_title_tooltip_string}>
                            <IconButton id={`create_question_delete_button_${props.id}`} onClick={delete_question}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>}
                    {/*element for the case where the question is multiple-choice*/}
                    {props.type === 'MULTIPLE_CHOICE' &&
                        <Grid item xs={12} sx={{margin: "1%"}}>
                                <RadioGroup column>
                                        {/*viewing the options the user added*/}
                                        {props.answers.map((element, index) =>
                                            <Grid container spacing={2}>
                                                <Grid item xs={2}>
                                                    <FormControlLabel disabled value={element.id} control={<Radio />} label={<TextField
                                                        className={'question-answer'}
                                                        id={element.id}
                                                        color="secondary"
                                                        margin="normal"
                                                        variant="standard"
                                                        value={element.value}
                                                        error={props.showError && element.value.trim() === ''}
                                                        required
                                                        sx={{width: "90%"}}
                                                        label={answer_label_string}
                                                        onChange={handleAnswerChange}
                                                    />}/>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Tooltip title={answer_delete_title_tooltip_string}>
                                                        <IconButton id={`create_question_multiple_answer_remove_button_${index}_${props.id}`}
                                                                    onClick={() => delete_answer(element.id)} aria-label="delete">
                                                            <RemoveCircleOutlineIcon color="warning" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        )}
                                    <FormControlLabel disabled value={'idk'} control={<Radio />} label={<Button id={`create_question_multiple_add_answer_button_${props.id}`} onClick={() => add_answer()} variant="text" color="secondary">{multiple_add_string}</Button>}/>
                                </RadioGroup>
                            <br/>
                        </Grid>
                    }
                    {/*element for the case where the question is open or open-numeric*/}
                    {(props.type === 'OPEN_ANSWER' || props.type === 'NUMERIC_ANSWER')  &&
                    <Grid sx={{alignItems: 'center', margin: "1%"}} item xs={12}>
                        <TextField
                            color="secondary"
                            sx={{width: "90%"}}
                            margin="normal"
                            variant="standard"
                            disabled
                            label={answer_label_string}
                        />
                    </Grid>}
                </Grid>
            </Paper>
        </div>
    )
}