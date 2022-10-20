/**
 * @jest-environment jsdom
 */

import counter from './counter.js';

const container1 = document.createElement('div');
for (let i = 0; i < 5; i += 1) {
  const container = document.createElement('div');
  container1.append(container);
}
const container2 = document.createElement('div');
for (let i = 0; i < 13; i += 1) {
    const container = document.createElement('div');
    container2.append(container);
}
const container3 = document.createElement('div');

test('total number of movies', () => {
  expect(counter(container1)).toBe(5);
  expect(counter(container2)).toBe(13);
  expect(counter(container3)).toBe(0);
});
