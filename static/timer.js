import { get, get_with_race, postNoDefer } from './network.js';

const race = Number(localStorage.getItem("race"));
function getTimerDom() {
    const hour = document.querySelector('#hour');
    const minute = document.querySelector('#minute');
    const second = document.querySelector('#second');
    const ms = document.querySelector('#millisecond');
    return { hourEl: hour, minuteEl: minute, secondEl: second, msEl: ms };
}

function updateTimerDom(timer) {
    const { hourEl, minuteEl, secondEl, msEl } = getTimerDom();
    // if (timer.paused) return;
    let time;
    if (timer.stopped) {
        time = timer.stopped_at - timer.start_time; // - timer.skipped;
    } else {
        time = Date.now() - timer.start_time; // - timer.skipped;
    }
    msEl.textContent = (time % 1000).toString().padStart(3, '0') + 'ms';
    const secondsFull = Math.floor(time / 1000);
    secondEl.textContent = (secondsFull % 60).toString().padStart(2, '0') + 's';
    const minutesFull = Math.floor(secondsFull / 60);
    minuteEl.textContent = (minutesFull % 60).toString().padStart(2, '0') + 'm';
    const hoursFull = Math.floor(minutesFull / 24);
    hourEl.textContent = (hoursFull % 24).toString().padStart(2, '0') + 'h';
}

async function toggleTimer(timer) {
    const button = document.querySelector('#start');
    if (timer.stopped) {
        timer.start_time = Date.now();
        // timer.skipped = 0;
        // timer.paused = false;
        timer.stopped = false;
        button.innerText = 'Stop';
    } else {
        timer.stopped = true;
        timer.stopped_at = Date.now();
        button.innerText = 'Start';
    }
    await updateTimer(timer);
    if (timer.stopped) {
        window.location.href = '/finish';
    }
}

async function syncTimer(timer) {
    const res = await postNoDefer(timer);
    if (res != null) {
        timer.start_timer = res.start_time;
        timer.stopped_at = res.stopped_at;
        timer.stopped = res.stopped;
        localStorage.setItem('timer', JSON.stringify(timer));
    }
}

function setupTimerEvents(timer) {
    const button = document.querySelector('#start');
    if (!timer.stopped) {
        button.innerText = 'Stop';
    }
    if (button === undefined) return;
    button.addEventListener('click', () => toggleTimer(timer));

    console.log('timer setup');
}

async function setupTimer() {
    let timer = await get_with_race('timer', race);
    if (timer === null) timer = JSON.parse(localStorage.getItem('timer'))[race];

    setInterval(() => updateTimerDom(timer), 1);

    window.addEventListener('online', () => syncTimer(timer));

    await setupTimerEvents(timer);
}

async function updateTimer(timer) {
    const storage = JSON.parse(window.localStorage.getItem('timer'));
    storage[race] = timer
    window.localStorage.setItem('timer', JSON.stringify(storage));
    timer.race = race
    await postNoDefer('/set_timer', timer);
}

setupTimer();
