import { get, post } from './network.js';

async function loadRaces() {
  const response = await get('/get_races');
  if (response === null) return;

  const list = document.querySelector('#race-list');
  list.innerHTML = '';
  for (const race of response) {
    const item = document.querySelector('#race-template').content.cloneNode(true);
    item.querySelector('.name').innerText = race.name;
    item.querySelector('.id').innerText = race.id;

    item.querySelector('.name').addEventListener('click', () => {
      localStorage.setItem('race', race.id);
      window.location.href = '/race';
    });

    list.appendChild(item);
  }
}

document.querySelector('#create_race').addEventListener('click', () => {
  document.querySelector('#add_race').classList.toggle('hidden');
});

document.querySelector('#create').addEventListener('click', async () => {
  const name = document.querySelector('#race_name').value;

  await post('add_race', {
    name,
    user: Number(localStorage.getItem('user')),
  });

  loadRaces();
});

loadRaces();
