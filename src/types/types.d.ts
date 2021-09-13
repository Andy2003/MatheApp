export type Equation = {
    a: number;
    b: number;
    showB: boolean;
    add: boolean;
    waitingTime: number;
    aDistribution: number[];
    bDistribution: number[];
    id: number
}

export type Operation = 'PLUS' | 'MINUS' | 'BOTH';
