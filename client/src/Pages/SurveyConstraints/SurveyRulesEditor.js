import * as Space from 'react-spaces';
import {useEffect, useState} from "react";
import Connection from "../../Communication/Connection";
import {Button, Collapse, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import SurveyRule from "./SurveyRule";

import gematriya from "gematriya";
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";

const offline_data_rules = [{id: 1, goalSelection: 1, children: [{id: 4, questionSelection: '',
        children: [{id: 5, questionSelection: '', children: [], constraint: {type: '', value: ''}}], constraint: {type: '', value: ''}}]},
    {id: 2, goalSelection: 2, children: []}];
const offline_goals_data = [{value: 1, description: "hello there"}, {value: 2, description: "general kenobi"}];
const offline_questions_data = [{id: 0, question: "sup", type: "MULTIPLE_CHOICE", answers: ['dunno', 'have no idea', 'idk']},
    {id: 1, question: 'up dawg', type: 'NUMERIC_ANSWER', answers: ''},
    {id: 2, question: 'how are you', type: 'MULTIPLE_CHOICE', answers: ['good', 'fine', 'bad']}]
// NUMERIC_ANSWER, MULTIPLE_CHOICE


const color_stack = ['#ffffff', '#E6B0AA', '#D7BDE2', '#A9CCE3', '#A3E4D7', '#A9DFBF', '#F9E79F', '#F5CBA7'];

export default function SurveyRulesEditor(){

    const [id, setId] = useState('');
    const [surveyTitle, setSurveyTitle] = useState('');

    const [rules, setRules] = useState([]);
    const [ruleID, setRuleID] = useState(1);

    const [years, setYears] = useState([])
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [goals, setGoals] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const no_rules_exist_string = "לא קיימים חוקים";

    const add_rules_button_string = "הוספת חוק";
    const submit_rules_button_string = "סיום ושמירה";
    const form_year_label_string = 'בחירת שנה של היעדים להצגה'

    useEffect(() => {
        var url = new URL(window.location.href);
        var surveyID = url.searchParams.get("surveyID");
        setId(surveyID)

        new Connection().getSurvey(surveyID, arrangeQuestionData); // getting the questions
        new Connection().getSurveyRules(surveyID, arrangeRulesData);

        // calculating the current hewbrew year

        let currentYear = new Date().getFullYear();
        new Connection().getGoals(currentYear, arrangeGoalsData) // getting the goals

        let years_range = [];
        let delta = -7;

        while (delta <= 7) { // calculating up to 7 previous and ahead years
            years_range.push(currentYear + delta);
            delta++;
        }

        setYears(years_range);
    }, []);

    /**
     * arranges the rules data received from the server
     * @param data the data from the server
     */
    const arrangeRulesData = (data) => {
        if(!data.failure){
            let rulesIndexer = 1;
            let rulesData = data.result

        //     {id: 4, questionSelection: '',
        // children: [{id: 5, questionSelection: '', children: [], constraint: {type: '', value: ''}}], constraint: {type: '', value: ''}}

            const generateRules = function(rule){

                if(rule.ruleDTO.subRules === null) {

                    if(rule.ruleDTO.type === 'MULTIPLE_CHOICE'){
                        return {id: rulesIndexer++, goalSelection: rule.goalID, children: [{id: rulesIndexer++, questionSelection: rule.ruleDTO.questionID, children: [],
                            constraint: {type: 'MULTIPLE_CHOICE', value: rule.ruleDTO.answers.map(ele => ele.toString())}}]}
                        
                    }

                    if(rule.ruleDTO.type === "NUMERIC"){
                        
                        return {id: rulesIndexer++, goalSelection: rule.goalID, children: [{id: rulesIndexer++, questionSelection: rule.ruleDTO.questionID, children: [],
                            constraint: {type: rule.ruleDTO.comparison, value: rule.ruleDTO.answers[0]}}]}

                    }
                }

                const generateSubRules = function(subRule){
                    if(subRule.subRules === null){
                        if(subRule.type === 'MULTIPLE_CHOICE'){
                            return {id: rulesIndexer++, questionSelection: subRule.questionID, children: [],
                                constraint: {type: 'MULTIPLE_CHOICE', value: subRule.answers.map(ele => ele.toString())}}
                        }

                        if(subRule.type === "NUMERIC"){
                            return {id: rulesIndexer++, questionSelection: subRule.questionID, children: [],
                            constraint: {type: subRule.comparison, value: subRule.answers[0]}}
                        }
                    }

                    return {id: rulesIndexer++, questionSelection: subRule.type, children: subRule.subRules.map(generateSubRules), constraint: {type: '', value: ''}}
                }

                return {id: rulesIndexer++, goalSelection: rule.goalID, children: [{id: rulesIndexer++, questionSelection: rule.ruleDTO.type, children: rule.ruleDTO.subRules.map(generateSubRules),
                    constraint: {type: '', value: ''}}]}
            }
            
            setRules(rulesData.rules.map(generateRules))
            setRuleID(rulesIndexer);

            console.log('arranged rules')
        }
    }

    /**
     * arranges the data received from the server regarding the goals
     * @param data the data from the server
     */
    const arrangeGoalsData = (data) => {


        if(!data.failure){
            setGoals([])

            // const rulesMap = (element) => {
            //     return {id: element.id, goalSelection: '', children: element.children}
            // }
            //
            // setRules((rules) => rules.map(rulesMap))

            for (const row of data.result){
                setGoals(goals => [...goals, {value: row.goalId, description: row.title}]);
            }
        }
    }

    /**
     * arranged the data received from the server regarding the question
     * @param data the data from the server
     */
    const arrangeQuestionData = (data) => {
        if(!data.failure) {
            function zip(arrays) {
                return arrays[0].map(function(_,i){
                    return arrays.map(function(array){return array[i]})
                });
            }

            const survey = data.result;

            setSurveyTitle(survey.title)

            const zippedQuestionsList = zip([survey.questions, survey.types, survey.answers]);

            zippedQuestionsList.slice(1).forEach(([question, type, answers], indexer) => setQuestions(questions => // slicing the first question cause it's unnecessary
                [...questions, {id: indexer+1, question: question, type: type, answers: answers}]));
        }
    }

    /**
     * adds a new rule
     */
    const addRule = () => {
        setRules([...rules, {id: ruleID, goalSelection: '', children: []}])
        setRuleID(ruleID + 1)
    }

    /**
     * adds a new condition in a given sub-rule
     * @param id the id of the sub-rule to add the new condition to
     * @param trace the trace of parents of the sub-rule
     */
    const addCell = (id, trace) => {
        //console.log(`the trace of id ${id} is ${trace}`)
        let temp_trace = [...trace];

        const find_and_add = function(cell) {

            if(temp_trace.length  === 0 && cell.id === id){

                const temp_cell = {...cell};
                temp_cell.children.push({id: ruleID, questionSelection: '', children: [], constraint: {type: '', value: ''}});
                setRuleID(ruleID + 1);

                return temp_cell;

            }

            if(temp_trace.length === 0 && cell.id !== id){
                return cell;
            }

            if(!temp_trace.includes(cell.id)){
                return cell;
            }

            // else the current one is included in the list
            const temp_cell = {...cell};
            temp_trace.shift();
            temp_cell.children = cell.children.map(find_and_add)

            return temp_cell;
        }

        setRules(rules.map(find_and_add))
    }

    /**
     * removed a given cell
     * @param id the id of the cell to remove
     * @param trace the trace of the cell to remove
     */
    const removeCell = (id, trace) => {
        let temp_trace = [...trace];

        const find_and_remove = function(cell) {

            if(!temp_trace.includes(cell.id)){
                return cell;
            }

            // else the current one is included in the list
            const temp_child = {...cell};
            temp_trace.shift();

            if(temp_trace.length === 0){
                temp_child.children = cell.children.filter((sub_cell) => sub_cell.id !== id)
            }
            else{
                temp_child.children = cell.children.map(find_and_remove)
            }


            return temp_child;
        }

        if(temp_trace.length === 0){
            setRules(rules.filter((cell) => cell.id !== id))
        }
        else{
            setRules(rules.map(find_and_remove))
        }
    }

    /**
     * handler for the onChange of a goal select element
     * @param id the id of the cell affected
     * @param value the new value which has been selected
     */
    const handleGoalSelectionChange = (id, value) => {
        setRules(rules.map(rule => {
            if(rule.id !== id){
                return rule;
            }

            const temp_rule = {...rule};
            temp_rule.goalSelection = value;

            return temp_rule;
        }))
    }

    /**
     * handler for the onChange of a question select element
     * @param id the id of the cell in which the change occurred
     * @param trace the trace of parents to the child
     * @param value the value to change to
     */
    const handleQuestionSelectionChange = (id, trace, value) => {
        let temp_trace = [...trace];

        const getQuestionType = (id) => {
            if(id === undefined){
                return '';
            }

            if(id === '' || id === 'AND' || id === 'OR'){
                return '';
            }

            const question = questions.find(element => element.id === id);
            return question.type;
        }

        const find_and_edit = function(cell) {

            if(temp_trace.length  === 0 && cell.id === id){

                const temp_cell = {...cell};

                if((value !== "AND" && value !== "OR") &&
                    (temp_cell.questionSelection === "AND" || temp_cell.questionSelection === "OR" || temp_cell.questionSelection === "")){

                    if(getQuestionType(value) === "MULTIPLE_CHOICE"){
                        temp_cell.constraint.type = "MULTIPLE_CHOICE";
                        temp_cell.constraint.value = [];
                    }

                    if(getQuestionType(value) === "NUMERIC_ANSWER"){
                        temp_cell.constraint.type = "NUMERIC_ANSWER";
                        temp_cell.constraint.value = '';
                    }


                    temp_cell.children = [];
                } 
                else if((value === "AND" || value === "OR") &&
                    (temp_cell.questionSelection !== "AND" && temp_cell.questionSelection !== "OR")){

                    if (temp_cell.children.length === 0){
                        temp_cell.children = [{id: ruleID, questionSelection: '', children: [], constraint: {type: '', value: ''}}];
                        setRuleID(ruleID + 1);
                    }
                }
                else{
                    if(getQuestionType(value) === "MULTIPLE_CHOICE"){
                        temp_cell.constraint.type = "MULTIPLE_CHOICE";
                        temp_cell.constraint.value = [];
                    }

                    if(getQuestionType(value) === "NUMERIC_ANSWER"){
                        temp_cell.constraint.type = "NUMERIC_ANSWER";
                        temp_cell.constraint.value = '';
                    }
                }

                temp_cell.questionSelection = value;



                return temp_cell;

            }

            if(temp_trace.length === 0 && cell.id !== id){
                return cell;
            }

            if(!temp_trace.includes(cell.id)){
                return cell;
            }

            // else the current one is included in the list
            const temp_cell = {...cell};
            temp_trace.shift();
            temp_cell.children = cell.children.map(find_and_edit)

            return temp_cell;
        }

        setRules(rules.map(find_and_edit))
    }

    /**
     * handler for the change in the checkboxes of a cell
     * @param id the id of the cell
     * @param trace the trace of the cell
     * @param value the checkbox which got checked
     */
    const handleConstraintValueChoiceChange = (id, trace, value) => {
        let temp_trace = [...trace];

        const find_and_edit = function(cell) {

            if(temp_trace.length  === 0 && cell.id === id){

                const temp_cell = {...cell};

                if(temp_cell.constraint.value.includes(value)){
                    temp_cell.constraint.value = temp_cell.constraint.value.filter(ele => ele !== value)
                }
                else{
                    temp_cell.constraint.value.push(value);
                }

                return temp_cell;

            }

            if(temp_trace.length === 0 && cell.id !== id){
                return cell;
            }

            if(!temp_trace.includes(cell.id)){
                return cell;
            }

            // else the current one is included in the list
            const temp_cell = {...cell};
            temp_trace.shift();
            temp_cell.children = cell.children.map(find_and_edit)

            return temp_cell;
        }

        setRules(rules.map(find_and_edit))
    }

    /**
     * handler for the change of a numerical question constraint
     * @param id the id of the cell the question is in
     * @param trace the trace of the cell the question is in
     * @param type the new type of constraint for the question (new inequality)
     * @param value the new constraint value (numerical)
     */
    const handleNumericalConstraintChange = (id, trace, type, value) => {
        let temp_trace = [...trace];

        const find_and_edit = function(cell) {

            if(temp_trace.length  === 0 && cell.id === id){

                const temp_cell = {...cell};

                temp_cell.constraint.type = type;
                temp_cell.constraint.value = value;

                return temp_cell;

            }

            if(temp_trace.length === 0 && cell.id !== id){
                return cell;
            }

            if(!temp_trace.includes(cell.id)){
                return cell;
            }

            // else the current one is included in the list
            const temp_cell = {...cell};
            temp_trace.shift();
            temp_cell.children = cell.children.map(find_and_edit)

            return temp_cell;
        }

        setRules(rules.map(find_and_edit))
    }

    const submitRulesCallback = (data) => {
        if(data.failure){
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('אראה שגיאה. נא לנסות שוב');
        }
        else{
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('החוקים נשמרו בהצלחה');
        }
    }

    const offline_data_rules = [{id: 1, goalSelection: 1, children: [{id: 4, questionSelection: '',
            children: [{id: 5, questionSelection: '', children: [], constraint: {type: '', value: ''}}], constraint: {type: '', value: ''}}]},
        {id: 2, goalSelection: 2, children: []}];

    /**
     * on change handler for selecting a new year
     * @param event the element on which the on change happened
     */
    const yearChange = (event) => {
        setSelectedYear(event.target.value)

        new Connection().getGoals(event.target.value, arrangeGoalsData) // getting the new goals
    }

    const submitRules = () => {

        const generateRules = function(rule){

            if(rule.children.length === 0) {
                if(rule.constraint.type === 'MULTIPLE_CHOICE'){
                    return {subRules: [], type: 'MULTIPLE_CHOICE',
                        comparison: 'NONE', questionID: rule.questionSelection, answers: rule.constraint.value}
                }

                if(['GREATER_THAN', 'LESS_THAN', 'EQUAL'].includes(rule.constraint.type)){
                    return {subRules: [], type: 'NUMERIC',
                        comparison: rule.constraint.type, questionID: rule.questionSelection, answers: [rule.constraint.value]}
                }
            }

            const generateSubRules = function(subRule){
                if(subRule.children.length === 0){
                    if(subRule.constraint.type === 'MULTIPLE_CHOICE'){
                        return {subRules: [], type: 'MULTIPLE_CHOICE',
                            comparison: 'NONE', questionID: subRule.questionSelection, answers: subRule.constraint.value}
                    }

                    if(['GREATER_THAN', 'LESS_THAN', 'EQUAL'].includes(subRule.constraint.type)){
                        return {subRules: [], type: 'NUMERIC',
                            comparison: subRule.constraint.type, questionID: subRule.questionSelection, answers: [subRule.constraint.value]}
                    }
                }

                

                return {subRules: subRule.children.map(child => generateSubRules(child)), type: subRule.questionSelection,
                comparison: 'NONE', questionID: '-1', answers: []}
            }

            console.log('what was selcted: ' + rules.goalSelection)
            return {goalID: rule.goalSelection, ruleDTO: rule.children.map(generateSubRules)[0]}
        }


        new Connection().submitSurveyRules(id, rules.map(generateRules), submitRulesCallback)
    }

    return (
        <Space.Fill scrollable>
            <div className="Survey">
                {/*title*/}
                <h1>חוקים עבור {surveyTitle}</h1>

                {/*form year select*/}
                <FormControl  sx={{width: "40%", marginBottom: '2%'}}>
                    <InputLabel>{form_year_label_string}</InputLabel>
                    <Select
                        value={selectedYear}
                        label={form_year_label_string}
                        onChange={yearChange}
                    >
                        {years.map(year => <MenuItem value={year}>{year}</MenuItem>)}
                    </Select>
                </FormControl>

                <Collapse in={rules.length === 0}>
                    <Typography id={'no-rules-message'} variant={'h5'} sx={{marginBottom: "2%"}}>{no_rules_exist_string}</Typography>
                </Collapse>



                {/*the rules*/}
                {rules.map((rule) =>
                    <SurveyRule id={rule.id} depth={0} colors={color_stack} goalSelection={rule.goalSelection}
                                children={rule.children} trace={[]} goals={goals} questions={questions}
                                addCell={addCell} removeCell={removeCell} goalSelectionChange={handleGoalSelectionChange}
                                handleConstraintValueChoiceChange={handleConstraintValueChoiceChange}
                                questionSelectionChange={handleQuestionSelectionChange}
                                handleNumericalConstraintChange={handleNumericalConstraintChange}/>)}

                {/*add rule button*/}
                <Button id={'survey_rules_add_rule_button'} sx={{marginTop: '1%'}} onClick={() => addRule()} variant={'contained'}>{add_rules_button_string}</Button>
                <Button id={'survey_rules_submit_rules_button'} onClick={() => submitRules()} variant={'contained'} color={'success'} sx={{marginTop: 1}}>{submit_rules_button_string}</Button>
                
                {/* notification alert */}
                <NotificationSnackbar
                    open={openSnackbar}
                    setOpen={setOpenSnackbar}
                    severity={snackbarSeverity}
                    message={snackbarMessage}/>
            </div>
        </Space.Fill>
    )
}
