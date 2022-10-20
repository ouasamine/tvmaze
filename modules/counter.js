const counter = (moviesContainer) => {
  let counter = 0;
  const movies = moviesContainer.querySelectorAll('#shows-preview');
  movies.forEach(() => {
    counter += 1;
  });
  return counter;
};
module.exports = counter;