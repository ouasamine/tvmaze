/* eslint-disable no-underscore-dangle */
import { fetchGetInv, fetchPostInv, fetchShow } from './api-fetches.js';
import commentsCounter from './comments-counter.js';

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
  const commentsDisplayHeader = document.createElement('h3');
  const newCommentForm = document.createElement('div');
  const newCommentOwner = document.createElement('input');
  const newCommentContent = document.createElement('textarea');
  const newCommentBtt = document.createElement('button');

  closeBtt.classList.add('close-butt');
  commentsDisplay.classList.add('comments-display');
  newCommentForm.classList.add('new-comment-form');
  newCommentOwner.type = 'text';
  newCommentBtt.innerText = 'Comment';
  popupWindow.id = 'comments-popup';
  closeBtt.innerHTML = '<div></div><div></div>';
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
  newCommentForm.innerHTML = '<h3>Add Comment</h3>';

  await fetchGetInv(`/comments?item_id=${showId}`).then((comments) => {
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
  commentsDisplayHeader.innerText = `Comments (${commentsCounter(commentsDisplay)})`;
  commentsDisplay.insertBefore(commentsDisplayHeader, commentsDisplay.firstChild);
  popupWindow.appendChild(commentsDisplay);
  newCommentForm.append(newCommentOwner, newCommentContent, newCommentBtt);
  popupWindow.appendChild(newCommentForm);

  newCommentBtt.addEventListener('click', () => {
    fetchPostInv('/comments', {
      item_id: showId,
      username: newCommentOwner.value,
      comment: newCommentContent.value,
    });
  });

  closeBtt.addEventListener('click', () => {
    popupWindow.remove();
  });
  document.body.appendChild(popupWindow);
}