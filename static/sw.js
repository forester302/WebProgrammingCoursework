console.log("Service Worker script loading")

async function interceptFetch(evt) {
    evt.respondWith(handleFetch(evt.request));
    evt.waitUntil(updateCache(evt.request));
}

async function handleFetch(req) {
    const c = await caches.open(CACHE);
    const cachedCopy = await c.match(req);
    if (cachedCopy) {
        return cachedCopy
    } else {
        const r = await fetch(req)
        if (r.ok) {
            return r
        } else {
            return Promise.reject(new Error('no-match'));
        }
    }
}

async function updateCache() {
    const c = await caches.open(CACHE);
    const response = await fetch(request);
    console.log('Updateing cache ', request.url);
    return c.put(request, response);
}

const CACHE = 'racetimer';
const CACHEABLE = [
    './',
    './index.html',
    './account.js',
    './checkpoint.js',
    './finish',
    './finishers.js',
    './network.js',
    './race',
    './race.js',
    './races.js',
    './timer.js',
    './upload.js',
    './css/style.css',
];

async function prepareCache() {
    const c = await caches.open(CACHE);
    await c.addAll(CACHEABLE);
    console.log('Cache prepared.');
}

console.log("Service Worker script loading")

self.addEventListener('install', prepareCache);

self.addEventListener('fetch', interceptFetch);
