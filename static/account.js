import { postNoDefer } from './network.js';

document.querySelector('#Admin').addEventListener('click', async () => {
  localStorage.setItem('user', 1);
  await getAccessLevel();
  window.location.reload();
});
document.querySelector('#Helper').addEventListener('click', async () => {
  localStorage.setItem('user', 2);
  await getAccessLevel();
  window.location.reload();
});
document.querySelector('#User1').addEventListener('click', async () => {
  localStorage.setItem('user', 3);
  await getAccessLevel();
  window.location.reload();
});
document.querySelector('#User2').addEventListener('click', async () => {
  localStorage.setItem('user', 4);
  await getAccessLevel();
  window.location.reload();
});

export async function getAccessLevel() {
  const accessLevel = await postNoDefer('/access_level', {
    user: Number(localStorage.getItem('user')),
    race: Number(localStorage.getItem('race')),
  });
  localStorage.setItem('access_level', accessLevel[0]);
}
