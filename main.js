/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./modules/api-fetches.js":
/*!********************************!*\
  !*** ./modules/api-fetches.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchGetInv": () => (/* binding */ fetchGetInv),
/* harmony export */   "fetchPostInv": () => (/* binding */ fetchPostInv),
/* harmony export */   "fetchShow": () => (/* binding */ fetchShow)
/* harmony export */ });
function fetchShow(endpoint, id, embed = '') {
  const fetching = fetch(`https://api.tvmaze.com/${endpoint}/${id}${embed}`)
    .then((response) => response.json());
  return fetching;
}

function fetchPostInv(endpoint, Obj) {
  return fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/kN7H2rbNR2T7ibxmLmef${endpoint}`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(Obj),
  }).then((response) => response);
}

function fetchGetInv(endpoint) {
  return fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/kN7H2rbNR2T7ibxmLmef${endpoint}`)
    .then((response) => response.json());
}


/***/ }),

/***/ "./modules/comments-counter.js":
/*!*************************************!*\
  !*** ./modules/comments-counter.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ commentsCounter)
/* harmony export */ });
function commentsCounter(commentsContainer) {
  let count = 0;
  const comments = commentsContainer.querySelectorAll('span');
  comments.forEach(() => {
    count += 1;
  });
  return count;
}

/***/ }),

/***/ "./modules/comments-popup.js":
/*!***********************************!*\
  !*** ./modules/comments-popup.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createCommentsPopup)
/* harmony export */ });
/* harmony import */ var _api_fetches_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-fetches.js */ "./modules/api-fetches.js");
/* harmony import */ var _comments_counter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./comments-counter.js */ "./modules/comments-counter.js");



async function createShowComments(commentsDisplay, showId) {
  await (0,_api_fetches_js__WEBPACK_IMPORTED_MODULE_0__.fetchGetInv)(`/comments?item_id=${showId}`).then((comments) => {
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
  commentsDisplayHeader.innerText = `Comments (${(0,_comments_counter_js__WEBPACK_IMPORTED_MODULE_1__["default"])(commentsDisplay)})`;
  commentsDisplay.insertBefore(commentsDisplayHeader, commentsDisplay.firstChild);
  return commentsDisplay;
}

async function createCommentsPopup(showObj, showId) {
  const creators = [];
  let seasons = 0;
  await (0,_api_fetches_js__WEBPACK_IMPORTED_MODULE_0__.fetchShow)('shows', showId, '/crew').then((show) => {
    show
      .filter((crewMember) => crewMember.type === 'Creator' || crewMember.type === 'Developer')
      .forEach((creator) => {
        creators.push(creator.person.name);
      });
  });
  await (0,_api_fetches_js__WEBPACK_IMPORTED_MODULE_0__.fetchShow)('shows', showId, '/seasons').then((show) => {
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
          <span>Genres  : ${showObj.genres.toString().replace(/,/g, ' | ')}</span>
          <span>N° of seasons: ${seasons}</span>
          <span>Created by: ${creators.toString().replace(/,/g, ' | ')}</span>
          <span>Premiered on: ${showObj.premiered}</span>
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
    (0,_api_fetches_js__WEBPACK_IMPORTED_MODULE_0__.fetchPostInv)('/comments', {
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

/***/ }),

/***/ "./modules/show-card.js":
/*!******************************!*\
  !*** ./modules/show-card.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _comments_popup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./comments-popup.js */ "./modules/comments-popup.js");
/* harmony import */ var _api_fetches_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api-fetches.js */ "./modules/api-fetches.js");



async function showLikes(likesCount, showId) {
  likesCount.innerText = '';
  let likes = 0;
  await (0,_api_fetches_js__WEBPACK_IMPORTED_MODULE_1__.fetchGetInv)('/likes').then((res) => {
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

  const likesContainer = showCard.querySelector('div.likes-container');
  likes.append(likesCount, text);
  likesContainer.append(likeBtt, likes);
  showCard.appendChild(butt);
  container.appendChild(showCard);

  showLikes(likesCount, showId).then(() => {
    likeBtt.addEventListener('click', () => {
      (0,_api_fetches_js__WEBPACK_IMPORTED_MODULE_1__.fetchPostInv)('/likes', { item_id: showId }).then(() => {
        showLikes(likesCount, showId);
      });
    });
  });

  butt.addEventListener('click', () => {
    document.body.style.overflowY = 'hidden';
    (0,_comments_popup_js__WEBPACK_IMPORTED_MODULE_0__["default"])(show, showId);
  });

  likeBtt.addEventListener('mouseover', () => {
    likeBtt.firstChild.classList.replace('fa-regular', 'fa-solid');
    likeBtt.firstChild.style.color = 'red';
  });

  likeBtt.addEventListener('mouseout', () => {
    likeBtt.firstChild.classList.replace('fa-solid', 'fa-regular');
    likeBtt.firstChild.style.color = '#fdfdfd';
  });

  likeBtt.addEventListener('click', () => {
    (0,_api_fetches_js__WEBPACK_IMPORTED_MODULE_1__.fetchPostInv)('/likes', { item_id: showId });
  });

  const counter = (moviesContainer) => {
    let counter = 0;
    const movies = moviesContainer.querySelectorAll('.movie-holder');
    movies.forEach(() => {
      counter += 1;
    });
    return counter;
  };

  const allmovies = document.querySelector('#shows-preview');
  const moviecounter = counter(allmovies);
  const displacounter = document.querySelector('.counter');

  displacounter.innerHTML = `<a href="#scripted">Scripted(${moviecounter})</a>`;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createShowCard);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../img/blood-wood-360x240.jpg */ "./img/blood-wood-360x240.jpg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* stylelint-disable no-descending-specificity */\r\nhtml {\r\n  scroll-behavior: smooth;\r\n}\r\n\r\n* {\r\n  box-sizing: border-box;\r\n  margin: 0;\r\n  padding: 0;\r\n  color: #fdfdfd;\r\n}\r\n\r\nbody {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n::-webkit-scrollbar {\r\n  width: 10px;\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 4px;\r\n}\r\n\r\n::-webkit-scrollbar-track {\r\n  background: #f1f1f1;\r\n  border-radius: 4px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n  background: #888;\r\n  border-radius: 4px;\r\n}\r\n\r\nbutton {\r\n  padding: 8px 5px;\r\n  cursor: pointer;\r\n  font-weight: 600;\r\n  background: #d2d2d2;\r\n  border: none;\r\n  border-radius: 3px;\r\n  color: #2c2c2c;\r\n}\r\n\r\nbutton:hover {\r\n  background: #c0c0c0;\r\n}\r\n\r\n#navbar {\r\n  display: flex;\r\n  gap: 85px;\r\n  align-items: center;\r\n  justify-content: center;\r\n  flex-wrap: wrap;\r\n  padding: 26px;\r\n  width: 100%;\r\n  background-color: #fdfdfd;\r\n}\r\n\r\n#navbar h1 a {\r\n  text-decoration: none;\r\n  color: #f002;\r\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\r\n  background-repeat: no-repeat;\r\n  -webkit-background-clip: text;\r\n  -moz-background-clip: text;\r\n  background-size: 100% 100%;\r\n  font-size: 2rem;\r\n}\r\n\r\n#navbar .navlinks {\r\n  list-style: none;\r\n  display: flex;\r\n  gap: 55px;\r\n  flex-wrap: wrap;\r\n}\r\n\r\n.navlinks a {\r\n  text-decoration: none;\r\n  color: #2c2c2c;\r\n  font-weight: 600;\r\n}\r\n\r\n.navlinks a:hover {\r\n  color: #414141;\r\n}\r\n\r\n#shows-preview {\r\n  min-width: 248px;\r\n  display: flex;\r\n  gap: 15px;\r\n  flex-wrap: wrap;\r\n  justify-content: center;\r\n  padding: 50px 5%;\r\n  background-color: #0f1519;\r\n}\r\n\r\n.movie-holder {\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: 260px;\r\n  justify-content: space-between;\r\n  border-radius: 5px;\r\n  padding: 5px;\r\n  background: #2c2c2c;\r\n  box-shadow: #a2a2a2 1px 1px 15px 1px;\r\n}\r\n\r\n.movie-holder img {\r\n  width: 100%;\r\n}\r\n\r\n.movie-holder .show-title {\r\n  width: 100%;\r\n}\r\n\r\n.section-underImage {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  padding: 15px 5px;\r\n  align-items: flex-start;\r\n  font-weight: 600;\r\n}\r\n\r\n.likes-container {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n.likes-container p {\r\n  width: max-content;\r\n}\r\n\r\n.like-button {\r\n  background: none;\r\n  border: none;\r\n  cursor: pointer;\r\n}\r\n\r\n.like-button:hover {\r\n  background: none;\r\n}\r\n\r\n.like-button:active {\r\n  background: red;\r\n}\r\n\r\n#popup-container {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  background-color: #a2a2a222;\r\n  backdrop-filter: blur(5px);\r\n}\r\n\r\n#comments-popup {\r\n  position: fixed;\r\n  background: #2c2c2c;\r\n  top: 25px;\r\n  right: 10%;\r\n  bottom: 25px;\r\n  left: 10%;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  padding: 35px 15px;\r\n  gap: 20px;\r\n  overflow-y: auto;\r\n  border-radius: 4px;\r\n  scroll-behavior: smooth;\r\n}\r\n\r\n#comments-popup * {\r\n  max-width: 700px;\r\n}\r\n\r\n#comments-popup h3 {\r\n  text-align: center;\r\n  margin: 5px 0;\r\n  color: #fdfdfd;\r\n}\r\n\r\n#comments-popup .close-butt {\r\n  cursor: pointer;\r\n  position: absolute;\r\n  right: 10px;\r\n  top: 15px;\r\n  width: 30px;\r\n  height: 30px;\r\n}\r\n\r\n.close-butt div {\r\n  width: 25px;\r\n  height: 4px;\r\n  background-color: #fff;\r\n  margin: 1px 0;\r\n}\r\n\r\n.close-butt div:nth-child(1) {\r\n  transform: rotate(-49deg) translate(-4px, 0);\r\n}\r\n\r\n.close-butt div:nth-child(2) {\r\n  transform: rotate(49deg) translate(-3px, 1px);\r\n}\r\n\r\n#comments-popup .img-wrapper {\r\n  width: 400px;\r\n}\r\n\r\n#comments-popup .img-wrapper img {\r\n  width: 100%;\r\n}\r\n\r\n#comments-popup .show-name {\r\n  font-size: 2.2rem;\r\n}\r\n\r\n#comments-popup .details {\r\n  display: grid;\r\n  grid-template: none / 50% 50%;\r\n  align-content: center;\r\n  border: 2px solid #fff;\r\n  column-gap: 15px;\r\n  row-gap: 15px;\r\n  padding: 15px;\r\n}\r\n\r\n#comments-popup span {\r\n  margin: 5px 0;\r\n}\r\n\r\n#comments-popup .comments-display {\r\n  width: 80%;\r\n}\r\n\r\n#comments-popup .comments-display div {\r\n  display: flex;\r\n  flex-direction: column;\r\n  text-align: center;\r\n  height: 150px;\r\n  overflow-y: auto;\r\n}\r\n\r\n#comments-popup .new-comment-form {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.new-comment-form * {\r\n  margin: 5px 0;\r\n  width: 350px;\r\n  padding: 8px 5px;\r\n  color: #2c2c2c;\r\n}\r\n\r\n.new-comment-form textarea {\r\n  min-height: 150px;\r\n  resize: none;\r\n}\r\n\r\nfooter {\r\n  width: 100%;\r\n  background-color: #fdfdfd;\r\n}\r\n\r\n.p-footer {\r\n  padding: 20px 0;\r\n  font-size: 1.2rem;\r\n  font-weight: 400;\r\n  color: #2c2c2c;\r\n  text-align: center;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #comments-popup {\r\n    right: 10px;\r\n    left: 10px;\r\n    top: 10px;\r\n    bottom: 10px;\r\n  }\r\n\r\n  #comments-popup .img-wrapper {\r\n    width: 200px;\r\n  }\r\n\r\n  .new-comment-form * {\r\n    width: 200px;\r\n  }\r\n}\r\n", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["/* stylelint-disable no-descending-specificity */\r\nhtml {\r\n  scroll-behavior: smooth;\r\n}\r\n\r\n* {\r\n  box-sizing: border-box;\r\n  margin: 0;\r\n  padding: 0;\r\n  color: #fdfdfd;\r\n}\r\n\r\nbody {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n::-webkit-scrollbar {\r\n  width: 10px;\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 4px;\r\n}\r\n\r\n::-webkit-scrollbar-track {\r\n  background: #f1f1f1;\r\n  border-radius: 4px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n  background: #888;\r\n  border-radius: 4px;\r\n}\r\n\r\nbutton {\r\n  padding: 8px 5px;\r\n  cursor: pointer;\r\n  font-weight: 600;\r\n  background: #d2d2d2;\r\n  border: none;\r\n  border-radius: 3px;\r\n  color: #2c2c2c;\r\n}\r\n\r\nbutton:hover {\r\n  background: #c0c0c0;\r\n}\r\n\r\n#navbar {\r\n  display: flex;\r\n  gap: 85px;\r\n  align-items: center;\r\n  justify-content: center;\r\n  flex-wrap: wrap;\r\n  padding: 26px;\r\n  width: 100%;\r\n  background-color: #fdfdfd;\r\n}\r\n\r\n#navbar h1 a {\r\n  text-decoration: none;\r\n  color: #f002;\r\n  background-image: url(\"../img/blood-wood-360x240.jpg\");\r\n  background-repeat: no-repeat;\r\n  -webkit-background-clip: text;\r\n  -moz-background-clip: text;\r\n  background-size: 100% 100%;\r\n  font-size: 2rem;\r\n}\r\n\r\n#navbar .navlinks {\r\n  list-style: none;\r\n  display: flex;\r\n  gap: 55px;\r\n  flex-wrap: wrap;\r\n}\r\n\r\n.navlinks a {\r\n  text-decoration: none;\r\n  color: #2c2c2c;\r\n  font-weight: 600;\r\n}\r\n\r\n.navlinks a:hover {\r\n  color: #414141;\r\n}\r\n\r\n#shows-preview {\r\n  min-width: 248px;\r\n  display: flex;\r\n  gap: 15px;\r\n  flex-wrap: wrap;\r\n  justify-content: center;\r\n  padding: 50px 5%;\r\n  background-color: #0f1519;\r\n}\r\n\r\n.movie-holder {\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: 260px;\r\n  justify-content: space-between;\r\n  border-radius: 5px;\r\n  padding: 5px;\r\n  background: #2c2c2c;\r\n  box-shadow: #a2a2a2 1px 1px 15px 1px;\r\n}\r\n\r\n.movie-holder img {\r\n  width: 100%;\r\n}\r\n\r\n.movie-holder .show-title {\r\n  width: 100%;\r\n}\r\n\r\n.section-underImage {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  padding: 15px 5px;\r\n  align-items: flex-start;\r\n  font-weight: 600;\r\n}\r\n\r\n.likes-container {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n.likes-container p {\r\n  width: max-content;\r\n}\r\n\r\n.like-button {\r\n  background: none;\r\n  border: none;\r\n  cursor: pointer;\r\n}\r\n\r\n.like-button:hover {\r\n  background: none;\r\n}\r\n\r\n.like-button:active {\r\n  background: red;\r\n}\r\n\r\n#popup-container {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  background-color: #a2a2a222;\r\n  backdrop-filter: blur(5px);\r\n}\r\n\r\n#comments-popup {\r\n  position: fixed;\r\n  background: #2c2c2c;\r\n  top: 25px;\r\n  right: 10%;\r\n  bottom: 25px;\r\n  left: 10%;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  padding: 35px 15px;\r\n  gap: 20px;\r\n  overflow-y: auto;\r\n  border-radius: 4px;\r\n  scroll-behavior: smooth;\r\n}\r\n\r\n#comments-popup * {\r\n  max-width: 700px;\r\n}\r\n\r\n#comments-popup h3 {\r\n  text-align: center;\r\n  margin: 5px 0;\r\n  color: #fdfdfd;\r\n}\r\n\r\n#comments-popup .close-butt {\r\n  cursor: pointer;\r\n  position: absolute;\r\n  right: 10px;\r\n  top: 15px;\r\n  width: 30px;\r\n  height: 30px;\r\n}\r\n\r\n.close-butt div {\r\n  width: 25px;\r\n  height: 4px;\r\n  background-color: #fff;\r\n  margin: 1px 0;\r\n}\r\n\r\n.close-butt div:nth-child(1) {\r\n  transform: rotate(-49deg) translate(-4px, 0);\r\n}\r\n\r\n.close-butt div:nth-child(2) {\r\n  transform: rotate(49deg) translate(-3px, 1px);\r\n}\r\n\r\n#comments-popup .img-wrapper {\r\n  width: 400px;\r\n}\r\n\r\n#comments-popup .img-wrapper img {\r\n  width: 100%;\r\n}\r\n\r\n#comments-popup .show-name {\r\n  font-size: 2.2rem;\r\n}\r\n\r\n#comments-popup .details {\r\n  display: grid;\r\n  grid-template: none / 50% 50%;\r\n  align-content: center;\r\n  border: 2px solid #fff;\r\n  column-gap: 15px;\r\n  row-gap: 15px;\r\n  padding: 15px;\r\n}\r\n\r\n#comments-popup span {\r\n  margin: 5px 0;\r\n}\r\n\r\n#comments-popup .comments-display {\r\n  width: 80%;\r\n}\r\n\r\n#comments-popup .comments-display div {\r\n  display: flex;\r\n  flex-direction: column;\r\n  text-align: center;\r\n  height: 150px;\r\n  overflow-y: auto;\r\n}\r\n\r\n#comments-popup .new-comment-form {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.new-comment-form * {\r\n  margin: 5px 0;\r\n  width: 350px;\r\n  padding: 8px 5px;\r\n  color: #2c2c2c;\r\n}\r\n\r\n.new-comment-form textarea {\r\n  min-height: 150px;\r\n  resize: none;\r\n}\r\n\r\nfooter {\r\n  width: 100%;\r\n  background-color: #fdfdfd;\r\n}\r\n\r\n.p-footer {\r\n  padding: 20px 0;\r\n  font-size: 1.2rem;\r\n  font-weight: 400;\r\n  color: #2c2c2c;\r\n  text-align: center;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #comments-popup {\r\n    right: 10px;\r\n    left: 10px;\r\n    top: 10px;\r\n    bottom: 10px;\r\n  }\r\n\r\n  #comments-popup .img-wrapper {\r\n    width: 200px;\r\n  }\r\n\r\n  .new-comment-form * {\r\n    width: 200px;\r\n  }\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./img/blood-wood-360x240.jpg":
/*!************************************!*\
  !*** ./img/blood-wood-360x240.jpg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "65b9998e8a427d8d0778.jpg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _modules_api_fetches_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/api-fetches.js */ "./modules/api-fetches.js");
/* harmony import */ var _modules_show_card_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/show-card.js */ "./modules/show-card.js");




const container = document.querySelector('#shows-preview');
const showsIds = [73, 33352, 69, 21845, 60, 100];

showsIds.forEach((showId) => {
  (0,_modules_api_fetches_js__WEBPACK_IMPORTED_MODULE_1__.fetchShow)('shows', showId).then((show) => {
    (0,_modules_show_card_js__WEBPACK_IMPORTED_MODULE_2__["default"])(container, show, showId);
  });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQU87QUFDUCxtREFBbUQsU0FBUyxHQUFHLEdBQUcsRUFBRSxNQUFNO0FBQzFFO0FBQ0E7QUFDQTs7QUFFTztBQUNQLDhHQUE4RyxTQUFTO0FBQ3ZIO0FBQ0EsZUFBZSxtQ0FBbUMsZ0JBQWdCO0FBQ2xFO0FBQ0EsR0FBRztBQUNIOztBQUVPO0FBQ1AsOEdBQThHLFNBQVM7QUFDdkg7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDakJlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ1B3RTtBQUNwQjs7QUFFcEQ7QUFDQSxRQUFRLDREQUFXLHNCQUFzQixPQUFPO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0JBQXNCLElBQUksaUJBQWlCLElBQUksZ0JBQWdCO0FBQ2xGO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxpREFBaUQsZ0VBQWUsa0JBQWtCO0FBQ2xGO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQSxRQUFRLDBEQUFTO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEdBQUc7QUFDSCxRQUFRLDBEQUFTO0FBQ2pCO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixxQkFBcUI7QUFDM0M7QUFDQSw4QkFBOEIsYUFBYTtBQUMzQztBQUNBLDRCQUE0QiwrQ0FBK0M7QUFDM0UsaUNBQWlDLFFBQVE7QUFDekMsOEJBQThCLHlDQUF5QztBQUN2RSxnQ0FBZ0Msa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLDZEQUFZO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbEdzRDtBQUNPOztBQUU3RDtBQUNBO0FBQ0E7QUFDQSxRQUFRLDREQUFXO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUgsNEJBQTRCLE1BQU07QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSw2REFBWSxhQUFhLGlCQUFpQjtBQUNoRDtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsSUFBSSw4REFBbUI7QUFDdkIsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxJQUFJLDZEQUFZLGFBQWEsaUJBQWlCO0FBQzlDLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw0REFBNEQsYUFBYTtBQUN6RTs7QUFFQSxpRUFBZSxjQUFjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RGN0I7QUFDMEc7QUFDakI7QUFDTztBQUNoRyw0Q0FBNEMsa0lBQWdEO0FBQzVGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0YseUNBQXlDLHNGQUErQjtBQUN4RTtBQUNBLHFHQUFxRyw4QkFBOEIsS0FBSyxXQUFXLDZCQUE2QixnQkFBZ0IsaUJBQWlCLHFCQUFxQixLQUFLLGNBQWMsb0JBQW9CLDZCQUE2QiwwQkFBMEIsS0FBSyw2QkFBNkIsa0JBQWtCLG1DQUFtQyxzQ0FBc0MsS0FBSyxtQ0FBbUMsMEJBQTBCLHlCQUF5QixLQUFLLG1DQUFtQyx1QkFBdUIseUJBQXlCLEtBQUssZ0JBQWdCLHVCQUF1QixzQkFBc0IsdUJBQXVCLDBCQUEwQixtQkFBbUIseUJBQXlCLHFCQUFxQixLQUFLLHNCQUFzQiwwQkFBMEIsS0FBSyxpQkFBaUIsb0JBQW9CLGdCQUFnQiwwQkFBMEIsOEJBQThCLHNCQUFzQixvQkFBb0Isa0JBQWtCLGdDQUFnQyxLQUFLLHNCQUFzQiw0QkFBNEIsbUJBQW1CLHdFQUF3RSxtQ0FBbUMsb0NBQW9DLGlDQUFpQyxpQ0FBaUMsc0JBQXNCLEtBQUssMkJBQTJCLHVCQUF1QixvQkFBb0IsZ0JBQWdCLHNCQUFzQixLQUFLLHFCQUFxQiw0QkFBNEIscUJBQXFCLHVCQUF1QixLQUFLLDJCQUEyQixxQkFBcUIsS0FBSyx3QkFBd0IsdUJBQXVCLG9CQUFvQixnQkFBZ0Isc0JBQXNCLDhCQUE4Qix1QkFBdUIsZ0NBQWdDLEtBQUssdUJBQXVCLG9CQUFvQiw2QkFBNkIsbUJBQW1CLHFDQUFxQyx5QkFBeUIsbUJBQW1CLDBCQUEwQiwyQ0FBMkMsS0FBSywyQkFBMkIsa0JBQWtCLEtBQUssbUNBQW1DLGtCQUFrQixLQUFLLDZCQUE2QixvQkFBb0IscUNBQXFDLHdCQUF3Qiw4QkFBOEIsdUJBQXVCLEtBQUssMEJBQTBCLG9CQUFvQiw2QkFBNkIsMEJBQTBCLEtBQUssNEJBQTRCLHlCQUF5QixLQUFLLHNCQUFzQix1QkFBdUIsbUJBQW1CLHNCQUFzQixLQUFLLDRCQUE0Qix1QkFBdUIsS0FBSyw2QkFBNkIsc0JBQXNCLEtBQUssMEJBQTBCLHNCQUFzQixhQUFhLGVBQWUsZ0JBQWdCLGNBQWMsa0NBQWtDLGlDQUFpQyxLQUFLLHlCQUF5QixzQkFBc0IsMEJBQTBCLGdCQUFnQixpQkFBaUIsbUJBQW1CLGdCQUFnQixvQkFBb0IsNkJBQTZCLDBCQUEwQix5QkFBeUIsZ0JBQWdCLHVCQUF1Qix5QkFBeUIsOEJBQThCLEtBQUssMkJBQTJCLHVCQUF1QixLQUFLLDRCQUE0Qix5QkFBeUIsb0JBQW9CLHFCQUFxQixLQUFLLHFDQUFxQyxzQkFBc0IseUJBQXlCLGtCQUFrQixnQkFBZ0Isa0JBQWtCLG1CQUFtQixLQUFLLHlCQUF5QixrQkFBa0Isa0JBQWtCLDZCQUE2QixvQkFBb0IsS0FBSyxzQ0FBc0MsbURBQW1ELEtBQUssc0NBQXNDLG9EQUFvRCxLQUFLLHNDQUFzQyxtQkFBbUIsS0FBSywwQ0FBMEMsa0JBQWtCLEtBQUssb0NBQW9DLHdCQUF3QixLQUFLLGtDQUFrQyxvQkFBb0Isb0NBQW9DLDRCQUE0Qiw2QkFBNkIsdUJBQXVCLG9CQUFvQixvQkFBb0IsS0FBSyw4QkFBOEIsb0JBQW9CLEtBQUssMkNBQTJDLGlCQUFpQixLQUFLLCtDQUErQyxvQkFBb0IsNkJBQTZCLHlCQUF5QixvQkFBb0IsdUJBQXVCLEtBQUssMkNBQTJDLG9CQUFvQiw2QkFBNkIsS0FBSyw2QkFBNkIsb0JBQW9CLG1CQUFtQix1QkFBdUIscUJBQXFCLEtBQUssb0NBQW9DLHdCQUF3QixtQkFBbUIsS0FBSyxnQkFBZ0Isa0JBQWtCLGdDQUFnQyxLQUFLLG1CQUFtQixzQkFBc0Isd0JBQXdCLHVCQUF1QixxQkFBcUIseUJBQXlCLEtBQUssOENBQThDLHVCQUF1QixvQkFBb0IsbUJBQW1CLGtCQUFrQixxQkFBcUIsT0FBTyx3Q0FBd0MscUJBQXFCLE9BQU8sK0JBQStCLHFCQUFxQixPQUFPLEtBQUssV0FBVyx1RkFBdUYsTUFBTSxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsWUFBWSxhQUFhLFdBQVcsWUFBWSxXQUFXLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsV0FBVyxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsWUFBWSxXQUFXLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksV0FBVyxPQUFPLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsWUFB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Ozs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7OztBQ0FxQjtBQUNpQztBQUNEOztBQUVyRDtBQUNBOztBQUVBO0FBQ0EsRUFBRSxrRUFBUztBQUNYLElBQUksaUVBQWM7QUFDbEIsR0FBRztBQUNILENBQUMsRSIsInNvdXJjZXMiOlsid2VicGFjazovL3R2bWF6ZS8uL21vZHVsZXMvYXBpLWZldGNoZXMuanMiLCJ3ZWJwYWNrOi8vdHZtYXplLy4vbW9kdWxlcy9jb21tZW50cy1jb3VudGVyLmpzIiwid2VicGFjazovL3R2bWF6ZS8uL21vZHVsZXMvY29tbWVudHMtcG9wdXAuanMiLCJ3ZWJwYWNrOi8vdHZtYXplLy4vbW9kdWxlcy9zaG93LWNhcmQuanMiLCJ3ZWJwYWNrOi8vdHZtYXplLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly90dm1hemUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3R2bWF6ZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vdHZtYXplLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdHZtYXplLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL3R2bWF6ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90dm1hemUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3R2bWF6ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90dm1hemUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdHZtYXplLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdHZtYXplLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdHZtYXplL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3R2bWF6ZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90dm1hemUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3R2bWF6ZS93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3R2bWF6ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3R2bWF6ZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3R2bWF6ZS93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly90dm1hemUvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vdHZtYXplL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly90dm1hemUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGZldGNoU2hvdyhlbmRwb2ludCwgaWQsIGVtYmVkID0gJycpIHtcbiAgY29uc3QgZmV0Y2hpbmcgPSBmZXRjaChgaHR0cHM6Ly9hcGkudHZtYXplLmNvbS8ke2VuZHBvaW50fS8ke2lkfSR7ZW1iZWR9YClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSk7XG4gIHJldHVybiBmZXRjaGluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUG9zdEludihlbmRwb2ludCwgT2JqKSB7XG4gIHJldHVybiBmZXRjaChgaHR0cHM6Ly91cy1jZW50cmFsMS1pbnZvbHZlbWVudC1hcGkuY2xvdWRmdW5jdGlvbnMubmV0L2NhcHN0b25lQXBpL2FwcHMva043SDJyYk5SMlQ3aWJ4bUxtZWYke2VuZHBvaW50fWAsIHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShPYmopLFxuICB9KS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hHZXRJbnYoZW5kcG9pbnQpIHtcbiAgcmV0dXJuIGZldGNoKGBodHRwczovL3VzLWNlbnRyYWwxLWludm9sdmVtZW50LWFwaS5jbG91ZGZ1bmN0aW9ucy5uZXQvY2Fwc3RvbmVBcGkvYXBwcy9rTjdIMnJiTlIyVDdpYnhtTG1lZiR7ZW5kcG9pbnR9YClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21tZW50c0NvdW50ZXIoY29tbWVudHNDb250YWluZXIpIHtcbiAgbGV0IGNvdW50ID0gMDtcbiAgY29uc3QgY29tbWVudHMgPSBjb21tZW50c0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuJyk7XG4gIGNvbW1lbnRzLmZvckVhY2goKCkgPT4ge1xuICAgIGNvdW50ICs9IDE7XG4gIH0pO1xuICByZXR1cm4gY291bnQ7XG59IiwiaW1wb3J0IHsgZmV0Y2hHZXRJbnYsIGZldGNoUG9zdEludiwgZmV0Y2hTaG93IH0gZnJvbSAnLi9hcGktZmV0Y2hlcy5qcyc7XG5pbXBvcnQgY29tbWVudHNDb3VudGVyIGZyb20gJy4vY29tbWVudHMtY291bnRlci5qcyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNob3dDb21tZW50cyhjb21tZW50c0Rpc3BsYXksIHNob3dJZCkge1xuICBhd2FpdCBmZXRjaEdldEludihgL2NvbW1lbnRzP2l0ZW1faWQ9JHtzaG93SWR9YCkudGhlbigoY29tbWVudHMpID0+IHtcbiAgICBpZiAoIWNvbW1lbnRzLmVycm9yKSB7XG4gICAgICBjb25zdCBjb21tZW50c1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbW1lbnRzRGlzcGxheS5pbm5lckhUTUwgPSAnJztcbiAgICAgIGNvbW1lbnRzLmZvckVhY2goKGNvbW1lbnQpID0+IHtcbiAgICAgICAgY29tbWVudHNXcmFwcGVyLmlubmVySFRNTCArPSBgXG4gICAgICAgICAgPHNwYW4+WyR7Y29tbWVudC5jcmVhdGlvbl9kYXRlfV0gJHtjb21tZW50LnVzZXJuYW1lfTogJHtjb21tZW50LmNvbW1lbnR9PC9zcGFuPlxuICAgICAgICBgO1xuICAgICAgfSk7XG4gICAgICBjb21tZW50c0Rpc3BsYXkuYXBwZW5kQ2hpbGQoY29tbWVudHNXcmFwcGVyKTtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBjb21tZW50c0Rpc3BsYXlIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuICBjb21tZW50c0Rpc3BsYXlIZWFkZXIuaW5uZXJUZXh0ID0gYENvbW1lbnRzICgke2NvbW1lbnRzQ291bnRlcihjb21tZW50c0Rpc3BsYXkpfSlgO1xuICBjb21tZW50c0Rpc3BsYXkuaW5zZXJ0QmVmb3JlKGNvbW1lbnRzRGlzcGxheUhlYWRlciwgY29tbWVudHNEaXNwbGF5LmZpcnN0Q2hpbGQpO1xuICByZXR1cm4gY29tbWVudHNEaXNwbGF5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDb21tZW50c1BvcHVwKHNob3dPYmosIHNob3dJZCkge1xuICBjb25zdCBjcmVhdG9ycyA9IFtdO1xuICBsZXQgc2Vhc29ucyA9IDA7XG4gIGF3YWl0IGZldGNoU2hvdygnc2hvd3MnLCBzaG93SWQsICcvY3JldycpLnRoZW4oKHNob3cpID0+IHtcbiAgICBzaG93XG4gICAgICAuZmlsdGVyKChjcmV3TWVtYmVyKSA9PiBjcmV3TWVtYmVyLnR5cGUgPT09ICdDcmVhdG9yJyB8fCBjcmV3TWVtYmVyLnR5cGUgPT09ICdEZXZlbG9wZXInKVxuICAgICAgLmZvckVhY2goKGNyZWF0b3IpID0+IHtcbiAgICAgICAgY3JlYXRvcnMucHVzaChjcmVhdG9yLnBlcnNvbi5uYW1lKTtcbiAgICAgIH0pO1xuICB9KTtcbiAgYXdhaXQgZmV0Y2hTaG93KCdzaG93cycsIHNob3dJZCwgJy9zZWFzb25zJykudGhlbigoc2hvdykgPT4ge1xuICAgIHNlYXNvbnMgPSBzaG93LnBvcCgpLm51bWJlcjtcbiAgfSk7XG4gIGNvbnN0IHBvcHVwQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IHBvcHVwV2luZG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGNsb3NlQnR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGNvbW1lbnRzRGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBuZXdDb21tZW50Rm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBuZXdDb21tZW50T3duZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBuZXdDb21tZW50Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gIGNvbnN0IG5ld0NvbW1lbnRCdHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBjbG9zZUJ0dC5jbGFzc0xpc3QuYWRkKCdjbG9zZS1idXR0Jyk7XG4gIGNvbW1lbnRzRGlzcGxheS5jbGFzc0xpc3QuYWRkKCdjb21tZW50cy1kaXNwbGF5Jyk7XG4gIG5ld0NvbW1lbnRGb3JtLmNsYXNzTGlzdC5hZGQoJ25ldy1jb21tZW50LWZvcm0nKTtcbiAgbmV3Q29tbWVudE93bmVyLnR5cGUgPSAndGV4dCc7XG4gIHBvcHVwV2luZG93LmlkID0gJ2NvbW1lbnRzLXBvcHVwJztcbiAgcG9wdXBDb250YWluZXIuaWQgPSAncG9wdXAtY29udGFpbmVyJztcblxuICBjbG9zZUJ0dC5pbm5lckhUTUwgPSAnPGRpdj48L2Rpdj48ZGl2PjwvZGl2Pic7XG4gIHBvcHVwV2luZG93LmlubmVySFRNTCA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJpbWctd3JhcHBlclwiPlxuICAgICAgICAgIDxpbWcgc3JjPVwiJHtzaG93T2JqLmltYWdlLm1lZGl1bX1cIj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGgyIGNsYXNzPVwic2hvdy1uYW1lXCI+JHtzaG93T2JqLm5hbWV9PC9oMj5cbiAgICAgIDxkaXYgY2xhc3M9XCJkZXRhaWxzXCI+XG4gICAgICAgICAgPHNwYW4+R2VucmVzICA6ICR7c2hvd09iai5nZW5yZXMudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcgfCAnKX08L3NwYW4+XG4gICAgICAgICAgPHNwYW4+TsKwIG9mIHNlYXNvbnM6ICR7c2Vhc29uc308L3NwYW4+XG4gICAgICAgICAgPHNwYW4+Q3JlYXRlZCBieTogJHtjcmVhdG9ycy50b1N0cmluZygpLnJlcGxhY2UoLywvZywgJyB8ICcpfTwvc3Bhbj5cbiAgICAgICAgICA8c3Bhbj5QcmVtaWVyZWQgb246ICR7c2hvd09iai5wcmVtaWVyZWR9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gIGA7XG4gIGNvbW1lbnRzRGlzcGxheS5pbm5lckhUTUwgPSAnPHA+Tm8gY29tbWVudHMgeWV0PC9wPic7XG4gIG5ld0NvbW1lbnRPd25lci5wbGFjZWhvbGRlciA9ICdZb3VyIG5hbWUnO1xuICBuZXdDb21tZW50Q29udGVudC5wbGFjZWhvbGRlciA9ICdZb3VyIGNvbW1lbnQnO1xuICBwb3B1cFdpbmRvdy5pbnNlcnRCZWZvcmUoY2xvc2VCdHQsIHBvcHVwV2luZG93LmZpcnN0Q2hpbGQpO1xuXG4gIG5ld0NvbW1lbnRCdHQuaW5uZXJUZXh0ID0gJ0NvbW1lbnQnO1xuICBuZXdDb21tZW50Rm9ybS5pbm5lckhUTUwgPSAnPGgzPkFkZCBDb21tZW50PC9oMz4nO1xuXG4gIGF3YWl0IGNyZWF0ZVNob3dDb21tZW50cyhjb21tZW50c0Rpc3BsYXksIHNob3dJZCkudGhlbigoY29tbWVudHMpID0+IHtcbiAgICBwb3B1cFdpbmRvdy5hcHBlbmRDaGlsZChjb21tZW50cyk7XG4gIH0pO1xuXG4gIG5ld0NvbW1lbnRGb3JtLmFwcGVuZChuZXdDb21tZW50T3duZXIsIG5ld0NvbW1lbnRDb250ZW50LCBuZXdDb21tZW50QnR0KTtcbiAgcG9wdXBXaW5kb3cuYXBwZW5kQ2hpbGQobmV3Q29tbWVudEZvcm0pO1xuXG4gIG5ld0NvbW1lbnRCdHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZmV0Y2hQb3N0SW52KCcvY29tbWVudHMnLCB7XG4gICAgICBpdGVtX2lkOiBzaG93SWQsXG4gICAgICB1c2VybmFtZTogbmV3Q29tbWVudE93bmVyLnZhbHVlLFxuICAgICAgY29tbWVudDogbmV3Q29tbWVudENvbnRlbnQudmFsdWUsXG4gICAgfSkudGhlbigoKSA9PiB7XG4gICAgICBjcmVhdGVTaG93Q29tbWVudHMoY29tbWVudHNEaXNwbGF5LCBzaG93SWQpLnRoZW4oKGNvbW1lbnRzKSA9PiB7XG4gICAgICAgIHBvcHVwV2luZG93Lmluc2VydEJlZm9yZShjb21tZW50cywgY29tbWVudHNEaXNwbGF5Lmxhc3RDaGlsZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY2xvc2VCdHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvd1kgPSAnYXV0byc7XG4gICAgcG9wdXBDb250YWluZXIucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIHBvcHVwQ29udGFpbmVyLmFwcGVuZENoaWxkKHBvcHVwV2luZG93KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb3B1cENvbnRhaW5lcik7XG59IiwiaW1wb3J0IGNyZWF0ZUNvbW1lbnRzUG9wdXAgZnJvbSAnLi9jb21tZW50cy1wb3B1cC5qcyc7XG5pbXBvcnQgeyBmZXRjaEdldEludiwgZmV0Y2hQb3N0SW52IH0gZnJvbSAnLi9hcGktZmV0Y2hlcy5qcyc7XG5cbmFzeW5jIGZ1bmN0aW9uIHNob3dMaWtlcyhsaWtlc0NvdW50LCBzaG93SWQpIHtcbiAgbGlrZXNDb3VudC5pbm5lclRleHQgPSAnJztcbiAgbGV0IGxpa2VzID0gMDtcbiAgYXdhaXQgZmV0Y2hHZXRJbnYoJy9saWtlcycpLnRoZW4oKHJlcykgPT4ge1xuICAgIGlmIChyZXMuZmlsdGVyKChpdGVtKSA9PiBpdGVtLml0ZW1faWQgPT09IHNob3dJZCkucG9wKCkpIHtcbiAgICAgIGxpa2VzID0gcmVzLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5pdGVtX2lkID09PSBzaG93SWQpLnBvcCgpLmxpa2VzO1xuICAgIH1cbiAgfSk7XG5cbiAgbGlrZXNDb3VudC5pbm5lclRleHQgPSBgJHtsaWtlc31gO1xufVxuXG5jb25zdCBjcmVhdGVTaG93Q2FyZCA9IGFzeW5jIChjb250YWluZXIsIHNob3csIHNob3dJZCkgPT4ge1xuICBjb25zdCBzaG93Q2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBidXR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGxpa2VCdHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbGlrZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IGxpa2VzQ291bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIGxpa2VzJyk7XG5cbiAgc2hvd0NhcmQuY2xhc3NMaXN0LmFkZCgnbW92aWUtaG9sZGVyJyk7XG4gIGxpa2VCdHQuY2xhc3NMaXN0LmFkZCgnbGlrZS1idXR0b24nKTtcbiAgYnV0dC5jbGFzc0xpc3QuYWRkKCdjb21tZW50cy1idXR0Jyk7XG5cbiAgbGlrZUJ0dC5pbm5lckhUTUwgPSAnPGkgY2xhc3M9XCJmYS1yZWd1bGFyIGZhLWhlYXJ0XCI+PC9pPic7XG4gIHNob3dDYXJkLmlubmVySFRNTCArPSBgXG4gICAgPGltZyBzcmM9XCIke3Nob3cuaW1hZ2UubWVkaXVtfVwiPlxuICAgIDxzZWN0aW9uIGNsYXNzPSdzZWN0aW9uLXVuZGVySW1hZ2UnPlxuICAgICAgPHAgY2xhc3M9XCJzaG93LXRpdGxlXCI+JHtzaG93Lm5hbWV9PC9wPlxuICAgICAgPGRpdiBjbGFzcz1cImxpa2VzLWNvbnRhaW5lclwiPlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPmA7XG4gIGJ1dHQuaW5uZXJUZXh0ID0gJ0NvbW1lbnQnO1xuXG4gIGNvbnN0IGxpa2VzQ29udGFpbmVyID0gc2hvd0NhcmQucXVlcnlTZWxlY3RvcignZGl2Lmxpa2VzLWNvbnRhaW5lcicpO1xuICBsaWtlcy5hcHBlbmQobGlrZXNDb3VudCwgdGV4dCk7XG4gIGxpa2VzQ29udGFpbmVyLmFwcGVuZChsaWtlQnR0LCBsaWtlcyk7XG4gIHNob3dDYXJkLmFwcGVuZENoaWxkKGJ1dHQpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2hvd0NhcmQpO1xuXG4gIHNob3dMaWtlcyhsaWtlc0NvdW50LCBzaG93SWQpLnRoZW4oKCkgPT4ge1xuICAgIGxpa2VCdHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBmZXRjaFBvc3RJbnYoJy9saWtlcycsIHsgaXRlbV9pZDogc2hvd0lkIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBzaG93TGlrZXMobGlrZXNDb3VudCwgc2hvd0lkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBidXR0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3dZID0gJ2hpZGRlbic7XG4gICAgY3JlYXRlQ29tbWVudHNQb3B1cChzaG93LCBzaG93SWQpO1xuICB9KTtcblxuICBsaWtlQnR0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsICgpID0+IHtcbiAgICBsaWtlQnR0LmZpcnN0Q2hpbGQuY2xhc3NMaXN0LnJlcGxhY2UoJ2ZhLXJlZ3VsYXInLCAnZmEtc29saWQnKTtcbiAgICBsaWtlQnR0LmZpcnN0Q2hpbGQuc3R5bGUuY29sb3IgPSAncmVkJztcbiAgfSk7XG5cbiAgbGlrZUJ0dC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICBsaWtlQnR0LmZpcnN0Q2hpbGQuY2xhc3NMaXN0LnJlcGxhY2UoJ2ZhLXNvbGlkJywgJ2ZhLXJlZ3VsYXInKTtcbiAgICBsaWtlQnR0LmZpcnN0Q2hpbGQuc3R5bGUuY29sb3IgPSAnI2ZkZmRmZCc7XG4gIH0pO1xuXG4gIGxpa2VCdHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZmV0Y2hQb3N0SW52KCcvbGlrZXMnLCB7IGl0ZW1faWQ6IHNob3dJZCB9KTtcbiAgfSk7XG5cbiAgY29uc3QgY291bnRlciA9IChtb3ZpZXNDb250YWluZXIpID0+IHtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgY29uc3QgbW92aWVzID0gbW92aWVzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb3ZpZS1ob2xkZXInKTtcbiAgICBtb3ZpZXMuZm9yRWFjaCgoKSA9PiB7XG4gICAgICBjb3VudGVyICs9IDE7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG5cbiAgY29uc3QgYWxsbW92aWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Nob3dzLXByZXZpZXcnKTtcbiAgY29uc3QgbW92aWVjb3VudGVyID0gY291bnRlcihhbGxtb3ZpZXMpO1xuICBjb25zdCBkaXNwbGFjb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50ZXInKTtcblxuICBkaXNwbGFjb3VudGVyLmlubmVySFRNTCA9IGA8YSBocmVmPVwiI3NjcmlwdGVkXCI+U2NyaXB0ZWQoJHttb3ZpZWNvdW50ZXJ9KTwvYT5gO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2hvd0NhcmQ7IiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4uL2ltZy9ibG9vZC13b29kLTM2MHgyNDAuanBnXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLyogc3R5bGVsaW50LWRpc2FibGUgbm8tZGVzY2VuZGluZy1zcGVjaWZpY2l0eSAqL1xcclxcbmh0bWwge1xcclxcbiAgc2Nyb2xsLWJlaGF2aW9yOiBzbW9vdGg7XFxyXFxufVxcclxcblxcclxcbioge1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIHBhZGRpbmc6IDA7XFxyXFxuICBjb2xvcjogI2ZkZmRmZDtcXHJcXG59XFxyXFxuXFxyXFxuYm9keSB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xcclxcbiAgd2lkdGg6IDEwcHg7XFxyXFxuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNHB4O1xcclxcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDRweDtcXHJcXG59XFxyXFxuXFxyXFxuOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XFxyXFxuICBiYWNrZ3JvdW5kOiAjZjFmMWYxO1xcclxcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcclxcbn1cXHJcXG5cXHJcXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcXHJcXG4gIGJhY2tncm91bmQ6ICM4ODg7XFxyXFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxyXFxufVxcclxcblxcclxcbmJ1dHRvbiB7XFxyXFxuICBwYWRkaW5nOiA4cHggNXB4O1xcclxcbiAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXHJcXG4gIGJhY2tncm91bmQ6ICNkMmQyZDI7XFxyXFxuICBib3JkZXI6IG5vbmU7XFxyXFxuICBib3JkZXItcmFkaXVzOiAzcHg7XFxyXFxuICBjb2xvcjogIzJjMmMyYztcXHJcXG59XFxyXFxuXFxyXFxuYnV0dG9uOmhvdmVyIHtcXHJcXG4gIGJhY2tncm91bmQ6ICNjMGMwYzA7XFxyXFxufVxcclxcblxcclxcbiNuYXZiYXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGdhcDogODVweDtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIGZsZXgtd3JhcDogd3JhcDtcXHJcXG4gIHBhZGRpbmc6IDI2cHg7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZGZkZmQ7XFxyXFxufVxcclxcblxcclxcbiNuYXZiYXIgaDEgYSB7XFxyXFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICBjb2xvcjogI2YwMDI7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fICsgXCIpO1xcclxcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXHJcXG4gIC13ZWJraXQtYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xcclxcbiAgLW1vei1iYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XFxyXFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMCUgMTAwJTtcXHJcXG4gIGZvbnQtc2l6ZTogMnJlbTtcXHJcXG59XFxyXFxuXFxyXFxuI25hdmJhciAubmF2bGlua3Mge1xcclxcbiAgbGlzdC1zdHlsZTogbm9uZTtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBnYXA6IDU1cHg7XFxyXFxuICBmbGV4LXdyYXA6IHdyYXA7XFxyXFxufVxcclxcblxcclxcbi5uYXZsaW5rcyBhIHtcXHJcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG4gIGNvbG9yOiAjMmMyYzJjO1xcclxcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXHJcXG59XFxyXFxuXFxyXFxuLm5hdmxpbmtzIGE6aG92ZXIge1xcclxcbiAgY29sb3I6ICM0MTQxNDE7XFxyXFxufVxcclxcblxcclxcbiNzaG93cy1wcmV2aWV3IHtcXHJcXG4gIG1pbi13aWR0aDogMjQ4cHg7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZ2FwOiAxNXB4O1xcclxcbiAgZmxleC13cmFwOiB3cmFwO1xcclxcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBwYWRkaW5nOiA1MHB4IDUlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzBmMTUxOTtcXHJcXG59XFxyXFxuXFxyXFxuLm1vdmllLWhvbGRlciB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIHdpZHRoOiAyNjBweDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcXHJcXG4gIHBhZGRpbmc6IDVweDtcXHJcXG4gIGJhY2tncm91bmQ6ICMyYzJjMmM7XFxyXFxuICBib3gtc2hhZG93OiAjYTJhMmEyIDFweCAxcHggMTVweCAxcHg7XFxyXFxufVxcclxcblxcclxcbi5tb3ZpZS1ob2xkZXIgaW1nIHtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4ubW92aWUtaG9sZGVyIC5zaG93LXRpdGxlIHtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4uc2VjdGlvbi11bmRlckltYWdlIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuICBwYWRkaW5nOiAxNXB4IDVweDtcXHJcXG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcclxcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXHJcXG59XFxyXFxuXFxyXFxuLmxpa2VzLWNvbnRhaW5lciB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5saWtlcy1jb250YWluZXIgcCB7XFxyXFxuICB3aWR0aDogbWF4LWNvbnRlbnQ7XFxyXFxufVxcclxcblxcclxcbi5saWtlLWJ1dHRvbiB7XFxyXFxuICBiYWNrZ3JvdW5kOiBub25lO1xcclxcbiAgYm9yZGVyOiBub25lO1xcclxcbiAgY3Vyc29yOiBwb2ludGVyO1xcclxcbn1cXHJcXG5cXHJcXG4ubGlrZS1idXR0b246aG92ZXIge1xcclxcbiAgYmFja2dyb3VuZDogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLmxpa2UtYnV0dG9uOmFjdGl2ZSB7XFxyXFxuICBiYWNrZ3JvdW5kOiByZWQ7XFxyXFxufVxcclxcblxcclxcbiNwb3B1cC1jb250YWluZXIge1xcclxcbiAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgdG9wOiAwO1xcclxcbiAgcmlnaHQ6IDA7XFxyXFxuICBib3R0b206IDA7XFxyXFxuICBsZWZ0OiAwO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogI2EyYTJhMjIyO1xcclxcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDVweCk7XFxyXFxufVxcclxcblxcclxcbiNjb21tZW50cy1wb3B1cCB7XFxyXFxuICBwb3NpdGlvbjogZml4ZWQ7XFxyXFxuICBiYWNrZ3JvdW5kOiAjMmMyYzJjO1xcclxcbiAgdG9wOiAyNXB4O1xcclxcbiAgcmlnaHQ6IDEwJTtcXHJcXG4gIGJvdHRvbTogMjVweDtcXHJcXG4gIGxlZnQ6IDEwJTtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIHBhZGRpbmc6IDM1cHggMTVweDtcXHJcXG4gIGdhcDogMjBweDtcXHJcXG4gIG92ZXJmbG93LXk6IGF1dG87XFxyXFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxyXFxuICBzY3JvbGwtYmVoYXZpb3I6IHNtb290aDtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwICoge1xcclxcbiAgbWF4LXdpZHRoOiA3MDBweDtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIGgzIHtcXHJcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gIG1hcmdpbjogNXB4IDA7XFxyXFxuICBjb2xvcjogI2ZkZmRmZDtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIC5jbG9zZS1idXR0IHtcXHJcXG4gIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIHJpZ2h0OiAxMHB4O1xcclxcbiAgdG9wOiAxNXB4O1xcclxcbiAgd2lkdGg6IDMwcHg7XFxyXFxuICBoZWlnaHQ6IDMwcHg7XFxyXFxufVxcclxcblxcclxcbi5jbG9zZS1idXR0IGRpdiB7XFxyXFxuICB3aWR0aDogMjVweDtcXHJcXG4gIGhlaWdodDogNHB4O1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXHJcXG4gIG1hcmdpbjogMXB4IDA7XFxyXFxufVxcclxcblxcclxcbi5jbG9zZS1idXR0IGRpdjpudGgtY2hpbGQoMSkge1xcclxcbiAgdHJhbnNmb3JtOiByb3RhdGUoLTQ5ZGVnKSB0cmFuc2xhdGUoLTRweCwgMCk7XFxyXFxufVxcclxcblxcclxcbi5jbG9zZS1idXR0IGRpdjpudGgtY2hpbGQoMikge1xcclxcbiAgdHJhbnNmb3JtOiByb3RhdGUoNDlkZWcpIHRyYW5zbGF0ZSgtM3B4LCAxcHgpO1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgLmltZy13cmFwcGVyIHtcXHJcXG4gIHdpZHRoOiA0MDBweDtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIC5pbWctd3JhcHBlciBpbWcge1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbiNjb21tZW50cy1wb3B1cCAuc2hvdy1uYW1lIHtcXHJcXG4gIGZvbnQtc2l6ZTogMi4ycmVtO1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgLmRldGFpbHMge1xcclxcbiAgZGlzcGxheTogZ3JpZDtcXHJcXG4gIGdyaWQtdGVtcGxhdGU6IG5vbmUgLyA1MCUgNTAlO1xcclxcbiAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbiAgYm9yZGVyOiAycHggc29saWQgI2ZmZjtcXHJcXG4gIGNvbHVtbi1nYXA6IDE1cHg7XFxyXFxuICByb3ctZ2FwOiAxNXB4O1xcclxcbiAgcGFkZGluZzogMTVweDtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIHNwYW4ge1xcclxcbiAgbWFyZ2luOiA1cHggMDtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIC5jb21tZW50cy1kaXNwbGF5IHtcXHJcXG4gIHdpZHRoOiA4MCU7XFxyXFxufVxcclxcblxcclxcbiNjb21tZW50cy1wb3B1cCAuY29tbWVudHMtZGlzcGxheSBkaXYge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICBoZWlnaHQ6IDE1MHB4O1xcclxcbiAgb3ZlcmZsb3cteTogYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIC5uZXctY29tbWVudC1mb3JtIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbn1cXHJcXG5cXHJcXG4ubmV3LWNvbW1lbnQtZm9ybSAqIHtcXHJcXG4gIG1hcmdpbjogNXB4IDA7XFxyXFxuICB3aWR0aDogMzUwcHg7XFxyXFxuICBwYWRkaW5nOiA4cHggNXB4O1xcclxcbiAgY29sb3I6ICMyYzJjMmM7XFxyXFxufVxcclxcblxcclxcbi5uZXctY29tbWVudC1mb3JtIHRleHRhcmVhIHtcXHJcXG4gIG1pbi1oZWlnaHQ6IDE1MHB4O1xcclxcbiAgcmVzaXplOiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG5mb290ZXIge1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmRmZGZkO1xcclxcbn1cXHJcXG5cXHJcXG4ucC1mb290ZXIge1xcclxcbiAgcGFkZGluZzogMjBweCAwO1xcclxcbiAgZm9udC1zaXplOiAxLjJyZW07XFxyXFxuICBmb250LXdlaWdodDogNDAwO1xcclxcbiAgY29sb3I6ICMyYzJjMmM7XFxyXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYwMHB4KSB7XFxyXFxuICAjY29tbWVudHMtcG9wdXAge1xcclxcbiAgICByaWdodDogMTBweDtcXHJcXG4gICAgbGVmdDogMTBweDtcXHJcXG4gICAgdG9wOiAxMHB4O1xcclxcbiAgICBib3R0b206IDEwcHg7XFxyXFxuICB9XFxyXFxuXFxyXFxuICAjY29tbWVudHMtcG9wdXAgLmltZy13cmFwcGVyIHtcXHJcXG4gICAgd2lkdGg6IDIwMHB4O1xcclxcbiAgfVxcclxcblxcclxcbiAgLm5ldy1jb21tZW50LWZvcm0gKiB7XFxyXFxuICAgIHdpZHRoOiAyMDBweDtcXHJcXG4gIH1cXHJcXG59XFxyXFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxnREFBZ0Q7QUFDaEQ7RUFDRSx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxzQkFB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QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEIsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxXQUFXO0VBQ1gseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixnQkFBZ0I7RUFDaEIsY0FBYztFQUNkLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFO0lBQ0UsV0FBVztJQUNYLFVBQVU7SUFDVixTQUFTO0lBQ1QsWUFBWTtFQUNkOztFQUVBO0lBQ0UsWUFBWTtFQUNkOztFQUVBO0lBQ0UsWUFBWTtFQUNkO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogc3R5bGVsaW50LWRpc2FibGUgbm8tZGVzY2VuZGluZy1zcGVjaWZpY2l0eSAqL1xcclxcbmh0bWwge1xcclxcbiAgc2Nyb2xsLWJlaGF2aW9yOiBzbW9vdGg7XFxyXFxufVxcclxcblxcclxcbioge1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIHBhZGRpbmc6IDA7XFxyXFxuICBjb2xvcjogI2ZkZmRmZDtcXHJcXG59XFxyXFxuXFxyXFxuYm9keSB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xcclxcbiAgd2lkdGg6IDEwcHg7XFxyXFxuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNHB4O1xcclxcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDRweDtcXHJcXG59XFxyXFxuXFxyXFxuOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XFxyXFxuICBiYWNrZ3JvdW5kOiAjZjFmMWYxO1xcclxcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcclxcbn1cXHJcXG5cXHJcXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcXHJcXG4gIGJhY2tncm91bmQ6ICM4ODg7XFxyXFxuICBib3JkZXItcmFkaXVzOiA0cHg7XFxyXFxufVxcclxcblxcclxcbmJ1dHRvbiB7XFxyXFxuICBwYWRkaW5nOiA4cHggNXB4O1xcclxcbiAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgZm9udC13ZWlnaHQ6IDYwMDtcXHJcXG4gIGJhY2tncm91bmQ6ICNkMmQyZDI7XFxyXFxuICBib3JkZXI6IG5vbmU7XFxyXFxuICBib3JkZXItcmFkaXVzOiAzcHg7XFxyXFxuICBjb2xvcjogIzJjMmMyYztcXHJcXG59XFxyXFxuXFxyXFxuYnV0dG9uOmhvdmVyIHtcXHJcXG4gIGJhY2tncm91bmQ6ICNjMGMwYzA7XFxyXFxufVxcclxcblxcclxcbiNuYXZiYXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGdhcDogODVweDtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIGZsZXgtd3JhcDogd3JhcDtcXHJcXG4gIHBhZGRpbmc6IDI2cHg7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZGZkZmQ7XFxyXFxufVxcclxcblxcclxcbiNuYXZiYXIgaDEgYSB7XFxyXFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICBjb2xvcjogI2YwMDI7XFxyXFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcIi4uL2ltZy9ibG9vZC13b29kLTM2MHgyNDAuanBnXFxcIik7XFxyXFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcclxcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XFxyXFxuICAtbW96LWJhY2tncm91bmQtY2xpcDogdGV4dDtcXHJcXG4gIGJhY2tncm91bmQtc2l6ZTogMTAwJSAxMDAlO1xcclxcbiAgZm9udC1zaXplOiAycmVtO1xcclxcbn1cXHJcXG5cXHJcXG4jbmF2YmFyIC5uYXZsaW5rcyB7XFxyXFxuICBsaXN0LXN0eWxlOiBub25lO1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGdhcDogNTVweDtcXHJcXG4gIGZsZXgtd3JhcDogd3JhcDtcXHJcXG59XFxyXFxuXFxyXFxuLm5hdmxpbmtzIGEge1xcclxcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcbiAgY29sb3I6ICMyYzJjMmM7XFxyXFxuICBmb250LXdlaWdodDogNjAwO1xcclxcbn1cXHJcXG5cXHJcXG4ubmF2bGlua3MgYTpob3ZlciB7XFxyXFxuICBjb2xvcjogIzQxNDE0MTtcXHJcXG59XFxyXFxuXFxyXFxuI3Nob3dzLXByZXZpZXcge1xcclxcbiAgbWluLXdpZHRoOiAyNDhweDtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBnYXA6IDE1cHg7XFxyXFxuICBmbGV4LXdyYXA6IHdyYXA7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIHBhZGRpbmc6IDUwcHggNSU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMGYxNTE5O1xcclxcbn1cXHJcXG5cXHJcXG4ubW92aWUtaG9sZGVyIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgd2lkdGg6IDI2MHB4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcclxcbiAgcGFkZGluZzogNXB4O1xcclxcbiAgYmFja2dyb3VuZDogIzJjMmMyYztcXHJcXG4gIGJveC1zaGFkb3c6ICNhMmEyYTIgMXB4IDFweCAxNXB4IDFweDtcXHJcXG59XFxyXFxuXFxyXFxuLm1vdmllLWhvbGRlciBpbWcge1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5tb3ZpZS1ob2xkZXIgLnNob3ctdGl0bGUge1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5zZWN0aW9uLXVuZGVySW1hZ2Uge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG4gIHBhZGRpbmc6IDE1cHggNXB4O1xcclxcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxyXFxuICBmb250LXdlaWdodDogNjAwO1xcclxcbn1cXHJcXG5cXHJcXG4ubGlrZXMtY29udGFpbmVyIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmxpa2VzLWNvbnRhaW5lciBwIHtcXHJcXG4gIHdpZHRoOiBtYXgtY29udGVudDtcXHJcXG59XFxyXFxuXFxyXFxuLmxpa2UtYnV0dG9uIHtcXHJcXG4gIGJhY2tncm91bmQ6IG5vbmU7XFxyXFxuICBib3JkZXI6IG5vbmU7XFxyXFxuICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5saWtlLWJ1dHRvbjpob3ZlciB7XFxyXFxuICBiYWNrZ3JvdW5kOiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4ubGlrZS1idXR0b246YWN0aXZlIHtcXHJcXG4gIGJhY2tncm91bmQ6IHJlZDtcXHJcXG59XFxyXFxuXFxyXFxuI3BvcHVwLWNvbnRhaW5lciB7XFxyXFxuICBwb3NpdGlvbjogZml4ZWQ7XFxyXFxuICB0b3A6IDA7XFxyXFxuICByaWdodDogMDtcXHJcXG4gIGJvdHRvbTogMDtcXHJcXG4gIGxlZnQ6IDA7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTJhMmEyMjI7XFxyXFxuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNXB4KTtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIHtcXHJcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gIGJhY2tncm91bmQ6ICMyYzJjMmM7XFxyXFxuICB0b3A6IDI1cHg7XFxyXFxuICByaWdodDogMTAlO1xcclxcbiAgYm90dG9tOiAyNXB4O1xcclxcbiAgbGVmdDogMTAlO1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgcGFkZGluZzogMzVweCAxNXB4O1xcclxcbiAgZ2FwOiAyMHB4O1xcclxcbiAgb3ZlcmZsb3cteTogYXV0bztcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcXHJcXG4gIHNjcm9sbC1iZWhhdmlvcjogc21vb3RoO1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgKiB7XFxyXFxuICBtYXgtd2lkdGg6IDcwMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgaDMge1xcclxcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbiAgbWFyZ2luOiA1cHggMDtcXHJcXG4gIGNvbG9yOiAjZmRmZGZkO1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgLmNsb3NlLWJ1dHQge1xcclxcbiAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgcmlnaHQ6IDEwcHg7XFxyXFxuICB0b3A6IDE1cHg7XFxyXFxuICB3aWR0aDogMzBweDtcXHJcXG4gIGhlaWdodDogMzBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmNsb3NlLWJ1dHQgZGl2IHtcXHJcXG4gIHdpZHRoOiAyNXB4O1xcclxcbiAgaGVpZ2h0OiA0cHg7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcclxcbiAgbWFyZ2luOiAxcHggMDtcXHJcXG59XFxyXFxuXFxyXFxuLmNsb3NlLWJ1dHQgZGl2Om50aC1jaGlsZCgxKSB7XFxyXFxuICB0cmFuc2Zvcm06IHJvdGF0ZSgtNDlkZWcpIHRyYW5zbGF0ZSgtNHB4LCAwKTtcXHJcXG59XFxyXFxuXFxyXFxuLmNsb3NlLWJ1dHQgZGl2Om50aC1jaGlsZCgyKSB7XFxyXFxuICB0cmFuc2Zvcm06IHJvdGF0ZSg0OWRlZykgdHJhbnNsYXRlKC0zcHgsIDFweCk7XFxyXFxufVxcclxcblxcclxcbiNjb21tZW50cy1wb3B1cCAuaW1nLXdyYXBwZXIge1xcclxcbiAgd2lkdGg6IDQwMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgLmltZy13cmFwcGVyIGltZyB7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIC5zaG93LW5hbWUge1xcclxcbiAgZm9udC1zaXplOiAyLjJyZW07XFxyXFxufVxcclxcblxcclxcbiNjb21tZW50cy1wb3B1cCAuZGV0YWlscyB7XFxyXFxuICBkaXNwbGF5OiBncmlkO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZTogbm9uZSAvIDUwJSA1MCU7XFxyXFxuICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBib3JkZXI6IDJweCBzb2xpZCAjZmZmO1xcclxcbiAgY29sdW1uLWdhcDogMTVweDtcXHJcXG4gIHJvdy1nYXA6IDE1cHg7XFxyXFxuICBwYWRkaW5nOiAxNXB4O1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgc3BhbiB7XFxyXFxuICBtYXJnaW46IDVweCAwO1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgLmNvbW1lbnRzLWRpc3BsYXkge1xcclxcbiAgd2lkdGg6IDgwJTtcXHJcXG59XFxyXFxuXFxyXFxuI2NvbW1lbnRzLXBvcHVwIC5jb21tZW50cy1kaXNwbGF5IGRpdiB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gIGhlaWdodDogMTUwcHg7XFxyXFxuICBvdmVyZmxvdy15OiBhdXRvO1xcclxcbn1cXHJcXG5cXHJcXG4jY29tbWVudHMtcG9wdXAgLm5ldy1jb21tZW50LWZvcm0ge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxufVxcclxcblxcclxcbi5uZXctY29tbWVudC1mb3JtICoge1xcclxcbiAgbWFyZ2luOiA1cHggMDtcXHJcXG4gIHdpZHRoOiAzNTBweDtcXHJcXG4gIHBhZGRpbmc6IDhweCA1cHg7XFxyXFxuICBjb2xvcjogIzJjMmMyYztcXHJcXG59XFxyXFxuXFxyXFxuLm5ldy1jb21tZW50LWZvcm0gdGV4dGFyZWEge1xcclxcbiAgbWluLWhlaWdodDogMTUwcHg7XFxyXFxuICByZXNpemU6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbmZvb3RlciB7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZGZkZmQ7XFxyXFxufVxcclxcblxcclxcbi5wLWZvb3RlciB7XFxyXFxuICBwYWRkaW5nOiAyMHB4IDA7XFxyXFxuICBmb250LXNpemU6IDEuMnJlbTtcXHJcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxyXFxuICBjb2xvcjogIzJjMmMyYztcXHJcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcXHJcXG4gICNjb21tZW50cy1wb3B1cCB7XFxyXFxuICAgIHJpZ2h0OiAxMHB4O1xcclxcbiAgICBsZWZ0OiAxMHB4O1xcclxcbiAgICB0b3A6IDEwcHg7XFxyXFxuICAgIGJvdHRvbTogMTBweDtcXHJcXG4gIH1cXHJcXG5cXHJcXG4gICNjb21tZW50cy1wb3B1cCAuaW1nLXdyYXBwZXIge1xcclxcbiAgICB3aWR0aDogMjAwcHg7XFxyXFxuICB9XFxyXFxuXFxyXFxuICAubmV3LWNvbW1lbnQtZm9ybSAqIHtcXHJcXG4gICAgd2lkdGg6IDIwMHB4O1xcclxcbiAgfVxcclxcbn1cXHJcXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107IC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcblxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXG5cbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cblxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcblxuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuXG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpOyAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cblxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH0gLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuXG5cbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcblxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdXBkYXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcblxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cblxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cblxuICBjc3MgKz0gb2JqLmNzcztcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnLi9zdHlsZS5jc3MnO1xuaW1wb3J0IHsgZmV0Y2hTaG93IH0gZnJvbSAnLi4vbW9kdWxlcy9hcGktZmV0Y2hlcy5qcyc7XG5pbXBvcnQgY3JlYXRlU2hvd0NhcmQgZnJvbSAnLi4vbW9kdWxlcy9zaG93LWNhcmQuanMnO1xuXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2hvd3MtcHJldmlldycpO1xuY29uc3Qgc2hvd3NJZHMgPSBbNzMsIDMzMzUyLCA2OSwgMjE4NDUsIDYwLCAxMDBdO1xuXG5zaG93c0lkcy5mb3JFYWNoKChzaG93SWQpID0+IHtcbiAgZmV0Y2hTaG93KCdzaG93cycsIHNob3dJZCkudGhlbigoc2hvdykgPT4ge1xuICAgIGNyZWF0ZVNob3dDYXJkKGNvbnRhaW5lciwgc2hvdywgc2hvd0lkKTtcbiAgfSk7XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=