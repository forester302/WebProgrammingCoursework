import express from 'express';
import * as db from './db.js';

const app = express();
const port = 8080;

db.createDatabase();

function setTimer(req, res) {
  const timer = req.body;
  res.send(db.updateTimer(req.body.race, timer));
}

function getTimer(req, res) {
  res.send(db.getTimer(req.body.race));
}

function activateCheckpoint(req, res) {
  //const x = db.runnerCanActivateCheckpoint(req.body.runner, req.body.checkpoint);
  // res.status(200).send(x);
  //if (!(x)) {
    //res.status(404).send(x);
    //return;
  //}
  db.addPositionFromRace(req.body.i, req.body.runner, req.body.race);
  res.send({ success: true });
}

function timeCheckpoint(req, res) {
  db.addTimeFromRace(req.body.i, req.body.time, req.body.race);
  res.send({ success: true });
}

function addCheckpoint(req, res) {
  db.addCheckpoint(1, req.body.name, false);
  res.send({ success: true });
}

function getCheckpoint(req, res) {
  res.send(db.getCheckpoints(1));
}

function getFinishers(req, res) {
  res.send(db.getFinishers());
}

function getRunners(req, res) {
  res.send(db.getRunners(req.body.race));
}

function getAccessLevel(req, res) {
  const user = req.body.user;
  const race = req.body.race;
  const role = db.getUserRole(race, user);
  res.send([role]);
}

function getRaces(req, res) {
  res.send(db.getRaces());
}

function addRace(req, res) {
  const name = req.body.name;
  const user = req.body.user;
  db.addRace(name, user);
  res.send({ success: true });
}

function join(req, res) {
  const user = req.body.user;
  const race = req.body.race;
  const role = req.body.role;
  db.joinRace(race, user, role);
  res.send({ success: true });
}

function addUserToRace(req, res) {
  const name = req.body.name;
  const race = req.body.race;
  const id = db.addUser(name);
  db.joinRace(race, id, 'runner');
  res.send({ id });
}

function getIRunner(req, res) {
    const race = req.body.race;
    let i = db.getIRunner(race);
    res.send({ value: i.id + 1 })
}

function getITime(req, res) {
    const race = req.body.race;
    let i = db.getITime(race);
    res.send({ value: i.id + 1 })
}

function getTimes(req, res) {
    const race = req.body.race;
    res.send(db.getTimes(race));
}

app.use(express.json());

app.post('/set_timer', setTimer);
app.post('/timer', getTimer);
app.post('/checkpoint', activateCheckpoint); // set a runner at a checkpoint
app.post('/time', timeCheckpoint);
app.post('/add_checkpoint', addCheckpoint);
app.get('/checkpoints', getCheckpoint); // return a list of checkpoints
app.get('/get_finishers', getFinishers); // return a list of runners who have finished the current race
app.post('/get_times', getTimes);
app.post('/get_runners', getRunners); // return a list of runner ids for runners who are registered for this race
app.post('/access_level', getAccessLevel); // return a list of runners for a given list of ids
app.get('/get_races', getRaces);
app.post('/add_race', addRace);
app.post('/join', join);
app.post('/add_user_to_race', addUserToRace);
app.post('/i_runner', getIRunner);
app.post('/i_time', getITime);

app.use(
  express.static('static', {
    extensions: ['htm', 'html'],
  }),
);

  console.log(`Listening on port: ${port}`);
// Delete for prop
import https from 'https';
import fs from 'fs';

const options = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem'),
};

//app.listen(port, () => {
https.createServer(options, app).listen(port, '0.0.0.0', () => {
  console.log(`Listening on port: ${port}`);
})
