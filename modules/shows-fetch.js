export default function fetchShow(endpoint, id, embed = '') {
  
  const fetching = fetch(`https://api.tvmaze.com/${endpoint}/${id}${embed}`)
    .then((response) => response.json());
  return fetching;
}
