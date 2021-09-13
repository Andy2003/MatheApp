import React, {FC, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Fields from "./Fields";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core";
import {Equation} from "../types/types";


const useStyles = makeStyles((theme) => ({
    a: {
        backgroundColor: theme.palette.primary.main,
    },
    b: {
        backgroundColor: theme.palette.secondary.main,
    },
    button: {
        margin: theme.spacing(1)
    }
}));

export type Result = {
    ok: boolean,
    time: number,
    shortCut: boolean
}

type Props = Equation & { onResult: (result: Result) => void }

const Calculation: FC<Props> = ({
                                    a,
                                    b,
                                    add,
                                    waitingTime,
                                    aDistribution,
                                    bDistribution,
                                    onResult
                                }) => {
    const classes = useStyles();
    const [startTime] = useState<number>(Date.now())
    const [progress, setProgress] = React.useState(100);
    const [shortCut, setShortCut] = React.useState(false);
    const [retried, setRetried] = React.useState(false);
    const setValue = (n: number) => {
        const time = Date.now() - startTime;
        const ok = add ? (a + b) === n : (a - b) === n;
        onResult({ok, time, shortCut: !retried && shortCut})
    };


    useEffect(() => {
        const x = 100
        let timer: NodeJS.Timeout
        if (progress > 0) {
            timer = setTimeout(() => {
                setProgress(progress - (100 / (waitingTime / x)));
            }, x);
        }
        return () => {
            timer !== null && clearInterval(timer)
        };
    }, [progress, setProgress, waitingTime]);

    const retry = () => {
        setRetried(true)
        setProgress(100)
        setShortCut(false)
    }
    return <>

        {progress > 0 && <><Grid item xs={12}>
            <Grid container justifyContent="center">
                <Paper>
                    <Fields distribution={aDistribution} color={classes.a} />
                </Paper>
            </Grid>
        </Grid>
            <Grid container justifyContent="center">
                {add ?
                    <AddIcon color={"primary"} /> : <RemoveIcon color={"secondary"} />}
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="center">
                    <Paper>
                        <Fields distribution={bDistribution} color={classes.b} />
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <LinearProgress variant="determinate" value={progress} />
            </Grid>
            <Grid container justifyContent="center">
                <Button onClick={() => {
                    setShortCut(true)
                    setProgress(0)
                }} variant={"contained"}>Abkürzen</Button>
            </Grid></>
        }

        {progress <= 0 && <>
            <Grid item xs={12}>
                <Grid container justifyContent="center">
                    {Array.from({length: 21}, (_, n) => (
                        <Button key={n} className={classes.button} variant="outlined"
                                onClick={() => setValue(n)}>{n}</Button>))}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent={"center"}>
                    <Button onClick={retry} color={"primary"} variant={"outlined"}>Nochmal anzeigen</Button>
                </Grid>
            </Grid>
        </>}

    </>;
};

export default Calculation
