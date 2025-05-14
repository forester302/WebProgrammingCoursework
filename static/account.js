import { postNoDefer } from './network.js';

document.querySelector('#Admin').addEventListener('click', () => {
    switchUser(1)
});
document.querySelector('#Helper').addEventListener('click', () => {
    switchUser(2)
});
document.querySelector('#User1').addEventListener('click', () => {
    switchUser(3)
});
document.querySelector('#User2').addEventListener('click', () => {
    switchUser(4)
});

async function switchUser(id) {
    localStorage.setItem('user', id);

    const access_level = await getAccessLevel();

    if (access_level) {
        window.location.reload()
    } 
}

export async function getAccessLevel() {
    const accessLevel = await postNoDefer('/access_level', {
        user: Number(localStorage.getItem('user')),
        race: Number(localStorage.getItem('race')),
    });
    localStorage.setItem('access_level', accessLevel[0]);
    return accessLevel
}
