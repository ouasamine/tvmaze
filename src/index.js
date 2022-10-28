import './style.css';
import { fetchShow } from '../modules/api-fetches.js';
import createShowCard from '../modules/show-card.js';

async function getShows(showsIds) {
  const fetches = [];
  showsIds.forEach((showId) => {
    fetches.push(fetchShow('shows', showId));
  });
  const shows = await Promise.all(fetches).then((res) => res);
  return shows;
}

async function getAllShows() {
  const scriptShowsIds = [60, 33352, 69, 21845, 73, 100, 26856, 52];
  const animeShowsIds = [1536, 1505, 83, 216, 84, 52351, 290, 2540];
  const docShowsIds = [25067, 1837, 43567, 1381, 3291, 40919, 1128];
  const scriptShows = await getShows(scriptShowsIds).then((res) => res);
  const animeShows = await getShows(animeShowsIds).then((res) => res);
  const docShows = await getShows(docShowsIds).then((res) => res);

  return [scriptShows, animeShows, docShows];
}

async function display() {
  const container = document.querySelector('#shows-preview');

  getAllShows().then((categories) => {
    categories[0].forEach((show) => {
      createShowCard(container, show, show.id);
    });
  });

  window.addEventListener('hashchange', () => {
    switch (window.location.hash) {
      case '#scripted':
        container.innerHTML = '';
        getAllShows().then((categories) => {
          categories[0].forEach((show) => {
            createShowCard(container, show, show.id);
          });
        });
        break;
      case '#animation':
        container.innerHTML = '';
        getAllShows().then((categories) => {
          categories[1].forEach((show) => {
            createShowCard(container, show, show.id);
          });
        });
        break;
      case '#documentary':
        container.innerHTML = '';
        getAllShows().then((categories) => {
          categories[2].forEach((show) => {
            createShowCard(container, show, show.id);
          });
        });
        break;
      default:
        container.innerHTML = '';
        getAllShows().then((categories) => {
          categories[0].forEach((show) => {
            createShowCard(container, show, show.id);
          });
        });
    }
  });
  const counter = (moviesContainer) => {
    let counter = 0;
    const movies = moviesContainer.querySelectorAll('.movie-holder');
    movies.forEach(() => {
      counter += 1;
    });
    return counter;
  };

  const allmovies = document.querySelector('#shows-preview');
  setTimeout(() => {
    const moviecounter = counter(allmovies);
    const displacounter = document.querySelector('.counter');
    displacounter.innerHTML = `<a href="#scripted">Scripted(${moviecounter})</a>`;
  }, 1000);
}

display();
