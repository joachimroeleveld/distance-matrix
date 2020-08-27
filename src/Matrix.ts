import { InvalidArgumentError } from './errors';
import { Coordinate, TwoDimensionalArray } from './types';

/**
 * Matrix class with values of type T. Only numeric values are accepted.
 *
 * Defaults to an any-number matrix.
 */
export default class Matrix<T = number> {
  /**
   * Matrix height
   */
  readonly rows: number;
  /**
   * Matrix width
   */
  readonly cols: number;
  /**
   * Matrix values, represented as a flat array
   */
  private readonly values: T[] = [];

  /**
   * Create Matrix instance from 2d array.
   */
  static from2DArray<T>(arr: TwoDimensionalArray<T>): Matrix<T> {
    const rows = arr.length;
    const cols = arr[0].length;
    // Flatten array
    const values = arr.reduce((acc: T[], arr: T[]) => {
      if (arr.length !== cols) {
        throw new InvalidArgumentError('Cols should be equal width');
      }
      return acc.concat(arr);
    }, []);
    return new Matrix<T>(rows, cols, values);
  }

  /**
   * Create uniform matrix (matrix with the same value for every coordinate).
   */
  static uniform<T>(rows: number, cols: number, value: T): Matrix<T> {
    return new Matrix(rows, cols, new Array(rows * cols).fill(value));
  }

  /**
   * Construct Matrix.
   */
  constructor(rows: number, cols: number, values: T[]) {
    if (rows < 1) {
      throw new InvalidArgumentError('Number of rows should be > 1');
    }
    if (cols < 1) {
      throw new InvalidArgumentError('Number of columns should be > 1');
    }
    if (values.length !== rows * cols) {
      throw new InvalidArgumentError(
        `Number of values should be ${rows * cols}`
      );
    }
    this.rows = rows;
    this.cols = cols;
    this.values = values;
  }

  /**
   * Getter that returns matrix size.
   */
  get size(): number {
    return this.cols * this.rows;
  }

  /**
   * Get value at coordinate (x, y).
   */
  getValue(coord: Coordinate): T {
    const [x, y] = coord;
    if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) {
      throw new InvalidArgumentError('Invalid coordinate');
    }
    const offset = y * this.cols + x;
    return this.values[offset];
  }

  /**
   * Get a flat array with matrix values.
   */
  getValues(): T[] {
    return this.values;
  }

  /**
   * Make iterator that iterators over matrix coordinates.
   */
  makeCoordIterator(): Iterator<Coordinate> {
    let nextIndex = 0;
    return {
      next: (): IteratorResult<Coordinate> => {
        let result;
        if (nextIndex < this.values.length) {
          const y = Math.floor(nextIndex / this.cols);
          const x = nextIndex % this.cols;
          const coord: Coordinate = [x, y];
          result = { value: coord, done: false };
          nextIndex++;
          return result;
        }
        return { value: this.values.length, done: true };
      },
    };
  }

  /**
   * Make iterator that iterates over the given coordinate's neighbour
   * coordinates.
   */
  makeNeighbourIterator(coord: Coordinate): Iterator<Coordinate> {
    const directions = [
      [0, -1], // Above
      [1, 0], // Right
      [0, 1], // Below
      [-1, 0], // Left
    ];
    const neighbourCoords: Coordinate[] = directions
      // Map offset to coord
      .map((offset): Coordinate => [coord[0] + offset[0], coord[1] + offset[1]])
      // Filter invalid coords
      .filter(([x, y]) => {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
      });
    let nextIndex = 0;
    return {
      next: (): IteratorResult<Coordinate> => {
        let result;
        if (nextIndex < neighbourCoords.length) {
          result = { value: neighbourCoords[nextIndex], done: false };
          nextIndex++;
          return result;
        }
        return { value: neighbourCoords.length, done: true };
      },
    };
  }

  /**
   * Get a string representation of the matrix's values formatted as a rectangle
   * with equal width columns.
   */
  toString(): string {
    // Create strings for every row
    const rowStrings: string[] = Array.from({ length: this.rows }, () => '');
    const rowNumbers = Array.from({ length: this.rows }, (_, i) => i);
    // Loop over columns
    for (let x = 0; x < this.cols; x++) {
      // Get string representation of values for this column
      const columnValues = rowNumbers.map((y) => String(this.getValue([x, y])));
      // Calculate max string width of column
      const maxWidth = Math.max(...columnValues.map((val) => val.length));
      // Append value with space padding
      columnValues.forEach((val, y) => {
        const trailingSpaces =
          maxWidth - val.length + (x === this.cols - 1 ? 0 : 1);
        const str = val + ' '.repeat(trailingSpaces);
        rowStrings[y] += str;
      });
    }
    return rowStrings.join('\n');
  }
}
