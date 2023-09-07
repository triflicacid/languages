function line_open(e) {
	const no = e.getAttribute("no");
	e.style.display = "none";
	document.getElementById("aclose" + no).style.display = "block";

	const notes = document.getElementById("notesfor" + no);
	notes.style.display = notes.style.display === "block" ? "none" : "block";
}

function line_close(e) {
	const no = e.getAttribute("no");
	e.style.display = "none";
	document.getElementById("aopen" + no).style.display = "block";

	const notes = document.getElementById("notesfor" + no);
	notes.style.display = notes.style.display === "block" ? "none" : "block";
}