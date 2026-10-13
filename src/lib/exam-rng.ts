/**
 * The randomness behind every exam draw: which variant of each concept, the question order and
 * each question's option order. randomInt(n) is uniform over [0, n) and avoids modulo bias
 * (Node.js crypto docs); Math.random makes no such promise and its state can be recovered from
 * its outputs. Server-only: it imports node:crypto.
 */
import { randomInt } from 'node:crypto'

export const secureRandomInt = (n: number) => randomInt(n)
