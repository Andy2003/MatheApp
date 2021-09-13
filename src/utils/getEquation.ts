import {Difficulty, Equation, Operation} from "../types/types";

const getDistribution = (difficulty: Difficulty, value: number) => {
    let row1 = 0;
    let row2 = 0;
    if (difficulty === "FILL_FIRST") {
        row1 = Math.min(10, value)
        row2 = value - row1
    } else if (difficulty === "FILL_EQUAL") {
        row1 = Math.round(value / 2)
        row2 = value - row1
    } else {
        for (let i = 0; i < value; i++) {
            if (row1 === 10) {
                row2++
            } else if (row2 === 10) {
                row1++
            } else if (Math.random() <= 0.3) {
                row1++
            } else {
                row2++
            }
        }
    }
    return [row1, row2];
};

let idCount = 0

const getEquation = (difficulty: Difficulty, op: Operation): Equation => {
    let add;
    switch (op) {
        case "PLUS":
            add = true
            break;
        case "MINUS":
            add = false
            break;
        case "BOTH":
            add = Math.random() > 0.5
            break;

    }
    let a, b;
    if (add) {
        a = Math.round(Math.random() * 18 + 1)
        b = Math.round(Math.random() * (19 - a) + 1)
    } else {
        a = Math.round(Math.random() * 19 + 1)
        b = Math.round(Math.random() * a)
    }
    return {
        a,
        b,
        add,
        waitingTime: 5000,
        aDistribution: getDistribution(difficulty, a),
        bDistribution: getDistribution(difficulty, b),
        id: idCount++
    };
}

export default getEquation;
