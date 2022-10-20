export function fetchShow(endpoint, id, embed = '') {
  const fetching = fetch(`https://api.tvmaze.com/${endpoint}/${id}${embed}`)
    .then((response) => response.json());
  return fetching;
}

export function fetchPostInv(endpoint, Obj) {
  return fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/kN7H2rbNR2T7ibxmLmef${endpoint}`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(Obj),
  }).then((response) => response);
}

export function fetchGetInv(endpoint) {
  return fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/kN7H2rbNR2T7ibxmLmef${endpoint}`)
    .then((response) => response.json());
}
