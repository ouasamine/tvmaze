import createCommentsPopup from './comments-popup.js';

export default function createShowCard(container, show, showId) {
  const showCard = document.createElement('div');
  const butt = document.createElement('button');
  const likeBtt = document.createElement('button');
  showCard.classList.add('movie-holder');
  butt.classList.add('comments-butt');
  likeBtt.classList.add('like-button');
  showCard.innerHTML += `
    <img src="${show.image.medium}">
    <section class='section-underImage'>
      <p class="show-title">${show.name}</p>
      <div class="like-button">
        <p>2 likes</p>
      </div>
    </section>`;
  const likeCont = showCard.querySelector('div.like-button');
  butt.innerText = 'Button';
  likeBtt.innerHTML = '<i class="fa-regular fa-heart"></i>';
  showCard.appendChild(butt);
  likeCont.insertBefore(likeBtt, likeCont.firstChild);
  container.appendChild(showCard);
  butt.addEventListener('click', () => {
    createCommentsPopup(show, showId);
  });
}
