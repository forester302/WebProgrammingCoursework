import {get} from "/network.js"

async function updateFinishers() {
	const json = await get("/timer");
	const stopped = json.stopped;
	const start_time = json.start_time;

	const finish_table = document.querySelector("#finishers");

	let runners;
	if (stopped) {
		runners = await get("/get_runners");
	} else {
		runners = await get("/get_finishers");
	}
    console.log(runners);
	for (let runner in runners) {
		const data = runners[runner];

		const row = document.querySelector("#finish-template").content.cloneNode(true);
		row.querySelector(".runner").innerText = data.runner;

		if (data.checkpoint == 0) {
			const time_ = data.time - start_time;
			row.querySelector(".millisecond").textContent = time_ % 1000;

			const seconds_full = Math.floor(time_ / 1000);
			row.querySelector(".second").textContent = seconds_full % 60;

			const minutes_full = Math.floor(seconds_full / 60);
			row.querySelector(".minute").textContent = minutes_full % 60;

			const hours_full = Math.floor(minutes_full / 24);
			row.querySelector(".hour").textContent = hours_full % 24;
		} else {
			row.querySelector(".result").innerText = "DNF";
		}

		finish_table.appendChild(row);
	}
}

updateFinishers();
