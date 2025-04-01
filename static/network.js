function setup_defer() {
	const defer = window.localStorage.getItem("defer");
	if (defer === null || defer == "") window.localStorage.setItem("defer", "[]");
}

async function get(url) {
	if (navigator.onLine) {
		const data = await (await fetch(url)).json();
		window.localStorage.setItem(url.slice(1), JSON.stringify(data));
        return data;
	}
	const local = window.localStorage.getItem(url.slice(1));
	if (!(local === null) && local !== "") {
		return JSON.parse(local);
	}
    return null; // As we cannot get any data
}

async function post(url, body) {
	const data = post_nodefer(url, body);
	if (data != null) return data;

	// Append request to list of requests to send when online in local storage
	let defer_list = JSON.parse(window.localStorage.getItem("defer"));
	defer_list.push({
		url: url,
		body: body,
	});
	window.localStorage.setItem("defer", JSON.stringify(defer_list));

	return null; // as we cannot get any data (use defaults / from local storage)
}

async function post_nodefer(url, body) {
	if (!navigator.onLine) return null;
	console.log("sending req");
	return await (
		await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		})
	).json();
}

function handle_online() {
	const defered_post = JSON.parse(window.localStorage.getItem("defer"));
	window.localStorage.setItem("defer", "[]");

	for (const p of defered_post) {
		post(p.url, p.body);
	}
}

setup_defer();
window.addEventListener("online", handle_online);

export { get, post, post_nodefer };
