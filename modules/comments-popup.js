function createCommentsPopup(showObj) {
  const popupWindow = document.createElement('div');
  popupWindow.innerHTML = `
    <div id="comments-popup">
      <div class="img-wrapper">
          <img src="">IMAGE
      </div>
      <h2 class="show-name">BlackList</h2>
      <div class="details">
          <span>Genre: Drama</span>
          <span>Episodes: 24</span>
          <span>Created by: Jhon Doe</span>
      </div>
    </div>
  `;
  document.appendChild(popupWindow);
}