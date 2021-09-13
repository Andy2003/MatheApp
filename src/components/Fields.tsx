import React, {FC, Fragment} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme) => ({
    dot: {
        height: 24,
        width: 24,
        borderRadius: "50%",
        display: "inline-block",
        backgroundColor: theme.palette.action.disabled,
        margin: theme.spacing(0.5),
    },
    left: {
        backgroundColor: '#eee',
    },
    icon: {
        margin: theme.spacing(0.5),
    }
}));

type Props = {
    distribution: number[]
    color: string,
    showQuestionMark: boolean
}
const Fields: FC<Props> = ({distribution, color, showQuestionMark}) => {
    const classes = useStyles();
    return (
        <Grid container spacing={1} style={{width: 336}}>
            {distribution.map((value, row) => {
                return (
                    <Fragment key={row}>
                        <Grid item xs={6}>
                            <Paper className={classes.left}>
                                {Array.from({length: 5}, (_, n) => {
                                    if (showQuestionMark && n >= value) {
                                        return <HelpOutlineIcon color={"action"} className={classes.icon} />
                                    }
                                    return (<div
                                        key={n}
                                        className={classes.dot + ' ' + (n < value ? color : '')} />);
                                })}
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper>
                                {Array.from({length: 5}, (_, n) => {
                                    if (showQuestionMark && n + 5 >= value) {
                                        return <HelpOutlineIcon color={"action"} className={classes.icon} />
                                    }
                                    return (<div
                                        key={n}
                                        className={classes.dot + ' ' + (n + 5 < value ? color : '')} />);
                                })}
                            </Paper>
                        </Grid>
                    </Fragment>
                );
            })}
        </Grid>
    );
};
export default Fields;
