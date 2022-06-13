import React, {useEffect, useState} from "react";
import {FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Paper, Radio, RadioGroup} from "@mui/material";
import TextField from "@mui/material/TextField";

export default function SurveyQuestion(props){

    // STRINGS
    const answer_label_string = 'תשובה';
    const numeral_answer_label_string = 'תשובה מספרית'
    const open_answer_helper_text_string = 'נא להזין תשובה מספרית בלבד'

    const multiple_choice_label_string = "נא לבחור תשובה אחת:";
    const multiple_choice_helper_text_string = "יש לבחור תשובה";

    /**
     * onChange callback when there a change to an open textfield
     * @param event the changed element
     */
    const handleOpenAnswerChange = (event) => {
        //setOpenAnswer(event.target.value)

        props.answerChange(props.id, event.target.value)
    }

    /**
     * onChange callback when there a change to a numeric textfield
     * @param event the changed element
     */
    const handleNumericAnswerChange = (event) => {
        // from https://stackoverflow.com/questions/57269224/reactjs-material-ui-accept-only-positive-unsigned-integer-values-in-textfield
        let input = event.target.value ;
        if( !input || ( input[input.length-1].match('[0-9]') && input[0].match('[1-9]')) ){
            props.answerChange(props.id, input)
        }
            
    }

    /**
     * onChange callback when a there a new selection for multiple-choice question's answer
     * @param event
     */
    const handleMultipleChoiceAnswerChange = (event) => {
        //setMultipleChoiceAnswer(event.target.value);
        props.answerChange(props.id, event.target.value)
    }


    return (
        <div className="SurveyQuestion">
            <Paper className="Survey-paper" elevation={3}>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        {/*the question*/}
                        <TextField
                            color="secondary"
                            sx={{width: "100%"}}
                            margin="normal"
                            variant="filled"
                            name="question"
                            defaultValue={props.questionString}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    {/*multiple-choice view for question of this kind*/}
                    {props.type === 'MULTIPLE_CHOICE' &&
                        <Grid item xs={12} sx={{margin: "1%"}}>
                            <FormControl  error={props.showError && props.answer.trim() === ''} variant="standard">
                                <FormLabel>{multiple_choice_label_string}</FormLabel>
                                <RadioGroup
                                    value={props.answer}
                                    onChange={handleMultipleChoiceAnswerChange}

                                >
                                    {props.choices.map((element, index) =>
                                        <FormControlLabel value={index.toString()} control={<Radio id={`submit_survey_multi_choice_${props.id}_${index}`}  color="secondary"/>} label={element}/>)}
                                </RadioGroup>
                                {props.showError && props.answer.trim() === '' && <FormHelperText>{multiple_choice_helper_text_string}</FormHelperText>}
                            </FormControl>
                        </Grid>

                    }
                    {/*open view for question of this kind*/}
                    {props.type === 'OPEN_ANSWER' && <Grid sx={{alignItems: 'center', margin: "1%"}} item xs={12}>
                        <TextField
                            id={`submit_survey_open_answer_${props.id}`}
                            color="secondary"
                            sx={{width: "90%"}}
                            margin="normal"
                            variant="standard"
                            required
                            value={props.answer}
                            error={props.showError && props.answer.trim() === ''}
                            label={answer_label_string}
                            onChange={handleOpenAnswerChange}
                        />
                    </Grid>}
                    {/*open-numerical view for question of this kind*/}
                    {props.type === 'NUMERIC_ANSWER'  && <Grid sx={{alignItems: 'center', margin: "1%"}} item xs={12}>
                        <TextField
                            id={`submit_survey_numeric_answer_${props.id}`}
                            color="secondary"
                            sx={{width: "90%"}}
                            margin="normal"
                            variant="standard"
                            required
                            error={props.showError && props.answer.trim() === ''}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            value={props.answer}
                            helperText={open_answer_helper_text_string}
                            label={numeral_answer_label_string}
                            onChange={handleNumericAnswerChange}
                        />
                    </Grid>}
                </Grid>
            </Paper>
        </div>
    )
}