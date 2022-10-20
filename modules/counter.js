const counter = (moviesContainer) => {
  let counter = 0;
  const movies = moviesContainer.querySelectorAll('div');
  movies.forEach(() => {
    counter += 1;
  });
  return counter;
};

export default counter;