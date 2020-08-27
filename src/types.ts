import Matrix from './Matrix';

export type MatrixCreator<T extends Matrix = Matrix> = (
  rows: number,
  columns: number,
  values: number[]
) => T;

export type Coordinate = [number, number];

export type TwoDimensionalArray<T> = T[][];
