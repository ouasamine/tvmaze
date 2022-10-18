import './style.css';
import fetchShow from '../modules/shows-fetch.js';
import createShowCard from '../modules/show-card.js';

const container = document.querySelector('#shows-preview');
const showsIds = [73, 33352, 69, 21845, 60, 100];

showsIds.forEach((showId) => {
  fetchShow('shows', showId).then((show) => {
    createShowCard(container, show, showId);
  });
});
