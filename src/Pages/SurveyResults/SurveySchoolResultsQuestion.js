import React, { useState, useEffect } from "react";
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";

export default function SurveySchoolResultsQuestion(props){

    const [violatedGoalsString, setVioldatedGoalsString] = useState('');

    // STRINGS
    const answer_label_string = 'תשובה';
    const numeral_answer_label_string = 'תשובה מספרית'
    const open_answer_helper_text_string = 'נא להזין תשובה מספרית בלבד'

    const multiple_choice_label_string = "נא לבחור תשובה אחת:";
    const multiple_choice_helper_text_string = "יש לבחור תשובה";

    const violation_of_goals_string = 'תשובה זו מפרה את היעדים הבאים שהוצבו';

    useEffect(() => {
        setVioldatedGoalsString(props.violatedGoals.slice(1).reduce((pv, cv) => `${pv}, ${cv}`, props.violatedGoals[0]))

    }, []);


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
                            <FormControl error={!props.isLegal} variant="standard">
                                <RadioGroup
                                    value={props.answer}
                                >
                                    {props.choices.map((element, index) =>
                                        <FormControlLabel value={index.toString()} control={<Radio color="secondary"/>} label={element}/>)}
                                </RadioGroup>
                                {!props.isLegal && <FormHelperText><Typography display={'inline'}>{violation_of_goals_string}: <Typography display={'inline'}>{violatedGoalsString}</Typography> </Typography></FormHelperText>}
                            </FormControl>
                        </Grid>

                    }
                    {/*open view for question of this kind*/}
                    {props.type === 'OPEN_ANSWER' && <Grid sx={{alignItems: 'center', margin: "1%"}} item xs={12}>
                        <TextField
                            color="secondary"
                            sx={{width: "90%"}}
                            margin="normal"
                            variant="standard"
                            value={props.answer}
                            error={!props.isLegal}
                            helperText={!props.isLegal ? <Typography display={'inline'}>{violation_of_goals_string}: <Typography display={'inline'}>{violatedGoalsString}</Typography> </Typography> : ''}
                            disabled
                        />
                    </Grid>}
                    {/*open-numerical view for question of this kind*/}
                    {props.type === 'NUMERIC_ANSWER'  && <Grid sx={{alignItems: 'center', margin: "1%"}} item xs={12}>
                        <TextField
                            color="secondary"
                            sx={{width: "90%"}}
                            margin="normal"
                            variant="standard"
                            disabled
                            error={!props.isLegal}
                            helperText={!props.isLegal ? <Typography display={'inline'}>{violation_of_goals_string}: <Typography display={'inline'}>{violatedGoalsString}</Typography> </Typography> : ''}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            value={props.answer}
                        />
                    </Grid>}
                </Grid>
            </Paper>
        </div>
    )
}