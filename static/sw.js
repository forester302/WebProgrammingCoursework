async function interceptFetch(evt) {
  const c = await caches.open(CACHE);
  const cachedCopy = await c.match(evt.request);
  if (cachedCopy) {
    const fn = evt.request.url.split('/').pop();
    console.log(`Serving ${fn} from cache.`);
  }
  return cachedCopy || Promise.reject(new Error('no-match'));
}
self.addEventListener('fetch', interceptFetch);

const CACHE = 'hsww';
const CACHEABLE = [
  './',
  './index.html',
  './account.js',
  './checkpoint.js',
  './finish.html',
  './finishers.js',
  './network.js',
  './race.html',
  './race.js',
  './races.js',
  './timer.js',
  './css/style.css',
];

async function prepareCache() {
  const c = await caches.open(CACHE);
  await c.addAll(CACHEABLE);
  console.log('Cache prepared.');
}

self.addEventListener('install', prepareCache);

self.addEventListener('fetch', interceptFetch);
