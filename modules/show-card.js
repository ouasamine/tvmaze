import createCommentsPopup from './comments-popup.js';
import { fetchPostInv } from './api-fetches.js';

const createShowCard = async (container, show, showLikes) => {
  const showCard = document.createElement('div');
  const butt = document.createElement('button');
  const likeBtt = document.createElement('button');
  const likes = document.createElement('p');
  const likesCount = document.createElement('span');
  const text = document.createTextNode(' likes');

  showCard.classList.add('movie-holder');
  likeBtt.classList.add('like-button');
  butt.classList.add('comments-butt');

  likeBtt.innerHTML = '<i class="fa-regular fa-heart"></i>';
  showCard.innerHTML += `
    <img src="${show.image.medium}">
    <section class='section-underImage'>
      <p class="show-title">${show.name}</p>
      <div class="likes-container">
      </div>
    </section>`;
  butt.innerText = 'Comment';
  likesCount.innerText = showLikes;

  const likesContainer = showCard.querySelector('div.likes-container');
  likes.append(likesCount, text);
  likesContainer.append(likeBtt, likes);
  showCard.appendChild(butt);
  container.appendChild(showCard);

  butt.addEventListener('click', () => {
    document.body.style.overflowY = 'hidden';
    createCommentsPopup(show, show.id);
  });

  if (window.localStorage.getItem(show.id)) {
    likeBtt.firstChild.classList.replace('fa-regular', 'fa-solid');
    likeBtt.firstChild.style.color = 'red';
  } else {
    likeBtt.addEventListener('click', () => {
      likesCount.innerText = parseInt(likesCount.innerText, 10) + 1;
      likeBtt.firstChild.classList.replace('fa-regular', 'fa-solid');
      likeBtt.firstChild.style.color = 'red';
      fetchPostInv('/likes', { item_id: show.id });
      window.localStorage.setItem(show.id, 'like');
    });
  }
};

export default createShowCard;