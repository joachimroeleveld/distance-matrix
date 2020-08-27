import MatrixReader from './MatrixReader';
import getDistanceMatrix from './getDistanceMatrix';
import Bitmap from './Bitmap';
import { MatrixCreator } from './types';

// Formatting helpers
const printBright = (str: string) => console.log(`\x1b[1m${str}\x1b[0m`);
const printRed = (str: string) => console.log(`\x1b[31m${str}\x1b[0m`);

// Bitmap creator used by reader to instantiate bitmap with processed values
const bitmapCreator: MatrixCreator<Bitmap> =
  (...args) => new Bitmap(...args)

// Pipe standard input to the bitmap reader
const reader = new MatrixReader(
  process.stdin,
  bitmapCreator
);

// Print a distance matrix for every incoming valid bitmap
reader.on('matrix', (bitmap) => {
  const distanceToLandMatrix = getDistanceMatrix(bitmap);
  printBright('\nDistance matrix:');
  console.log(distanceToLandMatrix.toString(), '\n');
});

// Show errors
reader.on('error', (e) => {
  printRed(e.message);
});

// Prompt
printBright('\nEnter test cases:');
