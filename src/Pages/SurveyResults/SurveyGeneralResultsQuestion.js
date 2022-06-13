import React, { useState, useEffect } from "react";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid, LinearProgress, linearProgressClasses,
    Paper,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {styled} from "@mui/styles";

function LinearProgressWithLabel(props) {
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 20,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <BorderLinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function SurveyGeneralResultsQuestion(props){

    // STRINGS
    const total_answers_string = "ענו תשובה זו";

    const answer_average_text_string = "ממוצע התשובות לשאלה זו הוא:";

    useEffect(() => {
        console.log("for question id " + props.id)
        console.log(props.statistics)

    }, []);


    /**
     * sums the answers in the histogram stats
     */
    const getHistogramSum = () => {
        return props.statistics.reduce((pv, cv) => pv + cv, 0);
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
                        <Grid item xs={12} sx={{margin: "1%", width: "100%"}}>
                            <FormControl variant="standard" sx={{width: "100%"}}>
                                {/*<FormLabel>{multiple_choice_label_string}</FormLabel>*/}
                                <RadioGroup
                                >
                                    {props.choices.map((element, index) =>
                                        <Grid container spacing={1}>
                                            {/*the answer*/}
                                            <Grid item sx={{alignItems: 'center'}} xs={1.5}><FormControlLabel value={index.toString()} control={<Radio disabled color="secondary"/>}
                                                                                label={<Typography>{element}</Typography>}/></Grid>
                                            {/*percentage bar*/}
                                            <Grid item xs={5}>
                                            {/* (props.statistics[index]/getHistogramSum())*100 */}
                                                <LinearProgressWithLabel variant="determinate" value={(props.statistics[index]/getHistogramSum())*100} /> 
                                            </Grid>

                                            {/*number of answers*/}
                                            <Grid item xs={2}>
                                                {/* props.statistics[index] */}
                                                <Typography display={"inline"}><Typography color={'blue'} display={"inline"}>{props.statistics[index]}</Typography> {total_answers_string} </Typography>
                                            </Grid>
                                        </Grid>
                                        )}
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                    }

                    {/*open-numerical view for question of this kind*/}
                    {props.type === 'NUMERIC_ANSWER'  && <Grid sx={{alignItems: 'center', margin: "1%"}} item xs={12}>
                        <Typography display={"inline"}>{answer_average_text_string} </Typography>
                        {/* props.statistics */}
                        <Typography display={"inline"} color={'blue'}>{props.statistics}</Typography>
                    </Grid>}
                </Grid>
            </Paper>
        </div>
    )
}