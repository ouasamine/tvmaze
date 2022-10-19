import createCommentsPopup from './comments-popup.js';

// export default async function
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
  const endpoint = 'apps/K2yfbgIQf26WocoYCIC5/likes/';
  fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/${endpoint}`)
    .then((resp) => resp.json()).then(res => {  
      if (res.filter((item) => item.item_id === showId).pop()) {
        const { likes } = res.filter((item) => item.item_id === showId).pop();
        console.log(likes);
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
    const endpoint = 'apps/K2yfbgIQf26WocoYCIC5/likes/';
    fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ item_id: showId }) })
      .then((response) => response).then(res => { console.log(res); });
      window.location.reload();
  });
}

export default createShowCard;