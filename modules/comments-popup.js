/* eslint-disable no-underscore-dangle */
import { fetchGetInv, fetchPostInv, fetchShow } from './api-fetches.js';

export default async function createCommentsPopup(showObj, showId) {
  const creators = [];
  let seasons = 0;
  await fetchShow('shows', showId, '/crew').then((show) => {
    show
      .filter((crewMember) => crewMember.type === 'Creator' || crewMember.type === 'Developer')
      .forEach((creator) => {
        creators.push(creator.person.name);
      });
  });
  await fetchShow('shows', showId, '/seasons').then((show) => {
    seasons = show.pop().number;
  });
  const popupWindow = document.createElement('div');
  const closeBtt = document.createElement('div');
  const commentsDisplay = document.createElement('div');
  closeBtt.classList.add('close-butt');
  popupWindow.id = 'comments-popup';
  closeBtt.innerHTML = '<div></div><div></div>';
  commentsDisplay.classList.add('comments-display');
  popupWindow.innerHTML = `
      <div class="img-wrapper">
          <img src="${showObj.image.original}">
      </div>
      <h2 class="show-name">${showObj.name}</h2>
      <div class="details">
          <span>Genres  : ${showObj.genres.toString().replace(/,/g, ' | ')}</span>
          <span>N° of seasons: ${seasons}</span>
          <span>Created by: ${creators.toString().replace(/,/g, ' | ')}</span>
          <span>Premiered on: ${showObj.premiered}</span>
      </div>
  `;
  popupWindow.insertBefore(closeBtt, popupWindow.firstChild);
  commentsDisplay.innerHTML = '<h3>Comments</h3>';
  // fetchPostInv('/comments', {
  //   item_id: 73,
  //   username: 'John',
  //   comment: 'Hi!',
  // });

  fetchGetInv(`/comments?item_id=${showId}`).then((comments) => {
    if (comments.length > 0) {
      comments.forEach((comment) => {
        commentsDisplay.innerHTML += `
          <span>${comment.creation_date} ${comment.username}: ${comment.comment}</span>
        `;
      });
    } else {
      commentsDisplay.innerHTML += '<span>No comments yet!</span>';
    }
  });
  popupWindow.appendChild(commentsDisplay);

  closeBtt.addEventListener('click', () => {
    popupWindow.remove();
  });
  document.body.appendChild(popupWindow);
}