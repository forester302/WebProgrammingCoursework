import sqlite from "node:sqlite";
import fs from "fs";

let db;

function create_database() {
	db = new sqlite.DatabaseSync("database.db");
	db.exec(fs.readFileSync("./create.sql").toString());
}

function add_user(name) {
	const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
	const res = stmt.run(name);
	return res.lastInsertRowid;
}

function add_race(owner) {
	const stmt = db.prepare("INSERT INTO races (owner) VALUES (?)");
	const res = stmt.run(owner);
	const raceid = res.lastInsertRowid;

	add_checkpoint(raceid, "End", true);

	return raceid;
}

function add_checkpoint(race, name, isend) {
	const stmt = db.prepare(
		"INSERT INTO checkpoints (race, display, isend) VALUES (?, ?, ?)",
	);
	const res = stmt.run(race, name, isend ? 1 : 0);
}

function get_checkpoints(race) {
    const stmt = db.prepare(
        "SELECT id, display, isend FROM checkpoints WHERE race = ?"
    );
    const res = stmt.get(race);
    return res;
}

function update_timer(race, timer) {
	const stmt = db.prepare(
		`UPDATE races
         SET
            start_time = ?,
            stopped_at = ?,
            stopped = ?
         WHERE id = ?
         AND (? > start_time OR ? > stopped_at)
         RETURNING start_time, stopped_at, stopped;`,
	);
	const res = stmt.get(
		timer.start_time,
		timer.stopped_at,
		timer.stopped ? 1 : 0,
		race,
		timer.start_time,
		timer.stopped_at,
	);
	return res;
}

function get_timer(race) {
	const stmt = db.prepare(
		"SELECT start_time, stopped_at, stopped FROM races WHERE id == ?",
	);
	const timer = stmt.get(race);
	return timer;
}

function get_end_for_race(race) {
	const stmt = db.prepare(
		"SELECT id FROM checkpoints WHERE race = ? AND isend = TRUE;",
	);
	const id = stmt.get(race).id;
	return id;
}

function add_user_to_race(user, race) {
	const stmt = db.prepare("INSERT INTO user_races (user, races) VALUES (?, ?)");
	const res = stmt.run(user, race);
}

function add_time(id, time, checkpoint) {
	const stmt = db.prepare(
		"INSERT IGNORE INTO times (id, time, checkpoint) VALUES (?, ?, ?)",
	);
	const res = stmt.run(id, time, checkpoint);
}

function add_position(id, user, race) {
	const stmt = db.prepare(
		"INSERT IGNORE INTO positions (id, user, race) VALUES (?, ?, ?)",
	);
	const res = stmt.run(id, user, race);
}
export {
	create_database,
	add_user,
	add_race,
	get_end_for_race,
	add_user_to_race,
	add_time,
	add_position,
	get_timer,
	update_timer,
	add_checkpoint,
    get_checkpoints,
};
