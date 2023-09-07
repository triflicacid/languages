const inputSv = document.getElementById("inp-sv");
const inputPlural = document.getElementById("inp-pl");
const inputEn = document.getElementById("inp-en");
const selectGender = document.getElementById("sel-gender");
const inputClass = document.getElementById("inp-class");
const inputTags = document.getElementById("inp-tags");
const textareaComment = document.getElementById("txt-comment");
const btnCreate = document.getElementById("btn-create");

const socket = connectToSocket();

socket.on("word-exists", sv => {
    alert(`An entry for ${sv} already exists.`);
    inputSv.select();
});

inputSv.addEventListener("change", () => {
    const word = inputSv.value.trim();
    if (word) socket.emit("word-exists", word);
});

function createWord() {
    const data = {};
    data.Word = inputSv.value.trim();
    data.Plural = inputPlural.value.trim();
    data.En = inputEn.value.trim().split(",").map(x => x.trim());
    data.Gender = selectGender.value;
    data.Class = inputClass.value;
    data.Tags = inputTags.value;
    data.Comment = textareaComment.value.trim();
    console.log(data);
    socket.emit("create-word", data);
}

btnCreate.addEventListener("click", createWord);
document.body.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === 'Enter') createWord();
});

socket.on("alert", text => {
    window.alert(text);
});
socket.on("create-word", id => {
    alert(`Created word. ID: ${id}`);
    inputSv.value = "";
    inputPlural.value = "";
    inputEn.value = "";
    selectGender.value = "";
    textareaComment.value = "";
    for (const el of document.querySelectorAll(".inp-iv")) el.value = "";
    inputSv.focus();
});

socket.emit("get-word-classes");
socket.emit("get-word-categories");