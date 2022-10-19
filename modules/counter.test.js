const counter = require('./counter.js');

const showsIds = [73, 33352, 69, 21845, 60, 100];

test('total number of muvies', () => {
  expect(counter(showsIds)).toBe(showsIds.length);
});
