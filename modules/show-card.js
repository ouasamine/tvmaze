import createCommentsPopup from './comments-popup.js';
import { fetchGetInv, fetchPostInv } from './api-fetches.js';

const createShowCard = async (container, show, showId) => {
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

  fetchGetInv('/likes').then((res) => {
    if (res.filter((item) => item.item_id === showId).pop()) {
      const { likes } = res.filter((item) => item.item_id === showId).pop();
      likesCount.innerText = `${likes} likes`;
    }
  });
  const likeCont = showCard.querySelector('div.like-button');
  butt.innerText = 'Button';
  likeBtt.innerHTML = '<i class="fa-regular fa-heart"></i>';
  showCard.appendChild(butt);
  likeCont.appendChild(likeBtt);
  likeCont.appendChild(likesCount);
  container.appendChild(showCard);

  butt.addEventListener('click', () => {
    createCommentsPopup(show, showId);
  });

  likeBtt.addEventListener('click', () => {
    fetchPostInv('/likes', { item_id: showId });
  });
};

export default createShowCard;