const socket = connectToSocket();
const resultOutput = document.getElementById("result_output");

function search(){
	const QUERY=document.getElementById("search_query").value;
	const ORDER=document.getElementById("search_order").value;
	const USING=document.getElementById("search_using").value;
	const WT=document.getElementById("word_type").value;
	const DB=document.getElementById("search_db").value;

	socket.emit("wordlist-search", {
		query: QUERY,
		order: ORDER,
		using: USING,
		type: WT,
	});
}

socket.on("wordlist-search", res => {
	const table = document.createElement("table");
	table.classList.add("list");
	const thead = table.createTHead();

	// Search columns
	let tr = document.createElement("tr");
	thead.appendChild(tr);
	tr.insertAdjacentHTML("beforeend", "<th/>");
	tr.insertAdjacentHTML("beforeend", "<th>Latin <input type='checkbox' onchange='hideshow(\"latin\",this.checked)'title='Hide Column'></th>");
	tr.insertAdjacentHTML("beforeend", "<th>English <input type='checkbox'onchange='hideshow(\"english\",this.checked)'title='Hide Column'></th>");
	tr.insertAdjacentHTML("beforeend", "<th>Word Class <input type='checkbox'onchange='hideshow(\"type\",this.checked)'title='Hide Column'></th>");
	tr.insertAdjacentHTML("beforeend", "<th>Word Endings <input type='checkbox'onchange='hideshow(\"endings\",this.checked)'title='Hide Column'></th>");

	const tbody = table.createTBody();
	res.result.forEach(row => {
		tr = document.createElement("tr");
		tr.classList.add("row");
		tr.dataset.wordid = row.ID;
		tbody.appendChild(tr);

		tr.insertAdjacentHTML("beforeend", `<td data-content='selectword'><input class='selectWordCheckbox' type='checkbox' onclick='selectWord(this)' /></td>`);
		tr.insertAdjacentHTML("beforeend", `<td data-content='latin'>${res.query.using === 'word' ? row.word.replace(res.query.query, "<highlight>" + res.query.query + "</highlight>") : row.word}</td>`);
		tr.insertAdjacentHTML("beforeend", `<td data-content='english'>${res.query.using === 'translation' ? row.translation.replace(res.query.query, "<highlight>" + res.query.query + "</highlight>") : row.translation}</td>`);
		tr.insertAdjacentHTML("beforeend", `<td data-content='type' data-type='${row.type}'>${row.type}</td>`);
		tr.insertAdjacentHTML("beforeend", `<td data-content='endings'>${row.endings}</td>`);
	});

	resultOutput.innerHTML = "";
	resultOutput.appendChild(table);

	for (let element of resultOutput.getElementsByTagName("td")) element.setAttribute("ondblclick","hide(this)");
})

function searchClear(){
	document.getElementById("search_query").value = '';
	search();
}

function hideshow(content,checked,attr='data-content'){
	var elements = document.querySelectorAll("td["+attr+"='"+content+"']");
	if(checked==false){
		for(var element of elements) show(element)
	} else {
		for(var element of elements) hide(element);
	}
}

function show(element){
	element.removeAttribute("blacked");
	element.removeEventListener("click",()=>{show(element)});
	element.addEventListener("dblclick",()=>{hide(element)});
}

function hide(element){
	element.setAttribute("blacked",1);
	element.addEventListener("click",()=>{show(element)});
	element.removeEventListener("dblclick",()=>{hide(element)});
}

function selectWord(el) {
	let row = el.parentNode.parentNode;
	row.dataset.selected = el.checked;
}
