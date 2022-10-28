import { fetchGetInv, fetchPostInv, fetchShow } from './api-fetches.js';
import commentsCounter from './comments-counter.js';

async function createShowComments(commentsDisplay, showId) {
  await fetchGetInv(`/comments?item_id=${showId}`).then((comments) => {
    if (!comments.error) {
      const commentsWrapper = document.createElement('div');
      commentsDisplay.innerHTML = '';
      comments.forEach((comment) => {
        commentsWrapper.innerHTML += `
          <span>[${comment.creation_date}] ${comment.username}: ${comment.comment}</span>
        `;
      });
      commentsDisplay.appendChild(commentsWrapper);
    }
  });
  const commentsDisplayHeader = document.createElement('h3');
  commentsDisplayHeader.innerText = `Comments (${commentsCounter(commentsDisplay)})`;
  commentsDisplay.insertBefore(commentsDisplayHeader, commentsDisplay.firstChild);
  return commentsDisplay;
}

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
  const popupContainer = document.createElement('div');
  const popupWindow = document.createElement('div');
  const closeBtt = document.createElement('div');
  const commentsDisplay = document.createElement('div');
  const newCommentForm = document.createElement('div');
  const newCommentOwner = document.createElement('input');
  const newCommentContent = document.createElement('textarea');
  const newCommentBtt = document.createElement('button');

  closeBtt.classList.add('close-butt');
  commentsDisplay.classList.add('comments-display');
  newCommentForm.classList.add('new-comment-form');
  newCommentOwner.type = 'text';
  popupWindow.id = 'comments-popup';
  popupContainer.id = 'popup-container';

  closeBtt.innerHTML = '<div></div><div></div>';
  popupWindow.innerHTML = `
      <div class="img-wrapper">
          <img src="${showObj.image.medium}">
      </div>
      <h2 class="show-name">${showObj.name}</h2>
      <div class="details">
          <span><strong>Genres  : </strong>${showObj.genres.toString().replace(/,/g, ' | ')}</span>
          <span><strong>N° of seasons: </strong>${seasons}</span>
          <span><strong>Created by: </strong>${creators.toString().replace(/,/g, ' | ')}</span>
          <span><strong>Premiered on: </strong>${showObj.premiered}</span>
      </div>
  `;
  commentsDisplay.innerHTML = '<p>No comments yet</p>';
  newCommentOwner.placeholder = 'Your name';
  newCommentContent.placeholder = 'Your comment';
  popupWindow.insertBefore(closeBtt, popupWindow.firstChild);

  newCommentBtt.innerText = 'Comment';
  newCommentForm.innerHTML = '<h3>Add Comment</h3>';

  await createShowComments(commentsDisplay, showId).then((comments) => {
    popupWindow.appendChild(comments);
  });

  newCommentForm.append(newCommentOwner, newCommentContent, newCommentBtt);
  popupWindow.appendChild(newCommentForm);

  newCommentBtt.addEventListener('click', () => {
    fetchPostInv('/comments', {
      item_id: showId,
      username: newCommentOwner.value,
      comment: newCommentContent.value,
    }).then(() => {
      createShowComments(commentsDisplay, showId).then((comments) => {
        popupWindow.insertBefore(comments, commentsDisplay.lastChild);
      });
    });
  });

  closeBtt.addEventListener('click', () => {
    document.body.style.overflowY = 'auto';
    popupContainer.remove();
  });

  popupContainer.appendChild(popupWindow);
  document.body.appendChild(popupContainer);
}