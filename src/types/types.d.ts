export type Equation = {
    a: number;
    b: number;
    add: boolean;
    waitingTime: number;
    aDistribution: number[];
    bDistribution: number[];
    id: number
}

export type Difficulty = 'FILL_FIRST' | 'FILL_EQUAL' | 'FILL_RANDOM';
export type Operation = 'PLUS' | 'MINUS' | 'BOTH';
