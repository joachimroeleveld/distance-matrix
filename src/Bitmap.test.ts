import { InvalidArgumentError } from './errors';
import Bitmap from './Bitmap';

test('Should error if values contain invalid color', () => {
  let err;
  try {
    new Bitmap(1, 1, [3]);
  } catch (e) {
    err = e;
  }
  expect(err).toBeInstanceOf(InvalidArgumentError);
});
