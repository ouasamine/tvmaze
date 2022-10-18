import fetchShow from './shows-fetch.js';

/* eslint-disable no-underscore-dangle */
export default async function createCommentsPopup(showObj, showId) {
  const creators = [];
  await fetchShow('shows', showId, 'crew').then((show) => {
    show._embedded.crew
      .filter((crewMember) => crewMember.type === 'Creator' || crewMember.type === 'Developer')
      .forEach((creator) => {
        creators.push(creator.person.name);
      });
  });
  
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
          <span>Genres  : ${showObj.genres.toString().replace(/,/g, ' | ')}</span>
          <span>Episodes: 24</span>
          <span>Created by: ${creators.toString().replace(/,/g, ' | ')}</span>
      </div>
  `;
  popupWindow.insertBefore(closeBtt, popupWindow.firstChild);
  closeBtt.addEventListener('click', () => {
    popupWindow.remove();
  });
  document.body.appendChild(popupWindow);
}