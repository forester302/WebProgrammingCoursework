import { get, get_with_race, set_with_race, post } from './network.js';

let race = Number(localStorage.getItem('race'));
let i_time = await get_with_race("i_time", race);
let i_runner = await get_with_race("i_runner", race);

document.querySelector("#recordedtimes").innerText = "Times Recorded: " + (i_time - 1)
document.querySelector("#recordedrunners").innerText = "Runners Recorded: " + (i_runner - 1)


async function recordTime() {
    // const checkpoint = document.querySelector('#checkpoint');
    await post('/time', {
        i: i_time,
        time: Date.now(),
        //checkpoint: 1,
        race,
    });
    i_time += 1;

    document.querySelector("#recordedtimes").innerText = "Times Recorded: " + (i_time - 1)
    set_with_race("i_time", race, i_time);
}

async function recordRunner() {
    const runner = document.querySelector('#runnernumber');
    // const checkpoint = document.querySelector('#checkpoint');
    await post('/checkpoint', {
        i: i_runner,
        runner: Number(runner.value),
        //checkpoint: 1,
        // checkpoint: checkpoint.value,
        race
    });
    i_runner += 1;
    document.querySelector("#recordedrunners").innerText = "Runners Recorded: " + (i_runner - 1)
    set_with_race("i_runner", race, i_runner);
}

function addCheckpoint() {
    const name = document.querySelector('#addcheckpoint');
    post('/add_checkpoint', {
        name: name.value,
    });
    const dropdown = document.querySelector('#checkpoint');
    const option = document.createElement('option');
    option.value = name.value;
    option.innerText = name.value;
    dropdown.append(option);
}

document
    .querySelector('#recordrunner')
    .addEventListener('click', recordRunner);

document.querySelector('#recordtime').addEventListener('click', recordTime);

document
    .querySelector('#addcheckpointbutton')
    .addEventListener('click', addCheckpoint);

async function getCheckpoints() {
    let checkpoints = await get('/checkpoints');
    if (checkpoints === null) {
        checkpoints = JSON.parse(window.localStorage.getItem('checkpoints'));
    } else {
        window.localStorage.setItem('checkpoints', JSON.stringify(checkpoints));
    }
    return checkpoints;
}

async function setupCheckpoints() {
    const checkpoints = await getCheckpoints();

    // const dropdown = document.querySelector('#checkpoint');
    // eslint-disable-next-line
    // for (const cp in checkpoints) {
    //   const option = document.createElement('option');
    //   option.value = cp;
    //   option.innerText = checkpoints[cp].display;
    //   dropdown.append(option);
    // }
    console.log(checkpoints);
}

setupCheckpoints();
