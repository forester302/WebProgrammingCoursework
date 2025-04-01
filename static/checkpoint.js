import { get, post, post_nodefer } from "./network.js";

let i_time = 0;
function record_time() {
    const checkpoint = document.querySelector("#checkpoint");
    post("/time", {
        i: i_time,
        time: Date.now(),
        checkpoint: checkpoint.value,
    })
    i_time++;
}

let i_runner = 0;
function record_runner() {
    const runner = document.querySelector("#runnernumber");
    const checkpoint = document.querySelector("#checkpoint");
    post("/checkpoint", {
        i: i_runner,
        id: runner.value,
        checkpoint: checkpoint.value,
    });
    i_runner++;
}

function add_checkpoint() {
    const name = document.querySelector("#addcheckpoint");
    post("/add_checkpoint", {
        name: name.value,
    });
    const dropdown = document.querySelector("#checkpoint");
    const option = document.createElement("option");
    option.value = name.value;
    option.innerText = name.value;
    dropdown.append(option);
}

document
    .querySelector("#recordrunner")
    .addEventListener("click", record_runner);

document.querySelector("#recordtime").addEventListener("click", record_time);

document
    .querySelector("#addcheckpointbutton")
    .addEventListener("click", add_checkpoint);

async function get_checkpoints() {
    let checkpoints = await get("/checkpoints");
    if (checkpoints === null) {
        checkpoints = JSON.parse(window.localStorage.getItem("checkpoints"));
    } else {
        window.localStorage.setItem("checkpoints", JSON.stringify(checkpoints));
    }
    return checkpoints;
}

async function setupCheckpoints() {
    const checkpoints = await get_checkpoints();

    const dropdown = document.querySelector("#checkpoint");
    for (const cp in checkpoints) {
        const option = document.createElement("option");
        option.value = cp;
        option.innerText = checkpoints[cp].display;
        dropdown.append(option);
    }
    console.log(checkpoints);
}

setupCheckpoints();
