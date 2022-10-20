/**
 * @jest-environment jsdom
 */

import commentsCounter from './comments-counter.js';

const container1 = document.createElement('div');
const container2 = document.createElement('div');
const container3 = document.createElement('div');
for (let i = 0; i < 5; i += 1) {
  const span = document.createElement('span');
  container1.append(span);
}

for (let i = 0; i < 10; i += 1git ) {
  const span = document.createElement('span');
  container3.append(span);
}
test('Comments counter', () => {
  expect(commentsCounter(container1)).toBe(5);
  expect(commentsCounter(container2)).toBe(0);
  expect(commentsCounter(container3)).toBe(10);
});