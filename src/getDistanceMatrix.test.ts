import getDistanceMatrix from './getDistanceMatrix';
import Matrix from './Matrix';

const testCases = [
  {
    description: 'Should output a zero matrix with only whites',
    input: [
      [1, 1],
      [1, 1],
    ],
    expectedOutput: [
      [0, 0],
      [0, 0],
    ],
  },
  {
    description: 'Should output a infinity matrix with only blacks',
    input: [
      [0, 0],
      [0, 0],
    ],
    expectedOutput: [
      [Infinity, Infinity],
      [Infinity, Infinity],
    ],
  },
  {
    description:
      'Should output correct distances with a random input of white and black',
    input: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    expectedOutput: [
      [2, 1, 2, 2, 3, 4, 3, 3, 2, 1],
      [1, 0, 1, 1, 2, 3, 2, 2, 1, 0],
      [2, 1, 1, 0, 1, 2, 1, 2, 2, 1],
      [2, 2, 2, 1, 2, 1, 0, 1, 2, 2],
      [1, 2, 3, 2, 3, 2, 1, 0, 1, 2],
      [0, 1, 2, 3, 2, 1, 0, 1, 2, 1],
      [1, 2, 1, 2, 3, 2, 1, 2, 1, 0],
      [2, 1, 0, 1, 2, 3, 2, 3, 2, 1],
      [3, 2, 1, 0, 1, 2, 3, 4, 3, 2],
      [4, 3, 2, 1, 2, 3, 4, 5, 4, 3],
    ],
  },
];

testCases.forEach((testCase) => {
  const { input, expectedOutput, description } = testCase;
  const inputMatrix = Matrix.from2DArray(input);
  test(description, () => {
    const outputMatrix = Matrix.from2DArray(expectedOutput);
    const distanceToLandMatrix = getDistanceMatrix(inputMatrix);
    // Check if distance to land matrix's values correspond to the expected
    // output matrix's values
    expect(distanceToLandMatrix.getValues()).toEqual(outputMatrix.getValues());
  });
});
