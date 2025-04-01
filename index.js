import express from "express";
import path from "path";
import * as db from "./db.js";

const app = express();
const port = 8080;

db.create_database();

let runners = {
	0: { name: "Ben" },
	1: { name: "Jeff" },
};

let races = [
	{
		checkpoints: [{ display: "End" }],
		end: 0,
		times: {
			0: {
				runner: 0,
				checkpoint: 0,
			},
		},
		checks: {
			0: {
				time: 0,
				checkpoint: 0,
			},
		},
		runners: [0],
	},
];

function set_timer(req, res) {
	const timer = req.body;
	res.send(db.update_timer(1, timer));
}

function get_timer(req, res) {
	res.send(db.get_timer(1));
}

function activate_checkpoint(req, res) {
	if (!(req.body.runner in races[0].runners)) {
		res.status(404).send("Runner Not Found");
		return;
	}
	races[0].times.push(req.body);
	res.send({ success: true });
}

function time_checkpoint(req, res) {
    db.add_time(req.body);
}

function add_checkpoint(req, res) {
    db.add_checkpoint(1, req.body.name, false);
}

function get_checkpoint(req, res) {
	res.send(db.get_checkpoints(1));
}

function get_finishers(req, res) {
	let finishers = [];
	for (let i in races[0].times) {
		if (races[0].times[i].checkpoint == races[0].end) {
			const time = races[0].times[i];
			if (i in races[0].checks) {
				time.time = races[0].checks[i].time;
			}
			finishers.push(time);
		}
	}
	res.send(races[0].times); //finishers);
}

function get_runners(req, res) {
	res.send(races[0].runners);
}

function get_runners_from_id(req, res) {
	let ids = req.body;
	let r = [];
	for (let id of ids) {
		r.push(runners[id]);
	}
	res.send(r);
}

app.use(express.json());

app.post("/timer", set_timer);
app.get("/timer", get_timer);
app.post("/checkpoint", activate_checkpoint); // set a runner at a checkpoint
app.post("/time", time_checkpoint);
app.post("/add_checkpoint", add_checkpoint);
app.get("/checkpoints", get_checkpoint); // return a list of checkpoints
app.get("/get_finishers", get_finishers); // return a list of runners who have finished the current race
app.get("/get_runners", get_runners); // return a list of runner ids for runners who are registered for this race
app.post("/get_runners", get_runners_from_id); // return a list of runners for a given list of ids

app.use(
	express.static("static", {
		extensions: ["htm", "html"],
	}),
);

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
