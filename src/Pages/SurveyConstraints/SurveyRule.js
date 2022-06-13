import {
    Box,
    Button, Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select, Stack, TextField,
    Tooltip
} from "@mui/material";
import './SurveyRule.css'
import {useEffect, useState} from "react";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function SurveyRule(props){

    const [trace] = useState([...props.trace, props.id])

    const goal_select_label_string = 'יעד';
    const question_select_label_string = 'שאלה או תנאי';
    const inequality_select_label_string = 'אי-שוויון'

    const and_string = "וגם (כל תתי התנאים צריכים להתקיים)";
    const or_string = "או (אחד מתתי התנאים צריכים להתקיים)";

    const user_answer_place_holder_string = "תשובות העונים";

    const add_condition_button_string = "הוספת תא";
    const remove_tooltip_string = "מחיקה";

    const chosen_goal_string = "היעד שנבחר:";
    const chosen_rule_string = "הכלל שנבחר:";

    useEffect(() => {
        if(props.depth === 0){
            console.log( props.goals);
            console.log('hello there ' + props.goalSelection)
        }

    },[])

    /**
     * handles the addition of a new condition
     */
    const addCondition = () => {
        props.addCell(props.id, props.trace);
    }

    /**
     * onChange handler for the goal select
     * @param event the affected element
     */
    const handleGoalSelectionChange = (event) => {
        props.goalSelectionChange(props.id, event.target.value);
    }

    /**
     * onChange handler for the question select
     * @param event the affected element
     */
    const handleQuestionSelectionChange = (event) => {
        props.questionSelectionChange(props.id, props.trace, event.target.value);
    }

    /**
     * handler for an on check event
     * @param event the affected element
     */
    const handleAnswerCheckChange = (event) => {
        props.handleConstraintValueChoiceChange(props.id, props.trace, event.target.name)
    }

    /**
     * handler for an onChange event for the numerical field of the numerical question constraint
     * @param event the affected element
     */
    const handleNumericalAnswerChange = (event) => {
        // from https://stackoverflow.com/questions/57269224/reactjs-material-ui-accept-only-positive-unsigned-integer-values-in-textfield
        let input = event.target.value ;
        if( !input || ( input[input.length-1].match('[0-9]') && input[0].match('[1-9]')) )
            props.handleNumericalConstraintChange(props.id, props.trace, props.constraintType, input);

    }

    /**
     * handler for an onChange for the inqueality of a numerical question constraint
     * @param event the affected element
     */
    const handleInequalityChange = (event) => {
        props.handleNumericalConstraintChange(props.id, props.trace, event.target.value, props.value);
    }

    /**
     * gets the type of the selected question
     * @returns {string|*} the type of the question
     */
    const selectedQuestionType = () => {
        if(props.questionSelection === undefined){
            return '';
        }

        if(props.questionSelection === '' || props.questionSelection === 'AND' || props.questionSelection === 'OR'){
            return '';
        }

        const question = props.questions.find(element => element.id === props.questionSelection);

        if(question === undefined){
            return '';
        }

        return question.type;
    }

    /**
     * gets the title of the selected question
     * @returns {string|*} the title of the question
     */
    const selectedQuestionTitle = () => {
        if(props.questionSelection === undefined){
            return '';
        }

        else if(props.questionSelection === ''){
            return '';
        }

        else if (props.questionSelection === 'AND'){
            return "וגם";
        }

        else if (props.questionSelection === 'OR'){
            return "או";
        }

        

        const question = props.questions.find(element => element.id === props.questionSelection);
        if(question === undefined){
            return '';
        }
        return question.question;
    }

    /**
     * gets the answers of the selected question
     * @returns {[]|string[]|string|*} the list of answers
     */
    const selectedQuestionAnswers = () => {
        const question = props.questions.find(element => element.id === props.questionSelection);
        return question.answers;
    }

    /**
     * gets the title of the selected goal
     * @returns {[]|string[]|string|*} the list of answers
     */
    const selectedGoalTitle = () => {
        const goal = props.goals.find(element => element.value === props.goalSelection);

        if (goal === undefined){
            return ''
        }
        return goal.description;
    }

    /**
     * handler for removing the current cell
     */
    const handleRemove = () => {
        props.removeCell(props.id, props.trace);
    }

    /**
     * a function which decided if to present the add button in the current cell
     */
    const isPresentAddButton = () => {
        return (props.depth === 0 && props.children.length === 0) ||
            (props.depth !== 0 && (props.questionSelection === 'AND' || props.questionSelection === 'OR' || props.questionSelection === ''))
    }
//Math.min(props.colors.length-1, props.depth)
    return (
        <div>
            <Box m={2}>
                <Paper elevation={3} className={"Rule-paper"}
                       sx={{backgroundColor: props.colors[((props.depth % props.colors.length))]}}>

                    {props.depth === 0 && <h1>{chosen_goal_string} {selectedGoalTitle()}</h1>}
                    {props.depth > 0 && <h1>{chosen_rule_string} {selectedQuestionTitle()}</h1>}

                    <Grid container spacing={1}>

                        {/*goal selection for the main cells*/}
                        {props.depth === 0 &&
                            <Grid  item xs={11}>
                                <FormControl fullWidth sx={{backgroundColor: 'white', marginLeft: '1%', marginBottom: '1%'}}>
                                    <InputLabel id={`goal-select-label-${props.id}`}>{goal_select_label_string}</InputLabel>
                                    <Select
                                        labelId={`goal-select-label-${props.id}`}
                                        id={`goal-select-${props.id}`}
                                        value={props.goalSelection}
                                        label={goal_select_label_string}
                                        onChange={handleGoalSelectionChange}
                                    >
                                        {props.goals.map(goal => <MenuItem value={goal.value}>{goal.description}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>}

                        {/*question or conditional selection for the sub cells*/}
                        {props.depth > 0 &&
                            <Grid item xs={11}>
                                <FormControl fullWidth sx={{marginLeft: '1%', marginBottom: '1%'}}>
                                    <InputLabel id={`question-select-label-${props.id}`}>{question_select_label_string}</InputLabel>
                                    <Select
                                        labelId={`question-select-label-${props.id}`}
                                        id={`question-select-${props.id}`}
                                        value={props.questionSelection}
                                        label={question_select_label_string}
                                        onChange={handleQuestionSelectionChange}
                                    >
                                        <MenuItem value={'AND'}>{and_string}</MenuItem>
                                        <MenuItem value={'OR'}>{or_string}</MenuItem>

                                        {props.questions.map(question => <MenuItem value={question.id}>{question.question + " (" +
                                            (question.type === 'OPEN_ANSWER' ? 'תשובה פתוחה' : question.type === 'NUMERIC_ANSWER' ?
                                                'תשובה מספרית' : 'בחירה מרובה') + ")"}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>}

                        <Grid item xs={1} style={{textAlign: "center"}}>
                            {/*remove cell button*/}
                            <Tooltip title={remove_tooltip_string}>
                                <IconButton id={`remove_cell_${props.id}`} onClick={handleRemove}>
                                    <RemoveCircleIcon/>
                                </IconButton>
                            </Tooltip>
                        </Grid>


                    </Grid>

                    {/*constraint to fill for open numeric questions*/}
                    {selectedQuestionType() === "NUMERIC_ANSWER" &&
                        <Stack m={1} direction="row" spacing={1}>
                            {/*text field which the user fill*/}
                            <TextField
                                id={`inequality-number-input-${props.id}`}
                                value={props.constraintValue}
                                onChange={handleNumericalAnswerChange}
                            />

                            {/*menu which the user chooses from*/}
                            <FormControl sx={{width: "25%"}}>
                                <InputLabel id={`inequality-select-label-${props.id}`}>{inequality_select_label_string}</InputLabel>
                                <Select
                                    labelId={`inequality-select-label-${props.id}`}
                                    id={`inequality-select-${props.id}`}
                                    value={props.constraintType}
                                    label={inequality_select_label_string}
                                    onChange={handleInequalityChange}
                                >
                                    {/* todo: the icon flips when chosen. fix this */}
                                    <MenuItem value={'LESS_THAN'}> <Typography>{"<"}</Typography> </MenuItem>
                                    <MenuItem value={'GREATER_THAN'}> {">"} </MenuItem>
                                    <MenuItem value={'EQUAL'}> {"="} </MenuItem>
                                </Select>
                            </FormControl>

                            {/*static text field*/}
                            <TextField value={user_answer_place_holder_string} disabled/>
                        </Stack>}

                    {/*constraints to check for multiple choice questions*/}
                    {selectedQuestionType() === "MULTIPLE_CHOICE" &&
                        <FormControl sx={{ m: 3 }} variant="standard">
                        <FormGroup>
                            {selectedQuestionAnswers().map((answer, index) => <FormControlLabel
                                    control={
                                        <Checkbox id={`constraint-checkbox-${props.id}-${index}`} checked={props.constraintValue.includes(index.toString())} onChange={handleAnswerCheckChange} name={index} />
                                    }
                                    label={answer}
                                />)}
                        </FormGroup>
                    </FormControl>}

                    {/*child cells*/}
                    {props.children.map(child => <SurveyRule id={child.id} depth={props.depth + 1} colors={props.colors}
                                                             questions={props.questions}
                                                             children={child.children} trace={trace}
                                                             questionSelection={child.questionSelection}
                                                             constraintType={child.constraint.type}
                                                             constraintValue={child.constraint.value}
                                                             addCell={props.addCell}
                                                             questionSelectionChange={props.questionSelectionChange}
                                                             removeCell={props.removeCell}
                                                             handleConstraintValueChoiceChange={props.handleConstraintValueChoiceChange}
                                                             handleNumericalConstraintChange={props.handleNumericalConstraintChange}/>)}

                    {isPresentAddButton() &&
                        <Button id={`add-inner-cell-${props.id}`} onClick={() => addCondition()} sx={{margin: '1%'}} variant={"contained"}>{add_condition_button_string}</Button>}

                </Paper>
            </Box>

        </div>
    )
}