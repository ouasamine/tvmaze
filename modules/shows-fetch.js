export default async function fetchShow(endpoint, id) {
  const fetching = await fetch(`https://api.tvmaze.com/${endpoint}/${id}`)
    .then((response) => response.json());
  return fetching;
}
