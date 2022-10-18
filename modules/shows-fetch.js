export default async function fetchShow(endpoint, id, embed) {
  if (embed) {
    embed = `?embed=${embed}`;
  } else {
    embed = '';
  }
  const fetching = await fetch(`https://api.tvmaze.com/${endpoint}/${id}${embed}`)
    .then((response) => response.json());
  return fetching;
}
