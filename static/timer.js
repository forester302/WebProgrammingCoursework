import { get, post_nodefer } from "/network.js";

function get_timer_dom() {
	let hour = document.querySelector("#hour");
	let minute = document.querySelector("#minute");
	let second = document.querySelector("#second");
	let ms = document.querySelector("#millisecond");
	return { hour_el: hour, minute_el: minute, second_el: second, ms_el: ms };
}

function update_timer_dom(timer) {
	let { hour_el, minute_el, second_el, ms_el } = get_timer_dom();
	//if (timer.paused) return;
	let time;
	if (timer.stopped) {
		time = timer.stopped_at - timer.start_time; //- timer.skipped;
	} else {
		time = Date.now() - timer.start_time; // - timer.skipped;
	}
	ms_el.textContent = time % 1000;
	let seconds_full = Math.floor(time / 1000);
	second_el.textContent = seconds_full % 60;
	let minutes_full = Math.floor(seconds_full / 60);
	minute_el.textContent = minutes_full % 60;
	let hours_full = Math.floor(minutes_full / 24);
	hour_el.textContent = hours_full % 24;
}

function start_timer(timer) {
	timer.start_time = Date.now();
	//timer.skipped = 0;
	//timer.paused = false;
	timer.stopped = false;

	update_timer(timer);
}

/*
function pause_timer(timer) {
    if (timer.stopped) return;
    if (timer.paused) {
        timer.skipped += Date.now() - timer.paused_at;
    } else {
        timer.paused_at = Date.now();
    }
    timer.paused = !timer.paused;
    update_timer(timer);
}
*/

function stop_timer(timer) {
	if (timer.stopped) return;
	timer.stopped = true;
	timer.stopped_at = Date.now();
	update_timer(timer);
}

async function sync_timer(timer) {
	const res = await post_nodefer(timer);
	if (res != null) {
        timer.start_timer = res.start_time;
        timer.stopped_at = res.stopped_at;
        timer.stopped = res.stopped;
		localStorage.setItem("timer", JSON.stringify(timer));
	}
}

function setup_timer_events(timer) {
	let button = document.querySelector("#start");
	if (button == undefined) return;
	button.addEventListener("click", () => start_timer(timer));

	//	document.querySelector("#pause")
	//        .addEventListener("click", () => pause_timer(timer));

	document
		.querySelector("#stop")
		.addEventListener("click", () => stop_timer(timer));

	console.log("timer setup");
}

async function setup_timer() {
	let timer = await get("/timer");
	if (timer === null) timer = JSON.parse(localStorage.getItem("timer"));

	setInterval(() => update_timer_dom(timer), 1);

	window.addEventListener("online", () => sync_timer(timer));

	setup_timer_events(timer);
}

function update_timer(timer) {
	window.localStorage.setItem("timer", JSON.stringify(timer));
	post_nodefer("/timer", timer);
}

setup_timer();
