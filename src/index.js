import './style.css';
import { fetchShow } from '../modules/api-fetches.js';
import createShowCard from '../modules/show-card.js';

const container = document.querySelector('#shows-preview');
const showsIds = [73, 33352, 69, 21845, 60, 100];

showsIds.forEach((showId) => {
  fetchShow('shows', showId).then((show) => {
    createShowCard(container, show, showId);
  });
});

const counter = (arr) => {
    let showcounter = 0;
    for (let i = 0; i < arr.length; i ++){
      showcounter ++;
    }
    return showcounter;
}

const moviecounter = counter(showsIds);

const displacounter = document.querySelector('.counter');

displacounter.innerHTML += `<a href="#scripted">Scripted(${moviecounter})</a>`;