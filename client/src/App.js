import './App.css';
import React, {useEffect, useState} from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// PAGES
import Login from "./Pages/Credentials/Login";
import RegisterUsers from "./Pages/Credentials/RegisterUsers";
import Survey from "./Pages/Survey/Survey";
import WorkPlan from "./Pages/WorkPlan/WorkPlan";
import UsersManagement from "./Pages/UsersManagement/UsersManagement";
import InfoViewer from "./Pages/GeneralSupervisorInfoViewer/InfoViewer";
import GuidingBaskets from "./Pages/GuidingBaskets/GuidingBaskets";
import WorkReport from "./Pages/WorkReport/WorkReport";
import PasswordAuthentication from "./Pages/Credentials/PasswordAuthentication";
import GoalsManagement from "./Pages/GoalsManagement/GoalsManagement";
import ProfilePage from "./Pages/Profile/ProfilePage";
import SchoolsManagement from "./Pages/SchoolsManagement/SchoolsManagement";
import SurveyBuilder from "./Pages/SurveyBuilder/SurveyBuilder";

// COMPONENTS
import {
    AppBar, Backdrop, Box,
    Button, Dialog, DialogTitle, Divider,
    Drawer, Grid, IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar
} from "@mui/material";
import SurveyMenu from "./Pages/Survey/SurveyMenu";
import * as Space from 'react-spaces';
import Connection from "./Communication/Connection";

// ICONS
import HomeIcon from '@mui/icons-material/Home';
import PollIcon from '@mui/icons-material/Poll';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AccountCircle from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import TaskIcon from '@mui/icons-material/Task';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import SurveyRulesEditor from "./Pages/SurveyConstraints/SurveyRulesEditor";
import SurveyGeneralResults from "./Pages/SurveyResults/SurveyGeneralResults";
import SurveySchoolResults from "./Pages/SurveyResults/SurveySchoolResults";
import HelpIcon from '@mui/icons-material/Help';
import {ReactComponent as OurLogo} from "./logo.svg";

// TODO: what to do if the request for info from the server to show fails?
// TODO: currently saving everything in local storage but IT IS NOT SAFE

const help_text = {
    'SYSTEM_MANAGER': [{title: "ניהול משתמשים", description: (".במסך זה מופיעים כלל המשתמשים במערכת, מכל תחומי ההוראה ומכל התפקידים השונים")
            .concat("\n").concat(":בפרט להצגת פרטי המשתמשים ניתן לבצע מגוון פעולות").concat("\n")
            .concat("\n").concat(" ליצור משתמש חדש במערכת - ").concat("\n")
            .concat("\n").concat(":עבור מפקח ניתן לבצע את הפעולות הבאות")
            .concat("\n").concat(" לשנות לו סיסמה - ")
            .concat("\n").concat(" לערוך את בתי הספר אשר בתחום אחריותו - ")
            .concat("\n").concat(" להציג את פרטי המדריכים והמפקחים הכלליים הממונים תחתיו - ")
            .concat("\n").concat(" להסיר משתמש קיים מהמערכת - ").concat("\n")
            .concat("\n").concat(":עבור מדריך ניתן לבצע את הפעולות הבאות")
            .concat("\n").concat(" לשנות לו סיסמה - ")
            .concat("\n").concat(" לערוך את בתי הספר אשר בתחום אחריותו - ")
            .concat("\n").concat(" להציג את פרטי המדריכים והמפקחים הכלליים הממונים תחתיו - ")
            .concat("\n").concat(" לקדם את המדריך למפקח - ")
            .concat("\n").concat(" להסיר משתמש קיים מהמערכת - ")},
        {title: "בתי ספר", description: (".כדי להגיע לתפריט בתי הספר יש ללחוץ על 'בתי הספר' בתפריט הראשי")
                .concat("\n").concat("בעמוד זה ניתן לראות את פרטי בתי הספר הקיימים במערכת ולראות")
                .concat("\n").concat(".את אודותיו ").concat("\n")
                .concat("\n").concat(":בפרט עמוד זה מכיל ")
                .concat("\n").concat("מידע אדמיניסטרטיבי (שם המנהל, מיקום בית הספר ופרטי יצירת קשר) - ")
                .concat("\n").concat("מידע חינוכי (מספר תלמידים, סוג בית הספר וסוג הפיקוח) - ")
                .concat("\n").concat("רכזי בית הספר (שמם של הרכזים ופרטי יצירת קשר) - ")},
        {title: "סלי הדרכה (בפיתוח)", description: (".כדי להגיע אל סלי ההדרכה יש ללחוץ על 'סלי ההדרכה' בתפריט הראשי")
                .concat("\n").concat(".בעמוד זה ניתן לראות סלי הדרכה שונים במגוון רחב של תחומי למידה ").concat("\n")
                .concat("\n").concat("משתמשי המערכת יכולים להעלות חומרי הדרכה ולשתף אותם")
                .concat("\n").concat(".עם שאר המשתמשים ")
                .concat("\n").concat("ניתן לחפש סלי הדרכה על ידי שימוש בשורת החיפוש, אשר תניב")
                .concat("\n").concat(".את סלי ההדרכה המתאימים ביותר והפופולאריים ביותר ")
                .concat("\n").concat("המשתמשים יכולים לדרג את סלי ההדרכה השונים ולהוסיף ביקורת")
                .concat("\n").concat(".ובכך לתרום למשתמשים אחרים").concat("\n")
                .concat("\n").concat("  :) עמוד זה נמצא בשלבי פיתוח מתקדמים - יש למה לחכות")}
    ],

    'SUPERVISOR': [{title: "ניהול משתמשים", description: (".במסך זה מופיעים המדריכים אשר בתחום אחריותך")
            .concat("\n").concat(":בפרט להצגת פרטי המדריכים ניתן לבצע את הפעולות הבאות").concat("\n")
            .concat("\n").concat(" לשנות לו סיסמה - ")
            .concat("\n").concat(" לערוך את בתי הספר אשר בתחום אחריותו - ")
            .concat("\n").concat(" להסיר את המדריך מהמערכת - ")},
        {title: "ניהול סקרים", description: (".כדי להגיע לניהול הסקרים יש ללחוץ על 'ניהול סקרים' בתפריט הראשי")
                .concat("\n").concat(":בעמוד זה ניתן לבצע מגוון פעולות המהוות את איסוף המידע וניתוחו ").concat("\n")
                .concat("\n").concat(":יצירת סקר")
                .concat("\n").concat(".'לעמוד זה ניתן להגיע על ידי לחיצה על כפתור 'יצירת סקר")
                .concat("\n").concat("בעמוד זה ניתן לבנות סקר, להגדיר לו כותרת ותיאור מתאימים וליצור שאלות")
                .concat("\n").concat(":'מסוגים שונים על ידי לחיצה על כפתור 'הוסף שאלה")
                .concat("\n").concat("שאלה פתוחה (מללל חופשי) - ")
                .concat("\n").concat("שאלה מספרית - ")
                .concat("\n").concat("שאלת בחירה מרובה - ").concat("\n")

                .concat("\n").concat("בסיום יצירת הסקר ניתן ללחוץ על 'סיום ושמירת הסקר' אשר ישמור ")
                .concat("\n").concat(".את המצב הנוכחי של הסקר במערכת").concat("\n")

                .concat("\n").concat(":עריכת סקר")
                .concat("\n").concat("על ידי לחיצה על הכפתור 'עריכת סקר' עבור הסקר הרלוונטי ניתן להוסיף או")
                .concat("\n").concat(".להסיר שאלות על ידי לחיצה על הכפתורים 'הוסף' או 'הסר' בהתאמה").concat("\n")

                .concat("\n").concat(":עריכת חוקים")
                .concat("\n").concat("על ידי לחיצה על הכפתור 'עריכת חוקים' עבור הסקר הרלוונטי ניתן להוסיף או")
                .concat("\n").concat(".להסיר חוקים על ידי לחיצה על הכפתורים 'הוסף' או 'הסר' בהתאמה")

                .concat("\n").concat(":הוספת חוק")
                .concat("\n").concat("בהינתן יעד ניתן להגדיר אילוץ המגדיר תשובות שאינן חוקיות לסקר זה")
                .concat("\n").concat(":ומהוות בעיה")
                .concat("\n").concat("חוק בחירה מרובה - ניתן לבחור מהאופציות הקיימות לשאלה מספר - ")
                .concat("\n").concat("אפשרויות שאינן תשובות תקינות")
                .concat("\n").concat("חוק מספרי - ניתן להגדיר אי שיוויון הקובע באיזה תחום מספרי - ")
                .concat("\n").concat(" התשובות אינן תקינות")
                .concat("\n").concat("חוק מורכב 'וגם' - חוק בו כל תתי החוקים צריכים להתקיים כדי שהביטוי  - ")
                .concat("\n").concat("כולו יתקיים")
                .concat("\n").concat("חוק מורכב 'או' - חוק בו לפחות תת חוק אחד מתקיים כדי שהביטוי - ")
                .concat("\n").concat("כולו יתקיים")
                .concat("\n").concat(":דוגמא לחוק - יעד בטיחות במעבדה")
                .concat("\n").concat("גם (חוק מספרי - מספר התלמידים גדול מ-30) וגם (חוק בחירה מרובה - קיים הציוד הדרוש כאשר התשובה שאינה תקינה היא לא)").concat("\n")

                .concat("\n").concat(":פרסום הסקר")
                .concat("\n").concat(".על ידי לחיצה על הכפתור 'שגר סקר' עבור הסקר הרלוונטי תישלח הודעת מייל עם קישור אל הסקר אל הרכזים השייכים לבתי הספר אשר בתחום אחריותך")

                .concat("\n")
                .concat("\n").concat(":צפייה בשובות")
                .concat("\n").concat("על ידי לחיצה על הכפתור 'צפייה בתשובות' עבור הסקר הרלוונטי יהיה ניתן")
                .concat("\n").concat(":לצפות בסטטיסטיקות שונות אודות התשובות שנענו")
                .concat("\n").concat("עבור שאלה מספרית תוצג התשובה הממוצעת - ")
                .concat("\n").concat("עבור שאלה מרובת ערכים תוצג היסטוגרמה התציג את התפלגות התשובות - ")
                .concat("\n").concat("בטבלה העליונה על ידי לחיצה על סמל בית ספר מסויים ניתן לראות את התשובות שנענו על הסקר")

                .concat("\n")
                .concat("\n").concat(":בניית תוכנית עבודה")
                .concat("\n").concat(".על ידי לחיצה על הכפתור 'בניית תוכנית עבודה לפי סקר' עבור הסקר הרלוונטי המערכת תיצור עבור כל מדריך אשר בתחום אחריותך מערכת שעות שנוצרה")
                .concat("\n").concat(":על ידי שיקלול מספר רכיבים")
                .concat("\n").concat("ימי ושעות הפעילות של המדריך - ")
                .concat("\n").concat("יעדי משרד החינוך - ")
                .concat("\n").concat("תשובות שנאספו ונותחו - ")
                .concat("\n").concat("אילוצי זמן כמו חגים - ")

        },
        {title: "ניהול יעדים", description: (".כדי להגיע לניהול היעדים יש ללחוץ על 'ניהול יעדים' בתפריט הראשי")
                .concat("\n").concat(".בעמוד זה ניתן לצפות ביעדים משרד החינוך בהינתן שנה ")
                .concat("\n").concat("בנוסף על ידי לחיצה על הכפתור 'יצירת יעד' ניתן ליצור יעד חדש בהינתן ").concat("\n")
                .concat("\n").concat("כותרת ותיאור היעד - ")
                .concat("\n").concat("משקל היעד (מדד 1-10 המסמל את חשיבותו) - ")
                .concat("\n").concat("בחירת הרבעון שיש לסיים עד אליו את היעד - ")
                .concat("\n").concat("שנת הלימודים אליה היעד שייך - ")},
        {title: "בתי ספר", description: (".כדי להגיע לתפריט בתי הספר יש ללחוץ על 'בתי הספר' בתפריט הראשי")
                .concat("\n").concat("בעמוד זה ניתן לראות את פרטי בתי הספר הקיימים במערכת ולראות")
                .concat("\n").concat(".את אודותיו ").concat("\n")
                .concat("\n").concat(":בפרט עמוד זה מכיל ")
                .concat("\n").concat("מידע אדמיניסטרטיבי (שם המנהל, מיקום בית הספר ופרטי יצירת קשר) - ")
                .concat("\n").concat("מידע חינוכי (מספר תלמידים, סוג בית הספר וסוג הפיקוח) - ")
                .concat("\n").concat("רכזי בית הספר (שמם של הרכזים ופרטי יצירת קשר) - ")},
        {title: "סלי הדרכה (בפיתוח)", description: (".כדי להגיע אל סלי ההדרכה יש ללחוץ על 'סלי ההדרכה' בתפריט הראשי")
                .concat("\n").concat(".בעמוד זה ניתן לראות סלי הדרכה שונים במגוון רחב של תחומי למידה ").concat("\n")
                .concat("\n").concat("משתמשי המערכת יכולים להעלות חומרי הדרכה ולשתף אותם")
                .concat("\n").concat(".עם שאר המשתמשים ")
                .concat("\n").concat("ניתן לחפש סלי הדרכה על ידי שימוש בשורת החיפוש, אשר תניב")
                .concat("\n").concat(".את סלי ההדרכה המתאימים ביותר והפופולאריים ביותר ")
                .concat("\n").concat("המשתמשים יכולים לדרג את סלי ההדרכה השונים ולהוסיף ביקורת")
                .concat("\n").concat(".ובכך לתרום למשתמשים אחרים").concat("\n")
                .concat("\n").concat("  :) עמוד זה נמצא בשלבי פיתוח מתקדמים - יש למה לחכות")}
    ],

    'INSTRUCTOR': [{title: "ניהול לוח העבודה", description: (".במסך זה מופיע לוח שנה המכיל את הפעילויות שעליך לבצע")
            .concat("\n").concat(".'ניתן לראות את הפעילויות בחודשים השונים ע''י לחיצה על 'הקודם' או 'הבא ")
            .concat("\n").concat(".'בנוסף, ניתן לראות את שעות הפעילות על ידי לחיצה על כפתור 'היום ").concat("\n")
            .concat("\n").concat(":את לוח השנה אתה יכול לארגן כראות עיניך במספר דרכים שונות")
            .concat("\n").concat("על ידי גרירת הפעילות באמצעות העכבר לחלון הזמן הרצוי - ")
            .concat("\n").concat("על ידי לחיצה על כפתור 'עדכון לוח העבודה' וליצור פעילות חדשה - ")
            .concat("\n").concat("על ידי לחיצה כפולה על פעילות בכדי למחוק אותה - ")},
        {title: "ניהול פרטים אישיים", description: (".כדי להגיע לאיזור האישי יש ללחוץ על 'פרופיל' בתפריט הראשי")
                .concat("\n").concat(":בעמוד זה ניתן לעדכן את פרטיכם האישיים לרבות ").concat("\n")
                .concat("\n").concat("שם פרטי ושם משפחה - ")
                .concat("\n").concat("כתובת מייל אלקטרוני - ")
                .concat("\n").concat("מספר טלפון - ")
                .concat("\n").concat("עיר מגורים - ")
                .concat("\n").concat("יום העבודה ושעות הפעילות - ")
                .concat("\n").concat("סיסמה - ").concat("\n")
                .concat("\n").concat(".בנוסף ניתן להוריד את דו''ח העבודה החודשי בהינתן שנה וחודש ")},
        {title: "בתי ספר", description: (".כדי להגיע לתפריט בתי הספר יש ללחוץ על 'בתי הספר' בתפריט הראשי")
                .concat("\n").concat("בעמוד זה ניתן לראות את פרטי בתי הספר הקיימים במערכת ולראות")
                .concat("\n").concat(".את אודותיו ").concat("\n")
                .concat("\n").concat(":בפרט עמוד זה מכיל ")
                .concat("\n").concat("מידע אדמיניסטרטיבי (שם המנהל, מיקום בית הספר ופרטי יצירת קשר) - ")
                .concat("\n").concat("מידע חינוכי (מספר תלמידים, סוג בית הספר וסוג הפיקוח) - ")
                .concat("\n").concat("רכזי בית הספר (שמם של הרכזים ופרטי יצירת קשר) - ")},
        {title: "סלי הדרכה (בפיתוח)", description: (".כדי להגיע אל סלי ההדרכה יש ללחוץ על 'סלי ההדרכה' בתפריט הראשי")
                .concat("\n").concat(".בעמוד זה ניתן לראות סלי הדרכה שונים במגוון רחב של תחומי למידה ").concat("\n")
                .concat("\n").concat("משתמשי המערכת יכולים להעלות חומרי הדרכה ולשתף אותם")
                .concat("\n").concat(".עם שאר המשתמשים ")
                .concat("\n").concat("ניתן לחפש סלי הדרכה על ידי שימוש בשורת החיפוש, אשר תניב")
                .concat("\n").concat(".את סלי ההדרכה המתאימים ביותר והפופולאריים ביותר ")
                .concat("\n").concat("המשתמשים יכולים לדרג את סלי ההדרכה השונים ולהוסיף ביקורת")
                .concat("\n").concat(".ובכך לתרום למשתמשים אחרים").concat("\n")
                .concat("\n").concat("  :) עמוד זה נמצא בשלבי פיתוח מתקדמים - יש למה לחכות")}
        ]
}

/**
 * a dialog element for helping the user throughout the system
 * @param props the properties the element gets
 * @returns {JSX.Element} the element
 */
function HelpDialog(props){
    const permission = window.sessionStorage.getItem('permission')

    const [helperText, setHelperText] = useState(props.userType === null ? [] : help_text[props.userType])

    const help_title_string = "עזרה";


    return (
        <Dialog titleStyle={{textAlign: "center"}} sx={{alignItems: "right"}} fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
            <DialogTitle><Typography variant="h4" align="center">{help_title_string}</Typography></DialogTitle>
            <List
                sx={{
                    width: '80%',
                    bgcolor: 'background.paper',
                }}
                >
                {helperText.map((element) =>
                    <div>
                        <ListItem>
                            <ListItemText primary={element.title}  primaryTypographyProps={{ style: { textAlign:"right",  fontWeight:"bold"} }}
                                          secondary={element.description} secondaryTypographyProps={{ style: { textAlign:"right", whiteSpace: "pre-line" } }}/>

                        </ListItem>
                    </div>
                    )}
            </List>
        </Dialog>
    )
}


function App(){
    // general state data
    const [type, setType] = useState(window.sessionStorage.getItem('permission')); //TODO: change back to window.sessionStorage.getItem('permission') when not developing
    const [openSidebar, setOpenSidebar] = useState(false);
    const [hideBars, setHideBars] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [name, setName] = useState('');
    const [schools, setSchools] = useState([])
    const [schoolsLoaded, setSchoolsLoaded] = useState(false)

    // authentication related
    const [authAvailability, setAuthAvailability] = useState(false);
    const [authCallback, setAuthCallback] = useState(() => () => {console.log("not auth callback")});
    const [authCalleePage, setAuthCalleePage] = useState('');
    const [authGoToPage, setAuthGoToPage] = useState('');

    // help dialog related
    const [openHelpDialog, setOpenHelpDialog] = useState(false);

    let navigate = useNavigate();

    //let type = "SUPERVISOR";
    const barWidth = "10%";
    const sidebarWidth = "15%";
    const page_does_not_exist_string = "דף זה אינו קיים";
    const logout_button_string = "יציאה";
    const greetings_string = "שלום " + name;

    useEffect(() => {
        if(type === null){
            setHideBars(true);
        }

        let current_type = window.sessionStorage.getItem('permission');
        if(!window.sessionStorage.getItem('schools')) {
            if((current_type === "INSTRUCTOR" || current_type === "SUPERVISOR" || current_type === "SYSTEM_MANAGER")){

                new Connection().getUserSchools(arrangeSchools)
            }
        }
        else{
            setSchools(JSON.parse(window.sessionStorage.getItem('schools')))
            setSchoolsLoaded(true)
        }

        // for the case of a guest who fills the survey
        let url = window.location.href
        if(url.includes('survey/getSurvey') &&
            !(current_type === "INSTRUCTOR" || current_type === "SUPERVISOR" || current_type === "SYSTEM_MANAGER")){
            setSchoolsLoaded(true)
        }


    }, [type])

    /**
     * arranges the schools data
     * @param data the data
     */
    const arrangeSchools = (data) => {
        if(!data.failure){
            const mapFunc = (ele) => {
                return {id: ele.second, label: `${ele.first} (${ele.second})`}
            }

            let schools_data = data.result.map(mapFunc);
            setSchools(schools_data)
            window.sessionStorage.setItem('schools', JSON.stringify(schools_data));
            setSchoolsLoaded(true)
        }
    }

    /**
     * a callback to call when the result of the logout request got back
     * @param data the response for the logout request
     */
    const logoutCallback = (data) => {
        if(!data.failure){
            window.sessionStorage.removeItem('permission');
            window.sessionStorage.removeItem('schools');
            setType(null);
            setHideBars(true);
            navigate('/user/login', {replace: true});
        }
    }

    /**
     * handler for when the logout button is pressed
     */
    const handleLogout = () => {
        new Connection().logout(logoutCallback);
    }

    // sidebar
    const drawer = (
        <Space.Fill>
            <Toolbar />
            <List>
                {/*home button*/}
                <ListItem button onClick={
                    function () {
                        navigate(`user/home`, {replace: false});
                        setOpenSidebar(false);
                        setOpenBackdrop(false);
                    }}>
                    <ListItemIcon>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="בית"/>
                </ListItem>
                {/*profile button*/}
                {(type === 'SUPERVISOR' || type === 'INSTRUCTOR') && <ListItem button onClick={
                    function () {
                        navigate(`user/profile`, {replace: false});
                        setOpenSidebar(false);
                        setOpenBackdrop(false);
                }}>
                    <ListItemIcon>
                        <AccountBoxIcon/>
                    </ListItemIcon>
                    <ListItemText primary="פרופיל"/>
                </ListItem>}
                {/*goals management button*/}
                {(type === 'SUPERVISOR') && <ListItem button onClick={
                    function () {
                        navigate(`user/goalsManagement`, {replace: false});
                        setOpenSidebar(false);
                        setOpenBackdrop(false);
                    }}>
                    <ListItemIcon>
                        <TaskIcon/>
                    </ListItemIcon>
                    <ListItemText primary='ניהול יעדים'/>
                </ListItem>}
                {/*survey button*/}
                {(type === 'SUPERVISOR') &&<ListItem button onClick={
                    function () {
                        navigate(`survey/menu`, {replace: false});
                        setOpenSidebar(false);
                        setOpenBackdrop(false);
                    }}>
                    <ListItemIcon>
                        <PollIcon/>
                    </ListItemIcon>
                    <ListItemText primary="סקרים"/>
                </ListItem>}
                {/*schools button*/}
                <ListItem button onClick={
                    function () {
                        navigate(`user/schools`, {replace: false});
                        setOpenSidebar(false);
                        setOpenBackdrop(false);
                    }}>
                    <ListItemIcon>
                        <SchoolIcon/>
                    </ListItemIcon>
                    <ListItemText primary="בתי ספר"/>
                </ListItem>
                {/*guiding baskets button*/}
                <ListItem button onClick={
                    function () {
                        navigate(`user/guidingBasketsSearch`, {replace: false});
                        setOpenSidebar(false);
                        setOpenBackdrop(false);
                    }}>
                    <ListItemIcon>
                        <ShoppingBasketIcon/>
                    </ListItemIcon>
                    <ListItemText primary="סלי הדרכה"/>
                </ListItem>
            </List>
        </Space.Fill>
    );

    const handleCloseHelpDialog = () => {
        setOpenHelpDialog(false);
    }

    return (
        <div dir="rtl">
            <Space.ViewPort>
                {/*help dialog*/}
                <HelpDialog
                    userType={type}
                    open={openHelpDialog}
                    onClose={handleCloseHelpDialog}
                />

                {/* app bar */}
                {!hideBars && <Space.Top size={barWidth}>
                    <AppBar color="background" position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <Toolbar>
                            {/*menu button*/}
                            <IconButton
                                color="inherit"
                                aria-label="Menu"
                                onClick={
                                    function () {
                                        setOpenSidebar(!openSidebar);
                                        setOpenBackdrop(!openBackdrop);
                                    }
                            }

                            >
                                <MenuIcon />
                            </IconButton>

                            {/*logo*/}
                            <IconButton onClick={() => navigate(`user/home`, {replace: false})}>
                                <OurLogo height={50} width={50}/>
                            </IconButton>

                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={() => navigate(`user/profile`, {replace: false})}
                            >
                                <AccountCircle />
                            </IconButton>
                            {/*greetings text*/}
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                {greetings_string}
                            </Typography>
                            <IconButton
                                size="large"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={() => setOpenHelpDialog(true)}
                            >
                                <HelpIcon/>
                            </IconButton>

                            {/*logout button*/}
                            <Button id="logout_button" onClick={() => handleLogout()} color="inherit">{logout_button_string}</Button>
                        </Toolbar>
                    </AppBar>
                    {/*sidebar*/}
                    <Drawer
                        sx={{
                            width: sidebarWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: sidebarWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={openSidebar}
                    >
                        {drawer}
                    </Drawer>
                </Space.Top>}
                <Space.Fill>
                    {/* routes to the different screens */}
                    <Routes>

                        <Route path="user">
                            <Route path="login" element={<Login type={type} setType={setType} setName={setName} setHideBars={setHideBars}/>}/>

                            {authAvailability && <Route path="auth" element={<PasswordAuthentication callback={authCallback} callee={authCalleePage} goto={authGoToPage} setHideBars={setHideBars}/>}/>}

                            {(type !== "GUEST") && <Route path="profile" element={<ProfilePage userType={type}/>}/>}

                            {(type !== "GUEST") && <Route path="schools" element={<SchoolsManagement userType={type} schools={schools}/>}/>}

                            {(type === 'SYSTEM_MANAGER' || type === "SUPERVISOR" || type === "INSTRUCTOR") &&
                                <Route path="guidingBasketsSearch" element={<GuidingBaskets />}/>}

                            {(type === "SUPERVISOR" || type === "INSTRUCTOR") &&
                                <Route path="workReport" element={<WorkReport/>}/>}

                            {(type === "SUPERVISOR" || type === "SYSTEM_MANAGER") &&
                                <Route path="registerUsers" element={<RegisterUsers type={type}/>}/>}

                            {(type === "SUPERVISOR" || type === "SYSTEM_MANAGER") &&
                                <Route path="goalsManagement" element={<GoalsManagement/>}/>}

                            {(type === "SUPERVISOR" || type === "SYSTEM_MANAGER") &&
                                <Route path="home" element={<UsersManagement userType={type} schools={schools} setAuthAvailability={setAuthAvailability} setAuthCallBack={setAuthCallback} setAuthCalleePage={setAuthCalleePage} setAuthGoToPage={setAuthGoToPage} setHideBars={setHideBars}/>}/>}

                            {(type === "SUPERVISOR" || type === "SYSTEM_MANAGER") &&
                                <Route path='viewWorkPlan' element={<WorkPlan userType={type} schools={schools}/>}/>}

                            {type === "INSTRUCTOR" &&
                                <Route path="home" element={<WorkPlan userType={type} schools={schools}/>}/>}

                            {type === "GENERAL_SUPERVISOR" &&
                                <Route path="home" element={<InfoViewer/>}/>}

                        </Route>

                        {type === "SUPERVISOR" &&
                            <Route path="survey">
                                    <Route path="menu" element={<SurveyMenu setAuthAvailability={setAuthAvailability} setAuthCallBack={setAuthCallback} setAuthCalleePage={setAuthCalleePage} setAuthGoToPage={setAuthGoToPage} setHideBars={setHideBars}/>}/>
                                    <Route path="createSurvey" element={<SurveyBuilder/>}/>
                                    <Route path="rules" element={<SurveyRulesEditor/>}/>
                                    <Route path={'surveyResults'} element={<SurveyGeneralResults/>}/>
                                    <Route path={"schoolSurveyAnswers"} element={<SurveySchoolResults/>}/>
                            </Route>}


                        
                        <Route path="survey">
                            <Route path="getSurvey" element={<Survey setHideBars={setHideBars}/>}/>
                        </Route>


                        <Route
                            path="*"
                            element={
                                <main style={{ padding: "1rem" }}> {/*todo: make this page prettier */}
                                    <p>{page_does_not_exist_string}</p>
                                </main>
                            }
                        />
                    </Routes>
                    <Backdrop open={openBackdrop}/>
                </Space.Fill>
            </Space.ViewPort>
        </div>
    )
}

export default App;

