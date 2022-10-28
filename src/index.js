import './style.css';
import { fetchGetInv, fetchShow } from '../modules/api-fetches.js';
import createShowCard from '../modules/show-card.js';

const scriptShowsIds = [60, 33352, 69, 21845, 73, 100, 26856, 52];
const animeShowsIds = [1536, 1505, 83, 216, 84, 52351, 290, 2540];
const docShowsIds = [25067, 1837, 43567, 1381, 3291, 40919, 1128];

async function getShows(showsIds) {
  const fetches = [];
  showsIds.forEach((showId) => {
    fetches.push(fetchShow('shows', showId));
  });
  const shows = await Promise.all(fetches).then((res) => res);
  return shows;
}

async function getAllShows() {
  const scriptShows = await getShows(scriptShowsIds).then((res) => res);
  const animeShows = await getShows(animeShowsIds).then((res) => res);
  const docShows = await getShows(docShowsIds).then((res) => res);

  return [scriptShows, animeShows, docShows];
}

function getLikes(likes, showId) {
  const show = likes.filter((item) => item.item_id === showId).pop();
  if (show) {
    return show.likes;
  }
  return 0;
}

function displayByHash(container, likes) {
  switch (window.location.hash) {
    case '#scripted':
      container.innerHTML = '';
      getAllShows().then((categories) => {
        categories[0].forEach((show) => {
          createShowCard(container, show, getLikes(likes, show.id));
        });
      });
      break;
    case '#animation':
      container.innerHTML = '';
      getAllShows().then((categories) => {
        categories[1].forEach((show) => {
          createShowCard(container, show, getLikes(likes, show.id));
        });
      });
      break;
    case '#documentary':
      container.innerHTML = '';
      getAllShows().then((categories) => {
        categories[2].forEach((show) => {
          createShowCard(container, show, getLikes(likes, show.id));
        });
      });
      break;
    default:
      container.innerHTML = '';
      getAllShows().then((categories) => {
        categories[0].forEach((show) => {
          createShowCard(container, show, getLikes(likes, show.id));
        });
      });
  }
}

async function display() {
  const container = document.querySelector('#shows-preview');
  const likes = await fetchGetInv('/likes').then((res) => res);

  displayByHash(container, likes);
  window.addEventListener('hashchange', () => {
    displayByHash(container, likes);
  });

  const counter = (shows) => {
    let counter = 0;
    shows.forEach(() => {
      counter += 1;
    });
    return counter;
  };
  const navLinksContainer = document.querySelector('.navlinks');
  navLinksContainer.innerHTML += `
    <li><a href="#scripted">Scripted(${counter(scriptShowsIds)})</a></li>
    <li><a href="#animation">Animation(${counter(animeShowsIds)})</a></li>
    <li><a href="#documentary">Documentary(${counter(docShowsIds)})</a></li>
  `;
}

display();
