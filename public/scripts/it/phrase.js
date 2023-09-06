const breadcrumbs = document.querySelector(".breadcrumbs");
const centre = document.querySelector(".centre");

/** Load phrase information */
function load(phrase) {
    const italian = phrase.It;

    // Title
    const h1Title = document.createElement("h1");
    h1Title.innerText = italian;
    h1Title.classList.add("fancy-font");
    elInitSpeak(h1Title);
    centre.appendChild(h1Title);

    // Breadcrumbs
    breadcrumbs.insertAdjacentHTML("beforeend", `&gt; <a>${italian}</a>`);
    setWindowTitle();

    const div = document.createElement("div");
    div.classList.add("indent");
    document.body.appendChild(div);

    // Base phrase definition(s)
    let sect = document.createElement('section');
    div.appendChild(sect);
    sect.insertAdjacentHTML("beforeend", `<ul>${phrase.En.map(x => "<li>" + x + "</li>").join('\n')}</ul>`);
    if (phrase.Image) sect.insertAdjacentHTML("beforeend", `<br><img src='${phrase.Image}' /><br>`);
    if (phrase.Comment) sect.insertAdjacentHTML("beforeend", `<fieldset><legend>Comment</legend><span>${phrase.Comment.replace(/\r\n|\r|\n/g, '<br>')}</span></fieldset>`);
    sect.insertAdjacentHTML("beforeend", "<hr>");
}

const socket = io();
socket.on("get-phrase-info", info => {
    load(info);
});

const params = new URLSearchParams(location.search);
const id = params.has("id") ? +params.get("id") : +prompt("Enter phrase ID");
socket.emit("get-phrase-info", id);