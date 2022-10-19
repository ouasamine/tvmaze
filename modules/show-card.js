import createCommentsPopup from './comments-popup.js';
import { fetchGetInv, fetchPostInv } from './api-fetches.js';

const createShowCard = async (container, show, showId) => {
  let likes = 0;
  await fetchGetInv('/likes').then((res) => {
    if (res.filter((item) => item.item_id === showId).pop()) {
      likes = res.filter((item) => item.item_id === showId).pop().likes;
    }
  });

  const showCard = document.createElement('div');
  const butt = document.createElement('button');
  const likeBtt = document.createElement('button');
  const likesCount = document.createElement('p');

  showCard.classList.add('movie-holder');
  butt.classList.add('comments-butt');
  likeBtt.classList.add('like-button');

  showCard.innerHTML += `
    <img src="${show.image.medium}">
    <section class='section-underImage'>
      <p class="show-title">${show.name}</p>
      <div class="like-button">
      </div>
    </section>`;

  const likeCont = showCard.querySelector('div.like-button');
  likesCount.innerText = `${likes} likes`;
  butt.innerText = 'Button';
  likeBtt.innerHTML = '<i class="fa-regular fa-heart"></i>';
  showCard.appendChild(butt);
  likeCont.appendChild(likeBtt);
  likeCont.appendChild(likesCount);
  container.appendChild(showCard);

  butt.addEventListener('click', () => {
    document.body.style.overflowY = 'hidden';
    createCommentsPopup(show, showId);
  });

  likeBtt.addEventListener('click', () => {
    fetchPostInv('/likes', { item_id: showId });
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
  const moviecounter = counter(allmovies);

  const displacounter = document.querySelector('.counter');

  displacounter.innerHTML = `<a href="#scripted">Scripted(${moviecounter})</a>`;
};

export default createShowCard;