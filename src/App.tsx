import React, {useState} from 'react';
import {ListItemIcon, makeStyles, Switch} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Calculation, {Result} from "./components/Calculation";
import {Equation} from "./types/types";
import getEquation from "./utils/getEquation";
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    result: {
        padding: theme.spacing(3),
        fontSize: "24px",
        textAlign: "center"
    },
    resultText: {
        fontSize: "48px",
    },
    right: {
        backgroundColor: '#2E8826',
        color: '#fff'
    },
    wrong: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    content: {
        marginTop: theme.spacing(1)
    }
}));


type Statistic = {
    right: number
    wrong: number
    sumTime: number
    count: number
    shortCutCount: number
}

const difficultyLabels = {
    0: "Zahlen zuordnen",
    1: "Zahlen auffüllen 10",
    2: "Zahlen auffüllen 20",
    3: "Berechnung 5er Blöcke",
    4: "Berechnung normal",
    5: "Berechnung gleich verteilt",
    6: "Berechnung zufällige Zuordnung",
}

function App() {
    const classes = useStyles();

    const [difficulty, setDifficulty] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
    const [plus, setPlus] = useState(true);
    const [minus, setMinus] = useState(false);
    const [equation, setEquation] = useState<Equation | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [statistic, setStatistic] = useState<Statistic>({right: 0, wrong: 0, sumTime: 0, count: 0, shortCutCount: 0});
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const next = () => {
        setEquation((e) => {
            if (e === null || result?.ok) {
                return getEquation(difficulty, plus, minus)
            }
            return ({...e, waitingTime: e.waitingTime + 1000});
        })
        setResult(null);
    }

    const handleDifficulty = (newValue: number) => {
        if (difficulty === newValue) {
            return
        }
        setResult(null);
        setEquation(null)
        setStatistic({right: 0, wrong: 0, sumTime: 0, count: 0, shortCutCount: 0})
        // @ts-ignore
        setDifficulty(newValue)
    };

    let onResult: (result: Result) => void = res => {
        setStatistic(prevState => {
            const r = {...prevState}
            if (res.ok) {
                r.right++
            } else {
                r.wrong++
            }
            if (res.shortCut) {
                r.shortCutCount++
            }
            r.sumTime = r.sumTime + res.time
            r.count++
            return r;
        })
        setResult(res)
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (<Container>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={handleClick}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {difficultyLabels[difficulty]}
                </Typography>
            </Toolbar>
        </AppBar>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {Object.entries(difficultyLabels).map(([key, text]) => (<MenuItem key={key} onClick={() => {
                handleDifficulty(parseInt(key))
                handleClose()
            }} divider={key === '6'}>{text}</MenuItem>))}
            <MenuItem disabled={difficulty < 3}>
                <ListItemIcon>
                    <Switch checked={plus} onChange={(event, checked) => setPlus(checked)} />
                </ListItemIcon>
                <Typography variant="inherit">Addition</Typography>
            </MenuItem>
            <MenuItem disabled={difficulty < 3}>
                <ListItemIcon>
                    <Switch checked={minus} onChange={(event, checked) => setMinus(checked)} />
                </ListItemIcon>
                <Typography variant="inherit">Subtraktion</Typography>
            </MenuItem>
        </Menu>
        <Grid className={classes.content} container spacing={2}>
            {equation == null && <Grid item xs={12}>
                <Paper classes={{root: classes.result + ' ' + classes.right}} onClick={next}>
                    {difficultyLabels[difficulty]}
                    <div className={classes.resultText}>
                        Start
                    </div>
                </Paper>
            </Grid>}
            {result === null && equation != null &&
            <Calculation {...equation} showQuestionMark={difficulty === 1 || difficulty === 2} key={equation.id}
                         onResult={onResult} />}
            {result !== null &&
            <>
                <Grid item xs={12}>
                    <Paper classes={{root: classes.result + ' ' + (result.ok ? classes.right : classes.wrong)}}
                           onClick={next}>
                        Zeit: {result.time / 1000} Sekunden
                        <div className={classes.resultText}>
                            {result.ok ? 'Richtig' : 'Falsch'}
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={8}>Richtig:</Grid><Grid item xs={4}>{statistic.right}</Grid>
                <Grid item xs={8}>Falsch:</Grid><Grid item xs={4}>{statistic.wrong}</Grid>
                <Grid item xs={8}>Abgekürzt:</Grid><Grid item xs={4}>{statistic.shortCutCount}</Grid>
                <Grid item xs={8}>Durchschnittliche Zeit:</Grid><Grid item
                                                                      xs={4}>{Math.round(statistic.sumTime / statistic.count) / 1000} s</Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent={"center"}>
                        <Button onClick={next} color={"primary"} variant={"outlined"}>
                            {result.ok ? "Nächste Aufgabe" : "Nochmal"}
                        </Button>
                    </Grid>
                </Grid>

            </>}
        </Grid>
    </Container>);
}

export default App;
