import readline, { Interface } from 'readline';
import { Readable } from 'stream';
import { EventEmitter } from 'events';

import { MatrixFormatError, ParseError } from './errors';
import { MatrixCreator } from './types';
import Matrix from './Matrix';

/**
 * Reader class that reads line by line from an input stream and emits a matrix
 * when the target number of rows have been processed.
 */
export default class MatrixReader extends EventEmitter {
  /**
   * Readline interface.
   */
  private readonly rl: Interface;
  /**
   * Matrix creator used to generate matrices from processed values.
   */
  private readonly creator: MatrixCreator;
  /**
   * Number of tests.
   */
  private tests = -1;
  /**
   * Number of rows for current test case.
   */
  private rows = -1;
  /**
   * Number of values per row for current test case.
   */
  private cols = -1;
  /**
   * Current test number.
   */
  private curTest = 1;
  /**
   * Current row number.
   */
  private curRow = 1;
  /**
   * Valid, processed values for current test case.
   */
  private values: number[] = [];

  /**
   * Construct MatrixReader.
   */
  constructor(
    input: Readable,
    creator: MatrixCreator = defaultMatrixCreator,
  ) {
    super();
    this.creator = creator;
    const rl = (this.rl = readline.createInterface({ input }));
    // Subscribe to incoming newlines on the input stream
    rl.on('line', (l: string) => this.processLine(l));
  }

  /**
   * Process a line from the readline interface.
   *
   * Validates every line against the current state and emits a Matrix object
   * when the target number of valid rows have been processed.
   */
  private processLine(line: string): void {
    // Parse line as list of integers
    let parsed;
    try {
      parsed = this.parseLine(line);
    } catch (e) {
      this.emit('error', e);
      return;
    }
    // First line: number of test cases
    if (this.tests === -1) {
      if (parsed.length > 1) {
        this.error(new MatrixFormatError('First input should have one value'));
        return;
      }
      this.tests = parsed[0];
      return;
    }
    // Initialize rows and columns for new test case
    if (this.rows === -1) {
      if (parsed.length !== 2) {
        this.error(
          new MatrixFormatError(
            'Test case should be initialised with two values'
          )
        );
        return;
      }
      this.rows = parsed[0];
      this.cols = parsed[1];
      this.values = [];
      this.curRow = 1;
      return;
    }
    // End of test case (empty line)
    if (parsed.length === 0) {
      if (this.curRow - 1 !== this.rows) {
        this.error(new MatrixFormatError('Misplaced empty line'));
        return;
      }
      this.rows = -1; // Flag new case is expected
      return;
    }
    // More cases than expected
    if (this.curTest > this.tests) {
      this.error(
        new MatrixFormatError(`Input exceeding ${this.tests} test cases`)
      );
      return;
    }
    // More rows than expected
    if (this.curRow > this.rows) {
      this.error(
        new MatrixFormatError(`Invalid test case: expecting ${this.rows} rows`)
      );
      return;
    }
    // Row with invalid length
    if (parsed.length !== this.cols) {
      this.error(
        new MatrixFormatError(
          `Invalid test case: expecting ${this.cols} values per row`
        )
      );
      return;
    }
    // Input is valid; add processed row values
    this.values.push(...parsed);
    // If reached target number of valid rows
    if (this.curRow === this.rows) {
      let matrix: Matrix;
      try {
        matrix = this.creator(this.rows, this.cols, this.values);
      } catch (e) {
        // Bubble up matrix creation errors
        this.error(e);
        this.values = [];
        this.curRow = 0;
        return;
      }
      // Emit matrix
      this.emit('matrix', matrix);
      // Close reader if last test was processed
      if (this.curTest === this.tests) {
        this.rl.close();
        return;
      }
      this.curTest++;
    }
    this.curRow++;
  }

  /**
   * Parse a string with space-delimited values to integers.
   *
   * Throws if a value is not numeric.
   */
  private parseLine(l: string): number[] {
    return l
      .split(' ')
      .filter((c) => c !== '')
      .map((c) => {
        if (!c.match(/\d+/)) {
          throw new ParseError(`Character ${c} is not an integer`);
        }
        return parseInt(c);
      });
  }

  /**
   * Error helper that emits error event.
   */
  private error = (e: Error) => this.emit('error', e);
}

/**
 * Default matrix creator that generates an object of base type Matrix.
 */
const defaultMatrixCreator: MatrixCreator = (
  rows: number,
  cols: number,
  values: number[]
) => {
  return new Matrix(rows, cols, values);
}
