import { get, get_with_race } from './network.js';

async function addRunner(table, row_, startTime, name, time, stopped) {
    const row = row_.content.cloneNode(true);
    row.querySelector('.runner').innerText = name;
    if (time !== undefined && time !== null && time > 0 && time - startTime > 0) {
        const time_ = time - startTime;
        //row.querySelector('.millisecond').textContent = time_ % 1000;

        const secondsFull = Math.floor(time_ / 1000);
        row.querySelector('.second').textContent = secondsFull % 60;

        const minutesFull = Math.floor(secondsFull / 60);
        row.querySelector('.minute').textContent = minutesFull % 60;

        const hoursFull = Math.floor(minutesFull / 24);
        row.querySelector('.hour').textContent = hoursFull % 24;
    } else {
        row.querySelector('.result').innerText = stopped ? 'DNF' : '-';
    }
    if (time - startTime >= 0) {
        table.appendChild(row);
    }
}
async function updateFinishers() {
    const json = await get_with_race('timer', Number(window.localStorage.getItem("race")));
    const stopped = json.stopped;
    const startTime = json.start_time;

    const finishTable = document.querySelector('#finishers');
    finishTable.innerText = ""
    const row = document.querySelector('#finish-template');

    let runners;
    runners = await get_with_race('get_times', Number(window.localStorage.getItem("race")));

    console.log(runners);
    // eslint-disable-next-line
    for (const runner in runners) {
        const data = runners[runner];
        addRunner(finishTable, row, startTime, data.user_name, data.finish_time, stopped);
    }
}

setInterval(updateFinishers, 10000);
updateFinishers();
