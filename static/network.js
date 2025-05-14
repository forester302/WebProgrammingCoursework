function setupLocalStorage(loc, def) {
    const storage = window.localStorage.getItem(loc);
    if (storage === null || storage === '') window.localStorage.setItem(loc, def);
}

function setupStorage() {
  setupLocalStorage('defer', '[]')
  setupLocalStorage('get_runners', '{}')
  setupLocalStorage('checkpoints', '{}')
  setupLocalStorage('i_runner', '{}')
  setupLocalStorage('i_time', '{}')
  setupLocalStorage('get_times', '{}')
  setupLocalStorage('timer', '{}')
}

async function get(url) {
  if (navigator.onLine) {
    const data = await (await fetch(url)).json();
    window.localStorage.setItem(url.slice(1), JSON.stringify(data));
    return data;
  }
  const local = window.localStorage.getItem(url.slice(1));
  if (!(local === null) && local !== '') {
    return JSON.parse(local);
  }
  return null; // As we cannot get any data
}

async function get_with_race(url, race) {
    let data = await postNoDefer(url, {race});
    if (data.value) {
        data = data.value;
    }
    let storage = JSON.parse(window.localStorage.getItem(url));
    if (data != null) {
        console.log(data);
        storage[race] = data;
        window.localStorage.setItem(url, JSON.stringify(storage));
    } else {
        return storage[race];
    }
    return data;
}

async function set_with_race(url, race, data) {
    let storage = JSON.parse(window.localStorage.getItem(url));
    storage[race] = data;
    window.localStorage.setItem(url, JSON.stringify(storage));
}

async function post(url, body) {
  const data = await postNoDefer(url, body);
  if (data != null) return data;

  // Append request to list of requests to send when online in local storage
  const deferList = JSON.parse(window.localStorage.getItem('defer'));
  deferList.push({
    url,
    body,
  });
  window.localStorage.setItem('defer', JSON.stringify(deferList));

  return null; // as we cannot get any data (use defaults / from local storage)
}

async function postNoDefer(url, body) {
  if (!navigator.onLine) return null;
  console.log('sending req');
  return await (
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  ).json();
}

function handleOnline() {
  const deferedPost = JSON.parse(window.localStorage.getItem('defer'));
  window.localStorage.setItem('defer', '[]');

  for (const p of deferedPost) {
    post(p.url, p.body);
  }
}


async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('./sw.js');
  }
}
registerServiceWorker();

setupStorage();
window.addEventListener('online', handleOnline);

export { get, get_with_race, set_with_race, post, postNoDefer };
