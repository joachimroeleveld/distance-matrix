import { PassThrough } from 'stream';

import Matrix from './Matrix';
import MatrixReader from './MatrixReader';
import { MatrixFormatError, ParseError } from './errors';

const testCases = [
  {
    description: 'Should not accept non-integers',
    input: [['abc']],
    expectedErr: ParseError,
  },
  {
    description: 'Should error if more than one value in first line',
    input: [[0, 0]],
    expectedErr: MatrixFormatError,
  },
  {
    description: 'Should error if not two values in second line',
    input: [[1], [0]],
    expectedErr: MatrixFormatError,
  },
  {
    description: 'Should error if row has more values than matrix width',
    input: [[1], [1, 1], [1, 1]],
    expectedErr: MatrixFormatError,
  },
  {
    description: 'Should error if test case has more rows than matrix size',
    input: [[2], [1, 1], [1], [1]],
    expectedErr: MatrixFormatError,
  },
  {
    description: 'Should error if empty line before end of test case',
    input: [[1], [1, 1], []],
    expectedErr: MatrixFormatError,
  },
  {
    description: 'Should close reader after last test case',
    input: [[1], [1, 1], [0], [3]],
    expectedRet: [[[0]]],
  },
  {
    description: 'Should produce a valid matrix for a single case',
    input: [[1], [2, 2], [0, 1], [1, 0]],
    expectedRet: [
      [
        [0, 1],
        [1, 0],
      ],
    ],
  },
  {
    description: 'Should produce valid matrices for multiple cases',
    input: [[2], [2, 2], [1, 0], [0, 1], [], [1, 1], [0]],
    expectedRet: [
      [
        [1, 0],
        [0, 1],
      ],
      [[0]],
    ],
  },
];

testCases.forEach((testCase) => {
  const { description, input, expectedErr, expectedRet } = testCase;

  test(description, () => {
    const mockReadable = new PassThrough();
    const reader = new MatrixReader(mockReadable);

    let err;
    const matrices: Matrix[] = [];
    reader.on('error', (e) => {
      err = e;
    });
    reader.on('matrix', (bm) => {
      matrices.push(bm);
    });

    // Feed input to the reader
    input.forEach((input: any) => {
      const line = input.join(' ') + '\n';
      mockReadable.push(line);
    });

    if (expectedErr) {
      expect(err).toBeInstanceOf(expectedErr);
      return;
    }

    expect(err).toBeUndefined();
    if (expectedRet) {
      expect(matrices.length).toEqual(expectedRet.length);
      // Check whether the emitted matrices' values equal the expected return
      // values
      expectedRet.map((values, i) => {
        expect(matrices[i].getValues()).toEqual(
          Matrix.from2DArray(values).getValues()
        );
      });
    }
  });
});
