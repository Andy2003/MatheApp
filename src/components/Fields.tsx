import React, {FC, Fragment} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    dot: {
        height: 24,
        width: 24,
        borderRadius: "50%",
        display: "inline-block",
        backgroundColor: theme.palette.action.disabled,
        margin: theme.spacing(0.5)
    },
    left: {
        backgroundColor: '#eee',
    }
}));

type Props = {
    distribution: number[]
    color: string,
}
const Fields: FC<Props> = ({distribution, color}) => {
    const classes = useStyles();
    return (
        <Grid container spacing={1} style={{width: 336}}>
            {distribution.map((value, row) => {
                return (
                    <Fragment key={row}>
                        <Grid item xs={6}>
                            <Paper className={classes.left}>
                                {Array.from({length: 5}, (_, n) => (<div
                                    key={n}
                                    className={classes.dot + ' ' + (n < value ? color : '')} />))}
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper>
                                {Array.from({length: 5}, (_, n) => (<div
                                    key={n}
                                    className={classes.dot + ' ' + (n + 5 < value ? color : '')} />))}
                            </Paper>
                        </Grid>
                    </Fragment>
                );
            })}
        </Grid>
    );
};
export default Fields;
