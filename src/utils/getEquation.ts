import {Equation, Operation} from "../types/types";

const getDistribution = (difficulty: number, value: number) => {
    let row1 = 0;
    let row2 = 0;
    if (difficulty <= 4) {
        row1 = Math.min(10, value)
        row2 = value - row1
    } else if (difficulty === 5) {
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
    if (difficulty === 1) return [row1]
    return [row1, row2];
};

let idCount = 0

const getEquation = (difficulty: number, op: Operation): Equation => {
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
    const showB = difficulty >= 3
    if (difficulty < 3) {
        add = true
    }
    let a, b = 0;
    if (add) {
        a = Math.round(Math.random() * 18 + 1)
        switch (difficulty) {
            case 0:
                a = Math.round(Math.random() * 20)
                break;
            case 1: // auf 10 auffüllen
                a = Math.round(Math.random() * 10)
                b = 10 - 2 * a
                break;
            case 2:
                a = Math.round(Math.random() * 20)
                b = 20 - 2 * a
                break;
            case 3:
                b = 5 - a % 5
                if (b === 0) {
                    a--
                    b++
                }
                break;
            default:
                b = Math.round(Math.random() * (19 - a) + 1)
                break;
        }
    } else {
        a = Math.round(Math.random() * 19 + 1)
        if (difficulty === 3) {
            b = a % 5
        } else {
            b = Math.round(Math.random() * a)
        }
    }
    return {
        a,
        b,
        add,
        showB,
        waitingTime: difficulty < 3 ? 1000 : difficulty === 3 ? 2000 : 5000,
        aDistribution: getDistribution(difficulty, a),
        bDistribution: getDistribution(difficulty, b),
        id: idCount++
    };
}

export default getEquation;
