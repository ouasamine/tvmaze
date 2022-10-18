import fetchShow from '../modules/shows-fetch.js';
import './style.css';

const container = document.querySelector('#shows-preview');
const showsIds = [153021, 367506, 266189, 328634, 72108];
showsIds.forEach((show) => {
  fetchShow(show).then((res) => {
    container.innerHTML += `<div class="movie-holder">
    <img src="${res.image.medium}">
    <section class='section-underImage'>
      <p>${res.name}</p>
      <div class="like-button">
        <button class="like-button"><i class="fa-regular fa-heart"></i></button>
        <p>2 likes</p>
      </div>
    </section>
    <button>Comment</button></div>`;
  });
});