import { InvalidArgumentError } from './errors';
import Matrix from './Matrix';

/**
 * Enum defining possible values for a Bitmap.
 */
export enum BitmapColor {
  Black = 0,
  White = 1,
}

/**
 * Bitmap class that inherits from Matrix.
 *
 * Validates values to be a valid BitmapColor.
 */
export default class Bitmap extends Matrix<BitmapColor> {
  constructor(cols: number, rows: number, values: BitmapColor[]) {
    super(cols, rows, values);
    // Check if every value is a BitmapColor
    const invalidVal = values.find(
      (val) => !Object.values(BitmapColor).includes(val)
    );
    if (invalidVal) {
      throw new InvalidArgumentError(
        `'${invalidVal}' is not a valid bitmap color`
      );
    }
  }
}
