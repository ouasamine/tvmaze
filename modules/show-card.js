import createCommentsPopup from './comments-popup.js';
import { fetchGetInv, fetchPostInv } from './api-fetches.js';

async function showLikes(likesCount, showId) {
  likesCount.innerText = '';
  let likes = 0;
  await fetchGetInv('/likes').then((res) => {
    if (res.filter((item) => item.item_id === showId).pop()) {
      likes = res.filter((item) => item.item_id === showId).pop().likes;
    }
  });

  likesCount.innerText = `${likes}`;
}

const createShowCard = async (container, show, showId) => {
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
  showLikes(likesCount, showId).then(() => {
    likeBtt.addEventListener('click', () => {
      fetchPostInv('/likes', { item_id: showId }).then(() => {
        showLikes(likesCount, showId);
      });
    });
  });
  const likesContainer = showCard.querySelector('div.likes-container');

  likes.append(likesCount, text);
  likesContainer.append(likeBtt, likes);
  showCard.appendChild(butt);
  container.appendChild(showCard);

  butt.addEventListener('click', () => {
    document.body.style.overflowY = 'hidden';
    createCommentsPopup(show, showId);
  });
};

export default createShowCard;