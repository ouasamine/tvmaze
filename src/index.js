import fetchShow from '../modules/shows-fetch.js';
import './style.css';

const container = document.querySelector('#shows-preview');
const showsIds = [73, 33352, 69, 21845, 60, 100];

function createCommentsPopup(showObj) {
  const popupWindow = document.createElement('div');
  const closeBtt = document.createElement('div');
  closeBtt.classList.add('close-butt');
  popupWindow.id = 'comments-popup';
  closeBtt.innerHTML = '<div></div><div></div>';
  popupWindow.innerHTML = `
      <div class="img-wrapper">
          <img src="${showObj.image.original}">
      </div>
      <h2 class="show-name">${showObj.name}</h2>
      <div class="details">
          <span>Genres  : Drama</span>
          <span>Episodes: 24</span>
          <span>Created by: Jhon Doe</span>
      </div>
  `;
  popupWindow.insertBefore(closeBtt, popupWindow.firstChild);
  closeBtt.addEventListener('click', () => {
    popupWindow.remove();
  });
  document.body.appendChild(popupWindow);
}

showsIds.forEach((show) => {
  fetchShow('shows', show).then((show) => {
    const showCard = document.createElement('div');
    const butt = document.createElement('button');
    showCard.classList.add('movie-holder');
    butt.classList.add('comments-butt');
    showCard.innerHTML += `
    <img src="${show.image.medium}">
    <section class='section-underImage'>
      <p class="show-title">${show.name}</p>
      <div class="like-button">
        <button class="like-button"><i class="fa-regular fa-heart"></i></button>
        <p>2 likes</p>
      </div>
    </section>`;
    butt.innerText = 'Button';
    showCard.appendChild(butt);
    container.appendChild(showCard);
    butt.addEventListener('click', () => {
      createCommentsPopup(show);
    });
  });
});
