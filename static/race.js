import { post, postNoDefer, get, get_with_race } from './network.js';
import { getAccessLevel } from './account.js';

const accessLevel = localStorage.getItem('access_level');
if (accessLevel === 'owner') {
  document.querySelector('#start').classList.toggle('hidden');
  document.querySelector('#helper').classList.toggle('hidden');
  document.querySelector('#step-down-helper').classList.toggle('hidden');
} else if (accessLevel === 'helper') {
  document.querySelector('#helper').classList.toggle('hidden');
} else if (accessLevel === 'runner') {
  document.querySelector('#runner').classList.toggle('hidden');
} else {
  document.querySelector('#join').classList.toggle('hidden');
}

document.querySelector("#back").addEventListener('click', () => {
    window.location.href = "/"
})

document.querySelector("#board").addEventListener('click', () => {
    window.location.href = "/finish"
})

document.querySelector('#join-as-helper').addEventListener('click', async () => {
  await post('/join', {
    race: localStorage.getItem('race'),
    user: localStorage.getItem('user'),
    role: 'helper',
  });
  getAccessLevel();
  window.location.reload();
});
document.querySelector('#join-as-runner').addEventListener('click', async () => {
  await post('/join', {
    race: localStorage.getItem('race'),
    user: localStorage.getItem('user'),
    role: 'runner',
  });
  getAccessLevel();
  window.location.reload();
});

async function addUser() {
  const row = document.querySelector('#usertablerowtemplate').content.cloneNode(true);
  const name = document.querySelector('#adduser').value;
  const header = document.querySelector('#userstableheader');
  const userid = row.querySelector('.userid');
  userid.innerText = 'id';
  row.querySelector('.username').innerText = name;
  header.after(row);

  const id = await postNoDefer('/add_user_to_race', {
    race: Number(localStorage.getItem('race')),
    name,
  });

  userid.innerText = id.id;
}
document.querySelector('#adduserbutton').addEventListener('click', addUser);

document.querySelector('#adduser').addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    await addUser();
  }
});

async function setupTable() {
  const runners = await get_with_race('get_runners', localStorage.getItem('race'));
  const header = document.querySelector('#userstableheader');
  for (const runner of runners) {
    const row = document.querySelector('#usertablerowtemplate').content.cloneNode(true);

    row.querySelector('.username').innerText = runner.user_name;
    row.querySelector('.userid').innerText = runner.user_id;

    header.after(row);
  }
}

setupTable();
