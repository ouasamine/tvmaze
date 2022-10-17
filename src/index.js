import fetchShow from '../modules/shows-fetch.js';
import './style.css';

const container = document.querySelector('#shows-preview');
const showsIds = [153021, 367506, 266189, 328634, 72108];
showsIds.forEach((show) => {
  fetchShow(show).then((res) => {
    container.innerHTML += `<img src="${res.image.medium}">`;
  });
});