import { postNoDefer } from "./network.js";
import { setupTable } from "./race.js"

function parseCSV(text) {
    const lines = text.split(/\r\n|\n/)
    console.log(lines)
    const headers = lines[0].split(',').map(header => header.trim());
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue;

        const values = lines[i].split(',').map(value => value.trim());

        console.log(values)
        
        while (values.length < headers.length) {
            values.push('');
        }

        const entry = {};


        let index = 0;
        for (const header of headers) {
            const value = values[index] || '';
            if (header.toLowerCase() === "id" && value != '') {
                entry[header.toLowerCase()] = parseInt(value, 10);
            } else {
                entry[header.toLowerCase()] = value;
            }
            index++;
        }

        results.push(entry);
    }

    return results;
}

async function uploadCSV() {
    const fileInput = document.querySelector("#csv-upload")
    const status = document.querySelector("#upload-status")

    if (!fileInput.files || fileInput.files.length === 0) {
        status.textContent("Please select a CSV file");
        return;
    }

    const file = fileInput.files[0];
    status.textContent = "Reading file"

    const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(e);
        reader.readAsText(file);
    });

    const users = parseCSV(text);

    if (users.length === 0) {
        status.textContent = "No users found in csv"
        return
    }

    if (users.filter(user => !user.name).length > 0) {
        status.textContent = "Invalid users in CSV";
        return
    }

    status.textContent = "Uploading users..."

    const response = await postNoDefer('/add_user_batch', {
        users,
        race: Number(localStorage.getItem('race'))
    });

    if (response !== null) {
        status.textContent = "Added Users"
    }

    document.querySelector("#userstable").remove();
    await setupTable();
}

document.querySelector("#upload-csv").addEventListener("click", uploadCSV);
