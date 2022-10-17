export default async function fetchShow(id) {
  const fetching = await fetch(`https://api.tvmaze.com/lookup/shows?thetvdb=${id}`)
    .then((response) => response.json());
  return fetching;
}
