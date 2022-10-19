export default function commentsCounter(commentsContainer) {
  let count = 0;
  const comments = commentsContainer.querySelectorAll('span');
  comments.forEach(() => {
    count += 1;
  });
  return count;
}