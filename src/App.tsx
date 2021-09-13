import React, {useEffect, useState} from 'react';
import {IconButton, makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ExposureIcon from '@material-ui/icons/Exposure';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import Calculation, {Result} from "./components/Calculation";
import {Difficulty, Equation, Operation} from "./types/types";
import getEquation from "./utils/getEquation";

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
    }
}));


type Statistic = {
    right: number
    wrong: number
    sumTime: number
    count: number
    shortCutCount: number
}

function App() {
    const classes = useStyles();

    const [difficulty, setDifficulty] = useState<Difficulty>("FILL_FIRST");
    const [operation, setOperation] = useState<Operation>("PLUS");
    const [equation, setEquation] = useState<Equation>(() => getEquation(difficulty, operation));
    const [result, setResult] = useState<Result | null>(null);
    const [statistic, setStatistic] = useState<Statistic>({right: 0, wrong: 0, sumTime: 0, count: 0, shortCutCount: 0});

    const next = () => {
        if (result?.ok) {
            setEquation(getEquation(difficulty, operation))
        } else {
            setEquation((e) => ({...e, waitingTime: e.waitingTime + 1000}))
        }
        setResult(null);
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: Difficulty) => {
        if (difficulty === newValue) {
            return
        }
        setResult(null);
        setDifficulty(newValue);
    };

    const changeOperation = () => {
        setOperation(prevState => {
            switch (prevState) {
                case "PLUS":
                    return "MINUS";
                case "MINUS":
                    return "BOTH";
                case "BOTH":
                    return "PLUS";
            }
        })
    };

    useEffect(() => {
        setEquation(getEquation(difficulty, operation))
    }, [difficulty, operation]);

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
    return (<Container>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container justifyContent={"center"}>
                    <Tabs value={difficulty} onChange={handleTabChange}>
                        <Tab label="Leicht" value={"FILL_FIRST"} />
                        <Tab label="Mittel" value={"FILL_EQUAL"} />
                        <Tab label="Schwer" value={"FILL_RANDOM"} />
                        <IconButton onClick={changeOperation}>
                            {operation === "PLUS" && <AddBoxIcon />}
                            {operation === "MINUS" && <IndeterminateCheckBoxIcon />}
                            {operation === "BOTH" && <ExposureIcon />}
                        </IconButton>
                    </Tabs>
                </Grid>
            </Grid>
            {result === null && <Calculation {...equation} key={equation.id} onResult={onResult} />}
            {result !== null &&
            <>
                <Grid item xs={12}>
                    <Paper classes={{root: classes.result + ' ' + (result.ok ? classes.right : classes.wrong)}}>
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