import Matrix from './Matrix';
import Bitmap, { BitmapColor } from './Bitmap';
import { Coordinate, TwoDimensionalArray } from './types';

/**
 * Get distance matrix for bitmap. Every value in the matrix specifies its
 * distance from itself to the nearest white (1).
 *
 * Queues all white coordinates and check neighbours iteratively for their
 * distance to white relative to the current coordinate. All neighbors with an
 * out of date value are added to the queue.
 */
export default function getDistanceMatrix(bitmap: Bitmap): Matrix {
  // 2d array with same dimensions as bitmap used to store distance values for
  // each coordinate
  const distances: TwoDimensionalArray<number> = Array.from(
    { length: bitmap.rows },
    () => new Array(bitmap.cols)
  );
  // LIFO queue holding the coordinates that are to be processed
  const queue: Coordinate[] = [];

  // Getter/setter helpers for 2d array
  const setDistance = ([x, y]: Coordinate, dist: number) =>
    (distances[y][x] = dist);
  const getDistance = ([x, y]: Coordinate) => distances[y][x];

  // Loop over coordinates and add all white coordinates to the queue.
  // Initialize distance to zero for whites and infinity for non-white
  // coordinates.
  const coords = bitmap.makeCoordIterator();
  let curCoord = coords.next();
  while (!curCoord.done) {
    const isWhite = bitmap.getValue(curCoord.value) === BitmapColor.White;
    if (isWhite) {
      queue.push(curCoord.value);
    }
    setDistance(curCoord.value, isWhite ? 0 : Infinity)
    curCoord = coords.next();
  }

  // No white coordinates; return infinity matrix
  if (!queue.length) {
    return Matrix.uniform(bitmap.rows, bitmap.cols, Infinity);
  }
  // All white coordinates; return zero matrix
  if (queue.length === bitmap.size) {
    return Matrix.uniform(bitmap.rows, bitmap.cols, 0);
  }

  // Loop over queue
  while (queue.length) {
    const coord = queue.pop();
    // Get distance for current coordinate
    let curDistance;
    if (coord) {
      curDistance = getDistance(coord);
    }
    const neighbours = bitmap.makeNeighbourIterator(<[number, number]>coord);
    let neighbourCoord = neighbours.next();
    // Loop over neighbours
    while (!neighbourCoord.done) {
      const neighbourDistance = getDistance(neighbourCoord.value);
      if (curDistance !== undefined && neighbourDistance > curDistance + 1) {
        // Update distance for neighbour if its known distance is greater than
        // measured from current coordinate
        setDistance(neighbourCoord.value, curDistance + 1);
        // Add neighbour to queue for further to check for updated neighbors
        queue.push(neighbourCoord.value);
      }
      neighbourCoord = neighbours.next();
    }
  }

  // Create matrix from computed distances
  return Matrix.from2DArray(distances);
}
