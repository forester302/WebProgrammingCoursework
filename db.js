import sqlite from 'node:sqlite';
import fs from 'fs';

let db;

function createDatabase() {
    const dbExists = fs.existsSync('database.db');
    db = new sqlite.DatabaseSync('database.db');
    if (!dbExists) {
        db.exec(fs.readFileSync('./create.sql').toString());
    }
}

function addUser(name) {
    console.log(name);
    const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
    const res = stmt.run(name);
    return res.lastInsertRowid;
}

function addRace(name, owner) {
    console.log(name, owner);
    const stmt = db.prepare('INSERT INTO races (owner, name) VALUES (?, ?)');
    const res = stmt.run(owner, name);
    const raceid = res.lastInsertRowid;

    const stmt2 = db.prepare('INSERT INTO user_races (race, user, role) VALUES (?, ?, ?)');
    stmt2.run(raceid, owner, 'owner');
    
    addCheckpoint(raceid, 'End', true);

    return raceid;
}

function getRaces() {
    const stmt = db.prepare('SELECT id, name FROM races');
    const res = stmt.all();
    return res;
}

function joinRace(race, user, role) {
    const stmt = db.prepare('INSERT INTO user_races (race, user, role) VALUES (?, ?, ?)');
    stmt.run(race, user, role);
}

function getUserRole(race, user) {
    const stmt = db.prepare('SELECT role FROM user_races WHERE race = ? AND user = ?');
    const role = stmt.get(race, user);
    if (role === undefined) {
        return 'default';
    } else {
        return role.role;
    }
}

function isUserOwner(race, user) {
    const stmt = db.prepare('SELECT 1 FROM races WHERE id = ? AND owner = ?');
    const res = stmt.get(race, user);
    return !(res === undefined);
}


function addCheckpoint(race, name, isend) {
    const stmt = db.prepare(
        'INSERT INTO checkpoints (race, display, isend) VALUES (?, ?, ?)',
    );
    stmt.run(race, name, isend ? 1 : 0);
}

function getCheckpoints(race) {
    const stmt = db.prepare(
        'SELECT id, display, isend FROM checkpoints WHERE race = ?',
    );
    const res = stmt.get(race);
    return res;
}

function updateTimer(race, timer) {
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
    console.log(timer, race)
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

function getTimer(race) {
    const stmt = db.prepare(
        'SELECT start_time, stopped_at, stopped FROM races WHERE id == ?',
    );
    const timer = stmt.get(race);
    return timer;
}

function getEndForRace(race) {
    const stmt = db.prepare(
        'SELECT id FROM checkpoints WHERE race = ? AND isend = TRUE;',
    );
    const id = stmt.get(race).id;
    return id;
}

function addUserToRace(user, race) {
    const stmt = db.prepare('INSERT INTO user_races (user, races) VALUES (?, ?)');
    stmt.run(user, race);
}

function addTime(id, time, checkpoint) {
    const stmt = db.prepare(
        'INSERT INTO times (id, time, checkpoint) VALUES (?, ?, ?)',
    );
    console.log(id, time, checkpoint);
    stmt.run(id, time, checkpoint);
}

function addTimeFromRace(id, time, race) {
    const checkpoint = db.prepare(
        'SELECT c.id FROM checkpoints c WHERE c.isend = 1 AND c.race = ?',
    ).get(race).id;

    const stmt = db.prepare(
        'INSERT INTO times (id, time, checkpoint) VALUES (?, ?, ?)',
    );
    console.log(id, time, checkpoint);
    stmt.run(id, time, checkpoint);
}

function addPosition(id, user, checkpoint) {
    const race = db.prepare(
        'SELECT c.race FROM checkpoints c WHERE c.id = ?',
    ).get(checkpoint).race;
    const stmt = db.prepare(
        'INSERT INTO positions (id, user, race) VALUES (?, ?, ?)',
    );
    console.log(race);
    stmt.run(id, user, race);
}

function addPositionFromRace(id, user, race) {
    const stmt = db.prepare(
        'INSERT INTO positions (id, user, race) VALUES (?, ?, ?)',
    );
    console.log(race);
    stmt.run(id, user, race);
}

function runnerCanActivateCheckpoint(r, c) {
    const stmt = db.prepare(
        `SELECT * FROM users u 
         JOIN user_races ON u.id = user_races.user
         JOIN races ON user_races.race = races.id
         JOIN checkpoints c on c.race = races.id
         WHERE u.id = ? AND c.id = ?`,
    );
    const res = stmt.get(r, c);
    return res;
}

function getFinishers() {
    const stmt = db.prepare(
        `SELECT
            u.id AS user_id,
            u.name AS user_name,
            r.id AS race_id,
            r.name AS race_name,
            t.time AS finish_time
        FROM users u
        JOIN user_races ur ON u.id = ur.user
        JOIN positions p ON u.id = p.user
        JOIN races r ON p.race = r.id
        JOIN times t ON p.id = t.id
        JOIN checkpoints c ON t.checkpoint = c.id
        WHERE c.isend = 1 AND ur.role = 'runner'
        ORDER BY t.time ASC, u.id ASC`,
    );
    return stmt.all();
}

function getTimes(race) {
    const stmt = db.prepare(
        `SELECT
            u.id AS user_id,
            u.name AS user_name,
            t.time AS finish_time
        FROM users u
        JOIN user_races ur ON u.id = ur.user
        LEFT JOIN positions p ON u.id = p.user
        JOIN races r ON ur.race = r.id
        LEFT JOIN times t ON p.id = t.id
        LEFT JOIN checkpoints c ON t.checkpoint = c.id AND c.isend = 1
        WHERE r.id = ? AND ur.role = 'runner'
        ORDER BY t.time ASC NULLS LAST, u.id ASC`
    );
    return stmt.all(race);
}

function getRunners(race) {
    const stmt = db.prepare(
        `SELECT 
            u.id AS user_id,
            u.name AS user_name
        FROM users u
        JOIN user_races ur ON u.id = ur.user
        WHERE ur.race = ? AND ur.role = 'runner'
        ORDER BY u.id ASC;`,
    );
    return stmt.all(race);
}

function getRunnersWithTimes(race) {
    const stmt = db.prepare(
        `SELECT 
            u.id AS user_id,
            u.name AS user_name
        FROM users u
        JOIN user_races ur ON u.id = ur.user
        WHERE ur.race = ? AND ur.role = 'runner'
        ORDER BY u.id ASC;`,
    );
    return stmt.all(race);
}

function getIRunner(race) {
    const stmt = db.prepare(
        `SELECT MAX(id) AS id FROM positions WHERE race=?`
    )
    return stmt.get(race)
}

function getITime(race) {
    const stmt = db.prepare(
        `SELECT MAX(t.id) AS id FROM times t JOIN checkpoints c ON t.checkpoint = c.id WHERE race=?`
    )
    return stmt.get(race)
}

function addUserBatch(users, race) {
    const userIds = []

    const addUserStmt = db.prepare(`INSERT INTO users (name) VALUES (?)`)
    const joinRaceStmt = db.prepare(`INSERT OR IGNORE INTO user_races (race, user, role) VALUES (?, ?, ?)`)
    const exisitingUserStmt = db.prepare(`SELECT id FROM users WHERE id = ?`)
    const addUserWithId = db.prepare(`INSERT INTO users (id, name) VALUES (?, ?)`)

    for (const user of users) {
        let userId;
        console.log(user);

        if (user.id != null && user.id != undefined && user.id !== "") {
            const existingUser = exisitingUserStmt.get(user.id);
            if (!existingUser) {
                addUserWithId.run(user.id, user.name);
                userId = user.id;
            } else {
                userId = user.id;
            }
        } else {
            console.log("Adding User")
            const res = addUserStmt.run(user.name);
            userId = res.lastInsertRowid;
        }

        console.log(userId)
        joinRaceStmt.run(race, userId, 'runner')

        userIds.push({
            id: userId,
            name: user.name
        })
    }

    return userIds
}
export {
    createDatabase,
    addUser,
    addRace,
    getEndForRace,
    addUserToRace,
    addTime,
    addTimeFromRace,
    addPosition,
    addPositionFromRace,
    getTimer,
    updateTimer,
    addCheckpoint,
    getCheckpoints,
    isUserOwner,
    getRaces,
    joinRace,
    getUserRole,
    runnerCanActivateCheckpoint,
    getFinishers,
    getRunners,
    getTimes,
    getRunnersWithTimes,
    getIRunner, getITime,
    addUserBatch
};
