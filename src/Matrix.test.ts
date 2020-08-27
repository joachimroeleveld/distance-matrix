import Matrix from './Matrix';
import { InvalidArgumentError } from './errors';
import { Coordinate } from './types';

describe('constructor()', () => {
  test('Error if rows < 1', () => {
    let err;
    try {
      new Matrix(0, 1, []);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(InvalidArgumentError);
  });

  test('Error if columns < 1', () => {
    let err;
    try {
      new Matrix(1, 0, []);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(InvalidArgumentError);
  });

  test('Error if number of values is not width*height', () => {
    let err;
    try {
      new Matrix(1, 2, [1]);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(InvalidArgumentError);
  });

  test('Should create a valid matrix', () => {
    let err;
    let bm;
    try {
      bm = new Matrix(2, 2, [0, 1, 1, 0]);
    } catch (e) {
      err = e;
    }
    expect(err).toBeUndefined();
    expect(bm).toBeDefined();
    if (bm) {
      expect(bm.getValues()).toEqual([0, 1, 1, 0]);
    }
  });
});

describe('from2DArray()', () => {
  test('Happy path', () => {
    const bm = Matrix.from2DArray([
      [0, 1],
      [2, 3],
    ]);
    expect(bm.getValues()).toEqual([0, 1, 2, 3]);
  });

  test('Should error if given columns of non equal width', () => {
    let err;
    try {
      Matrix.from2DArray([[0, 1], [2]]);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(InvalidArgumentError);
  });
});

describe('uniform()', () => {
  test('Should return a uniform matrix', () => {
    const bm = Matrix.uniform(2, 2, 33);
    expect(bm.getValues()).toEqual([33, 33, 33, 33]);
  });
});

describe('getValue()', () => {
  test('Should error if invalid negative coordinate', () => {
    const bm = Matrix.from2DArray([[0]]);
    let err;
    try {
      bm.getValue([-1, -1]);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(InvalidArgumentError);
  });

  test('Should error if coordinate is out of bounds', () => {
    const bm = Matrix.from2DArray([[0]]);
    let err;
    try {
      bm.getValue([2, 2]);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(InvalidArgumentError);
  });

  test('Should return the value at the specified coordinate', () => {
    const bm = Matrix.from2DArray([
      [33, 4],
      [25, 304],
      [10, 33],
    ]);
    let err, val;
    try {
      val = bm.getValue([1, 1]);
    } catch (e) {
      err = e;
    }
    expect(err).toBeUndefined();
    expect(val).toBe(304);
  });
});

describe('getValues()', () => {
  test('Should return an array with the underlying values of the matrix', () => {
    const bm = Matrix.from2DArray([
      [2, 1],
      [0, 3],
    ]);
    expect(bm.getValues()).toEqual([2, 1, 0, 3]);
  });
});

describe('size getter', () => {
  test('Should return the size of the matrix', () => {
    const bm = Matrix.uniform(10, 20, 1);
    expect(bm.size).toEqual(200);
  });
});

describe('makeCoordIterator()', () => {
  test("Should iterate over all the matrix's coordinates", () => {
    const coords: Coordinate[] = [];
    const bm = Matrix.from2DArray([
      [33, 4],
      [304, 206],
      [10, 33],
    ]);
    const iter = bm.makeCoordIterator();
    let coord = iter.next();
    while (!coord.done) {
      coords.push(coord.value);
      coord = iter.next();
    }
    expect(coords).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
      [1, 2],
    ]);
  });
});

describe('makeNeighbourCoordIterator()', () => {
  test("Should iterate over all the coordinate's valid neighbours", () => {
    const coords: Coordinate[] = [];
    const bm = Matrix.from2DArray([
      [33, 4],
      [304, 206],
      [10, 33],
    ]);
    const iter = bm.makeNeighbourIterator([0, 1]);
    let coord = iter.next();
    while (!coord.done) {
      coords.push(coord.value);
      coord = iter.next();
    }
    expect(coords).toEqual([
      [0, 0],
      [1, 1],
      [0, 2],
    ]);
  });
});

describe('toString()', () => {
  test('Return a rectangular padded string representation of the matrix', () => {
    const bm = Matrix.from2DArray([
      [33, 4],
      [304, 206],
      [10, 33],
    ]);
    expect(bm.toString()).toEqual(`33  4  \n304 206\n10  33 `);
  });
});
