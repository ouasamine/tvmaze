import createCommentsPopup from './comments-popup.js';

export default function createShowCard(container, show) {
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
}