import * as Space from 'react-spaces';
import {
    Alert, Autocomplete, Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent, Chip,
    Collapse, FormControl, InputLabel, MenuItem,
    Paper, Select, Stack,
    TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import './GuidingBaskets.css'
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationSnackbar from "../../CommonComponents/NotificationSnackbar";

function AddBasketForm(props){

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [fileUploaded, setFileUploaded] = useState(false)

    const [error, setError] = useState(false)

    const form_title_string = 'הוספת סל';
    const form_title_field_label_string = 'כותרת הסל';
    const form_description_field_label_string = 'תיאור הסל';
    const form_tags_field_label_string = 'תגיות (מופרדות עם פסיקים)';
    const upload_file_button_string = 'העלאת קובץ';
    const form_add_button_string = 'הוספה';

    const errorMessage = 'נא למלא את כל השדות ולהעאלות קובץ';

    const handleSubmit = (event) => {
        event.preventDefault();

        if (title.trim() === '' || description.trim() === '' || tags.trim() === '' || !fileUploaded){
            setError(true)
        }
        else{
            setError(false)
            setTitle('')
            setDescription('')
            setTags('')
            setFileUploaded(false)
            props.addBasketHandler(title, description, tags, fileUploaded)
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
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    label={form_title_field_label_string}
                    error={error && title.trim() === ''}
                />

                {/*form description*/}
                <TextField
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    label={form_description_field_label_string}
                    error={error && description.trim() === ''}
                />

                {/*form tags*/}
                <TextField
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    label={form_tags_field_label_string}
                    error={error && tags.trim() === ''}
                />

                <Button variant={fileUploaded ? "outlined" : "contained"} color={error && !fileUploaded ? 'error' : 'secondary'} sx={{width: "20%", marginBottom: "1%"}} onClick={() => setFileUploaded(!fileUploaded)}>{upload_file_button_string}</Button>

                {/*form submit button*/}
                <Button type="submit" variant={"contained"} sx={{width: "20%", marginBottom: "1%"}}>{form_add_button_string}</Button>
            </Stack>
        </Paper>
    )
}

const mock_corpus = [
    {
        id: 1,
        title: "hello there",
        description: "general kenobi",
        tags: ['jedi', 'civilized']
    },
    {
        id: 2,
        title: "anakin don't try it",
        description: "you underestimate my powers",
        tags: ['sith', 'traitor']
    },
    {
        id: 3,
        title: "mace",
        description: 'windo',
        tags: ['jedi', 'badass']
    },
    {
        id: 4,
        title: "the tragedy of darth plagueis the wise",
        description: "Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself",
        tags: ['tragedy', 'sith', 'national treasure']
    },
    {
        id: 5,
        title: "how padme died?",
        description: 'died of the big sad',
        tags: ['sad', 'padme', 'anakin']
    }
]


export default function GuidingBaskets(){
    const [indexer, setIndexer] = useState(6);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false)
    const [corpus, setCorpus] = useState(mock_corpus);
    const [results, setResults] = useState([])


    const [showAddBasket, setShowAddBasket] = useState(false)
    const [addButtonPressed, setAddButtonPressed] = useState(false)

    const [searchError, setSearchError] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarSeverity, setSnackbarSeverity] = useState('')
    const [snackbarMessage, setSnackbarMessage] = useState('')


    // strings
    const page_title_string = 'סלי הדרכה';
    const search_button_string = 'חיפוש'
    const search_error_alert_string = 'נא להכניס טקסט בתיבת החיפוש'
    const no_results_string = "לא נמצאו סלים המתאימים לשאילתה";
    const add_basket_button_string = "הוספת סל";

    // card content strings
    const tags_string = 'תגיות:'
    const download_basket_string = "הורדת הסל";
    const edit_basket_string = "עריכת הסל";
    const remove_basket_string = "הסרת הסל";

    /**
     * naive information retrieval algorithm
     */
    const searchBaskets = () => {
        setResults([]) // resetting results

        setSearchError(false)

        let tokenizedQuery = query.split(' ')

        const searchCorpus = (token) => {
            corpus.forEach(function(element){
                if (element.title.includes(token)){ // checking title
                    setResults((results) => [...results, element])
                }
                else if (element.description.includes(token)){  // checking description
                    setResults((results) => [...results, element])
                }
                else if (element.tags.includes(token)){ // checking tags
                    setResults((results) => [...results, element])
                }
            })
        }

        tokenizedQuery.forEach(searchCorpus)
        setIsSearching(true)
    }

    const addBasketsHandler = (title, description, tags, file) => {
        setCorpus((corpus) => [...corpus, {id: indexer, title: title, description: description, tags: tags.trim().split(',')}])
        setIndexer(indexer + 1)

        setOpenSnackbar(true);
        setSnackbarSeverity('success');
        setSnackbarMessage('הסל הוסף בהצלחה');
    }

    const removeBasketHandler = (id) => {
        setCorpus(corpus.filter((element) => element.id !== id))
        setResults(results.filter((element) => element.id !== id))

        setOpenSnackbar(true);
        setSnackbarSeverity('success');
        setSnackbarMessage('הסל הוסר בהצלחה');
    }

    return (
        <Space.Fill scrollable>
            <div className='Guiding-baskets'>

                {/*page title*/}
                <h1>{page_title_string}</h1>

                <Box sx={{width: '70%', marginBottom: '1%'}}>
                    <Button onClick={function () {setShowAddBasket(!showAddBasket); setAddButtonPressed(!addButtonPressed)}}
                            variant={addButtonPressed ? "outlined" : "contained"} startIcon={addButtonPressed ? <ExpandLessIcon/> : <ExpandMoreIcon/>}>
                        {add_basket_button_string}</Button>
                    {/*collapsed new goal form*/}
                    <Collapse sx={{width: "40%"}} in={showAddBasket}><AddBasketForm addBasketHandler={addBasketsHandler}/></Collapse>
                </Box>

                {/*alert*/}
                <Collapse in={searchError}>
                    <Alert sx={{marginBottom: '5%'}} severity={'error'}>{search_error_alert_string}</Alert>
                </Collapse>

                {/*search bar*/}
                <TextField
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    sx={{width: '70%', marginBottom: '5%'}}
                    onKeyDown={(e) => {
                        if(e.keyCode === 13){
                            searchBaskets()
                        }
                    }}
                    InputProps={{
                        type: 'search',
                        endAdornment: (
                            <Button variant={"outlined"} onClick={() => searchBaskets()}>{search_button_string}</Button>
                        )
                    }}
                    error={searchError}
                />

                {isSearching && (results.length === 0 ? <Typography variant={'h4'}>{no_results_string}</Typography> :
                results.map((element) =>
                    <Card variant="outlined" sx={{width: '70%', margin: '2%'}}>
                        <CardActionArea>
                            <CardContent>
                                {/*title of the basket*/}
                                <Typography variant="h5" component="div">
                                    {element.title}
                                </Typography>
                                {/*description of the basket*/}
                                <Typography sx={{marginBottom: '1%'}} variant="body1">
                                    {element.description}
                                </Typography>
                                <Typography>
                                    {tags_string} {element.tags.map((tag) => <Chip label={tag} variant={'outlined'}/>)}
                                </Typography>

                            </CardContent>
                            <CardActions>
                                <Button color={'secondary'} size={"medium"}>{download_basket_string}</Button>
                                <Button color={'secondary'} size={"medium"}>{edit_basket_string}</Button>
                                <Button color={'error'} size={"medium"} onClick={() => removeBasketHandler(element.id)}>{remove_basket_string}</Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                ))}

                {/*notification snackbar*/}
                <NotificationSnackbar
                    open={openSnackbar}
                    setOpen={setOpenSnackbar}
                    severity={snackbarSeverity}
                    message={snackbarMessage}/>
            </div>
        </Space.Fill>
    )
}